var db = require('mysql2-db');
var cfg, models;

function init(_cfg, _models, callback) {
  cfg = _cfg;
  models = _models;
  callback();
}

function insert(userId, comparisonId, date, callback) {
  db.stage(cfg)
    .execute('insert into interest(USERID, COMPAREID, DATE) values(?, ?, ?)', [userId, comparisonId, date])
    .finale((err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
}

module.exports = {
  init: init,
  insert: insert
};
