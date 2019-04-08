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

function loadByNameWithPrice(name, callback) {
  db.stage(cfg)
    .query('select p.ID as ID, p.NAME, p.CHNAME, p.WIDTH, p.HEIGHT, p.DEPTH, p.WEIGHT, p.URL, p.CHURL, tep.USPRICE, tep.CHPRICE, tep.DATE from product p left outer join (select pr.PRODUCTID, pr.USPRICE, pr.CHPRICE, pr.DATE from price pr inner join (select PRODUCTID, max(DATE) as DATE from price group by PRODUCTID) tp on pr.PRODUCTID=tp.PRODUCTID and pr.DATE=tp.DATE) tep on tep.PRODUCTID=p.ID where p.name=?', [name])
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
}

function loadByName(name, isUS, callback) {
  db.stage(cfg)
    .query('select * from' + (isUS ? ' usproduct ' : ' chproduct ') + 'where name=?', [name])
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
}

function loadUSProductByName(name, callback) {
  loadByName(name, true, callback);
}

function loadCHProductByName(name, callback) {
  loadByName(name, false, callback);
}

function insertOrUpdateProduct(products, isUS, callback) {
  var exeCmd = 'insert into' + (isUS ? ' usproduct ' : ' chproduct ') + '(NAME, URL, PRICE, IMAGE) values (?, ?, ?, ?) on duplicate key update URL = ?, PRICE = ?, IMAGE = ?';
  var params = [];
  products.forEach((product) => {
    params.push([product.name,
    product.url,
    product.price,
    product.image,
    product.url,
    product.price,
    product.image])
  });
  db.stage(cfg)
    .execute(exeCmd, params)
    .finale((err, results) => {
      if (err) return callback(err);
      else return callback(err, results[0]);
    });
}

function insertOrUpdateUSProduct(products, callback) {
  insertOrUpdateProduct(products, true, callback);
}

function insertOrUpdateCHProduct(products, callback) {
  insertOrUpdateProduct(products, false, callback);
}

function insertComparision(usId, chId, callback) {
  db.stage(cfg)
    .execute('insert into comparison (USID, CHID) values (?, ?)', [usId, chId])
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
}

function updateWeight(id, weight, callback) {
  db.stage(cfg)
    .execute('update product set WEIGHT=? where ID=?', [weight, id])
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

function getTopRankingProductForUS(top, rate, callback) {
  db.stage(cfg)
    .query('select p.NAME, p.CHNAME, p.URL, p.CHURL, p.WIDTH, p.HEIGHT, p.DEPTH, p.WEIGHT, tep.USPRICE, tep.CHPRICE, (tep.CHPRICE * ? - tep.USPRICE) / p.WEIGHT as profit from product p inner join (select pr.PRODUCTID, pr.USPRICE, pr.CHPRICE from price pr inner join (select PRODUCTID, max(DATE) as DATE from price group by PRODUCTID) tp on pr.PRODUCTID=tp.PRODUCTID and pr.DATE=tp.DATE) tep on tep.PRODUCTID=p.ID where p.WEIGHT is not null order by profit desc limit ?', [rate, top])
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
}

function getTopRankingProductForChina(top, rate, callback) {
  db.stage(cfg)
    .query('select p.NAME, p.CHNAME, p.URL, p.CHURL, p.WIDTH, p.HEIGHT, p.DEPTH, p.WEIGHT, tep.USPRICE, tep.CHPRICE, (tep.CHPRICE * ? - tep.USPRICE) / p.WEIGHT as profit from product p inner join (select pr.PRODUCTID, pr.USPRICE, pr.CHPRICE from price pr inner join (select PRODUCTID, max(DATE) as DATE from price group by PRODUCTID) tp on pr.PRODUCTID=tp.PRODUCTID and pr.DATE=tp.DATE) tep on tep.PRODUCTID=p.ID where p.WEIGHT is not null order by profit asc limit ?', [rate, top])
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
}

module.exports = {
  init: init,
  insertOrUpdateUSProduct: insertOrUpdateUSProduct,
  insertOrUpdateCHProduct: insertOrUpdateCHProduct,
  loadUSProductByName: loadUSProductByName,
  loadCHProductByName: loadCHProductByName,
  insertComparision: insertComparision,
  updateWeight: updateWeight,
  loadLatestPriceByProductId: loadLatestPriceByProductId,
  insertPrice: insertPrice,
  getTopRankingProductForUS: getTopRankingProductForUS,
  getTopRankingProductForChina: getTopRankingProductForChina
};
