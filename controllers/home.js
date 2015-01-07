'use strict';

var request = require("request"),
    flickr  = require("../lib/flickr.js"),
    woe     = require("../lib/woe.js");

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

    woe.get(photosMap[photoId].woeid, function(err, woe) {

      if (err) {
        console.error(err);
      }

      photosMap[photoId].place = woe;

      hasGeo.splice(hasGeo.indexOf(photoId),1);

      callback();
    });

  }

  if (data.user) {

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
