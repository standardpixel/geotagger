"use strict";

var OAuth = require("client-oauth"),
    env   = require("require-env");

var flickr;

function initFlickr(config) {
  if (!flickr) {
    var oauth = new OAuth[1.0]({
      base: 'https://api.flickr.com/services/rest',
      key: env.require("FLICKR_KEY"),
      secret: env.require("FLICKR_SECRET"),
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

function get(method, args, callback) {
  args.method         = method;
  args.format         = "json";
  args.nojsoncallback = 1;

  return flickr.get('', args, callback);
}

//
// Inits
//
initFlickr();

module.exports = {
  "get" : get
};
