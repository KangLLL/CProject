var db = require('mysql2-db');
var dbcfg = require('../config/db.json');
var async = require('async');

var models = {
  Product: require('./product'),
  init: (callback) => {
    if (!callback) callback = () => { };

    async.series(
      [
        (callback) => { models.Product.init(dbcfg, models, callback); },
      ], (err) => {
        if (err) return callback(err);
        callback();
      }
    );
  },
  shutdown: (callback) => { db.curtains(callback); }
}

module.exports = models;
