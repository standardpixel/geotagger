'use strict';

var pg = require('pg');

module.exports = function(req, res, data, callback) {

  return callback(null, {
    appTitle : 'Geotagger'
  });

};
