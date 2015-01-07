'use strict';

var request = require("request"),
    env     = require("require-env"),
    Flickr  = require("../lib/flickr.js");

module.exports = function(req, res, data, callback) {

  var photosMap = {},
      hasGeo    = [];

  function _callback(result) {
    return callback(null, {
      appTitle : 'Geotagger',
      flickr   : result,
      user     : data.user
    });
  }

  //
  // TODO: Start cacheing this
  //
  function getWoe(flickr, photoId, callback) {

    flickr.get("flickr.places.getInfo", {
        "woe_id"         : photosMap[photoId].woeid
    },
    function( error, data, response ) {

      if( response && response.statusCode ) {

        var result = JSON.parse(data);

        photosMap[photoId].place = result;

        hasGeo.splice(hasGeo.indexOf(photoId),1);

        callback();
      } else {
        return callback(error);
      }
    });

  }

  if (data.user) {

    var flickr = new Flickr({
      api_key: env.require("FLICKR_KEY"),
      secret: env.require("FLICKR_SECRET")
    });

    flickr.get("flickr.people.getPublicPhotos", {
        "user_id"        : data.user.id,
        "extras"         : "geo",
        "format"         : "json",
    },
    function( error, data, response ) {

      if( response && response.statusCode ) {

        var result = JSON.parse(data);

        result.photos.photo.forEach(function(photo) {

          photosMap[photo.id] = photo;

          if (photo.woeid) {
            hasGeo.push(photo.id);
          }

        });

        if (hasGeo.length) {

          for (var i=0; hasGeo.length > i; i++) {

            getWoe(flickr, hasGeo[i], function() {

              if (!hasGeo.length) {
                result.photos.photo = Object.keys(photosMap).map(function(id) {
                  return photosMap[id];
                });

                _callback(result);
              }

            });

          }

        } else {
          _callback(result);
        }
      } else {
        return callback(error);
      }
    });

  } else {
    return callback(null, {
      appTitle : 'Geotagger'
    });
  }

};
