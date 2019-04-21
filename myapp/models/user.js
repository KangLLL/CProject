var db = require('mysql2-db');
var cfg, models;

function init(_cfg, _models, callback) {
  cfg = _cfg;
  models = _models;
  callback();
}

function insert(email, password, callback) {
  db.stage(cfg)
    .execute('insert into user(EMAIL, PASSWORD) values(?, ?)', [email, hashedPassword])
    .finale((err, results) => {
      if (err) return callback(err);
      return callback(null, results[0]);
    });
}

function loadByEmail(email, callback) {
  db.stage(cfg)
    .query('select * from user where EMAIL=?', [email])
    .finale((err, results) => {
      if (err) return callback(err);
      return callback(null, results[0]);
    });
}

module.exports = {
  init: init,
  insert: insert,
  loadByEmail: loadByEmail
};
