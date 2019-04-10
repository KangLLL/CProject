var db = require('mysql2-db');
var cfg, models;

function init(_cfg, _models, callback) {
  cfg = _cfg;
  models = _models;
  callback();
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
    .execute('update usproduct set WEIGHT=? where ID=?', [weight, id])
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
}

function getTopRankingProducts(top, rate, isFromUS, callback) {
  var queryCmd = 'select up.NAME as NAME, cp.NAME as CHNAME, up.URL as URL, cp.URL as CHURL, up.WEIGHT, up.PRICE as USPRICE, cp.PRICE as CHPRICE, (cp.PRICE * ? - up.PRICE) / up.WEIGHT as profit from usproduct up inner join comparison com on com.USID=up.ID inner join chproduct cp on cp.ID=com.CHID where up.WEIGHT is not null order by profit ' + (isFromUS ? 'desc' : 'asc') + ' limit ?';
  db.stage(cfg)
    .query(queryCmd, [rate, top])
    .finale((err, results) => {
      callback(null, results);
    });
}

function getTopRankingProductForUS(top, rate, callback) {
  getTopRankingProducts(top, rate, true, callback);
}

function getTopRankingProductForChina(top, rate, callback) {
  getTopRankingProducts(top, rate, false, callback);
}

module.exports = {
  init: init,
  insertOrUpdateUSProduct: insertOrUpdateUSProduct,
  insertOrUpdateCHProduct: insertOrUpdateCHProduct,
  loadUSProductByName: loadUSProductByName,
  loadCHProductByName: loadCHProductByName,
  insertComparision: insertComparision,
  updateWeight: updateWeight,
  getTopRankingProductForUS: getTopRankingProductForUS,
  getTopRankingProductForChina: getTopRankingProductForChina
};
