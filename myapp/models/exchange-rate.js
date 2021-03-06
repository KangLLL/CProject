var db = require('mysql2-db');
var cfg, models; 

function init(_cfg, _models, callback) {
  cfg = _cfg;
  models = _models;
  callback();
}

function insert(rate, date, type, callback) {
  db.stage(cfg)
    .execute('insert into exchangerate(RATE, DATE, TYPE) values(?, ?, ?)', [rate, date, type])
    .finale((err, results) => {
      if (err) return callback(err);
      else return callback(err, results[0]);
    });
}

function loadLatestByType(type, callback) {
  db.stage(cfg)
    .query('select RATE, DATE from exchangerate where TYPE=? order by date desc limit 1', [type])
    .finale((err, results) => {
      if (err) return callback(err);
      else return callback(err, results[0]);
    });
}

module.exports = {
  init: init,
  insert: insert,
  loadLatestByType: loadLatestByType
};
