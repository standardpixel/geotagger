'use strict';

var request = require("request"),
    env     = require("require-env"),
    Flickr  = require("flickrapi");

module.exports = function(req, res, data, callback) {

  var placeHierarchy = ["neighbourhood", "locality", "region", "country"],
      placeObjects   = [];

  function getPlace(photo) {
    placeHierarchy.forEach(function(placeType) {
      if (photo && photo.photo.location && photo.photo.location[placeType]) {
        placeObjects.push(photo.photo.location[placeType]);
      } else {
        return false;
      }
    });

    return placeObjects;
  }

  if (data.user) {
    var flickrOptions = {
      api_key: env.require("FLICKR_KEY"),
      secret: env.require("FLICKR_SECRET"),
      access_token: data.user.token,
      access_token_secret: data.user.tokenSecret
    };

    Flickr.authenticate(flickrOptions, function(error, flickr) {
      flickr.photos.getInfo({
        "photo_id" : req.params.id,
        "extras"   : "geo, woe"
      }, function(err, result) {

        console.log('results',result);

        return callback(null, {
          appTitle : 'Geotagger',
          photo    : result,
          place    : getPlace(result),
          user     : data.user
        });

      });
    });
  } else {
    return callback(null, {
      appTitle : 'Geotagger'
    });
  }

};
