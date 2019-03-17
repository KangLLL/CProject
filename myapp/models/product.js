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
    .query('select * from product where name=?', [name])
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
}

function loadByNameWithPrice(name, callback) {
  db.stage(cfg)
    .query('select p.ID as ID, p.NAME, p.CHNAME, p.WIDTH, p.HEIGHT, p.DEPTH, p.WEIGHT, tep.USPRICE, tep.CHPRICE, tep.DATE from product p left outer join (select pr.PRODUCTID, pr.USPRICE, pr.CHPRICE, pr.DATE from price pr inner join (select PRODUCTID, max(DATE) as DATE from price group by PRODUCTID) tp on pr.PRODUCTID=tp.PRODUCTID and pr.DATE=tp.DATE) tep on tep.PRODUCTID=p.ID where p.name=?', [name])
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
}

function insertProduct(name, chname, callback) {
  db.stage(cfg)
    .execute('insert into product(NAME, CHNAME) values (?, ?)', [name, chname])
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
}

function loadLatestPriceByProductId(pid, callback) {
  db.stage(cfg)
    .query('select p.NAME, p.USPRICE, p.CHPRICE, p.DATE from price p where p.PRODUCTID=? AND p.DATE=(select max(pp.DATE) from price pp where pp.PRODUCTID=?)', [pid, pid])
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
}

function insertPrice(pid, usprice, chprice, date, callback) {
  db.stage(cfg)
    .execute('insert into price(USPRICE, CHPRICE, DATE, PRODUCTID) values(?, ?, ?, ?)', [usprice, chprice, date, pid])
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
}

function getTopRankingProduct(top, callback) {
  db.stage(cfg)
    .query('select p.NAME, p.CHNAME, p.WIDTH, p.HEIGHT, p.DEPTH, p.WEIGHT, tep.USPRICE, tep.CHPRICE, (tep.CHPRICE - tep.USPRICE) as profit from product p inner join (select pr.PRODUCTID, pr.USPRICE, pr.CHPRICE from price pr inner join (select PRODUCTID, max(DATE) as DATE from price group by PRODUCTID) tp on pr.PRODUCTID=tp.PRODUCTID and pr.DATE=tp.DATE) tep on tep.PRODUCTID=p.ID order by profit desc limit ?', [top])
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
}

module.exports = {
  init: init,
  load: load,
  loadByName: loadByName,
  loadByNameWithPrice: loadByNameWithPrice,
  insertProduct: insertProduct,
  loadLatestPriceByProductId: loadLatestPriceByProductId,
  insertPrice: insertPrice,
  getTopRankingProduct: getTopRankingProduct
};
