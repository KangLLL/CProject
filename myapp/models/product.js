var db = require('mysql2-db');
var cfg, models;

function init(_cfg, _models, callback) {
  cfg = _cfg;
  models = _models;
  callback();
}

function load(id, callback) {
  db.stage(cfg)
    .query('select * from product where id=?', [id])
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
}

function loadByName(name, callback) {
  db.stage(cfg)
    .query('select * from product where name like ?', ['%' + name + '%'])
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
}

function insertProduct(name, callback) {
  db.stage(cfg)
    .execute('insert into product(NAME) values (?)', [name])
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
}

function loadLatestPriceByProductId(pid, callback) {
  db.stage(cfg)
    .query('select USPRICE, CHPRICE, DATE from price where PRODUCTID=? order by date desc limit 1', [pid])
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
}

function insertPrice(pid, usprice, chprice, date, callback) {
  db.stage(cfg)
    .execute('insert into price(USPRICE, CHPRICE, DATE) values(?, ?, ?)', [usprice, chprice, date])
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
}

module.exports = {
  init: init,
  load: load,
  loadByName: loadByName,
  insertProduct: insertProduct,
  loadLatestPriceByProductId: loadLatestPriceByProductId,
  insertPrice: insertPrice
};
