'use strict';

var request = require("request"),
    env     = require("require-env"),
    Flickr  = require("../lib/flickr.js");

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

    var flickr = new Flickr({
      api_key: env.require("FLICKR_KEY"),
      secret: env.require("FLICKR_SECRET")
    });

    flickr.get("flickr.photos.getInfo", {
      "photo_id" : req.params.id,
      "extras"   : "geo, woe"
    },
    function( error, _data, response ) {

      if( response && response.statusCode ) {

        var result = JSON.parse(_data);

        return callback(null, {
          appTitle : 'Geotagger',
          photo    : result,
          place    : getPlace(result),
          user     : data.user
        });
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
