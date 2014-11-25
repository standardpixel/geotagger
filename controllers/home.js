'use strict';

var request = require("request"),
    env     = require("require-env"),
    Flickr  = require("flickrapi");

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
    flickr.places.getInfo({
      "woe_id" : photosMap[photoId].woeid
    }, function(err, result) {

      photosMap[photoId].place = result;

      hasGeo.splice(hasGeo.indexOf(photoId),1);

      callback();
    });
  }

  if (data.user) {
    var flickrOptions = {
      api_key: env.require("FLICKR_KEY"),
      secret: env.require("FLICKR_SECRET"),
      access_token: data.user.token,
      access_token_secret: data.user.tokenSecret
    };

    Flickr.authenticate(flickrOptions, function(error, flickr) {
      flickr.people.getPhotos({
        "user_id" : data.user.id,
        "extras"   : "geo"
      }, function(err, result) {

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

      });
    });
  } else {
    return callback(null, {
      appTitle : 'Geotagger'
    });
  }

};
