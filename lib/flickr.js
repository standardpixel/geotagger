"use strict";

var OAuth  = require("client-oauth");

var flickr;

function initFlickr(config) {
  if (!flickr) {
    var oauth = new OAuth[1.0]({
      base: 'https://api.flickr.com/services/rest',
      key: config.api_key,
      secret: config.secret,
      signature_method: 'HMAC-SHA1',
      headers: {
        'Accept': '*/*',
        'Connection': 'Close',
        'User-Agent': 'node.js/client-oauth'
      }
    });

    flickr = new oauth.Client();
  }
}

module.exports = function Flickr(config) {

  var that = this;

  initFlickr(config);

  function get(method, args, callback) {
    args.method         = method;
    args.format         = "json";
    args.nojsoncallback = 1;

    return flickr.get('', args, callback);
  }

  //
  // Public interface
  //
  that.get = get;

  return that;

};
