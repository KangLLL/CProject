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
      callback(null, results);
    });
}

function loadInterestCategory(userId, callback) {
  db.stage(cfg)
    .query('select distinct(up.CATEGORY) from comparison com inner join usproduct up on up.ID=com.USID inner join interest it on it.USERID=? and it.COMPAREID=com.ID', [userId])
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
}


module.exports = {
  init: init,
  insert: insert,
  loadInterestCategory: loadInterestCategory
};
