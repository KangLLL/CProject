var db = require('mysql2-db');
var dbcfg = require('../config/db.json');
var async = require('async');

var models = {
  ExchangeRate: require('./exchange-rate'),
  init: (callback) => {
    if (!callback) callback = () => { };

    async.series(
      [
        (callback) => { models.ExchangeRate.init(dbcfg, models, callback); },
      ], (err) => {
        if (err) return callback(err);
        callback();
      }
    );
  },
  shutdown: (callback) => { db.curtains(callback); }
}

module.exports = models;
