var db = require('mysql2-db');
var cfg, models; 

function init(_cfg, _models, callback) {
  cfg = _cfg;
  models = _models;
  callback();
}

function insert(info, callback) {
  db.stage(cfg)
    .execute('insert into exchangerate(RATE, DATE, TYPE) values(?, ?, ?)', [info.RATE, info.DATE, info.TYPE])
    .finale((err, results) => {
      if (err) return callback(err);
      else return callback(err, results[0]);
    });
}

module.exports = router;
