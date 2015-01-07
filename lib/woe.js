"use strict";

var env    = require("require-env"),
    pg     = require("pg"),
    flickr = require("../lib/flickr.js");

function get(woeid, callback) {

  return pg.connect(env.require("DATABASE_URL"), function(err, client, done) {
    if (err) {
      done();
      return callback(err);
    }

    return client.query({
      "text" : "SELECT * FROM woe"
    }, function(err, result) {

      if (err) {
        return callback(err);
      }

      if (result.rows.length) {
        done();
        callback(null, result.rows[0].cache);
      } else {
        flickr.get("flickr.places.getInfo", {
          "woe_id" : woeid
        },
        function( error, data, response ) {

          if( response && response.statusCode ) {

            var result = JSON.parse(data);

            return client.query({
              "text"   : "INSERT INTO woe VALUES ($1,$2)",
              "values" : [woeid, result.place]
            }, function(err, result) {

              if (err) {
                return callback(err);
              }

              callback(null, result.rows[0].cache);
              done();

            });

          } else {
            return callback(error);
          }
        });
      }

    });

  });
}

module.exports = {
  "get" : get
};
