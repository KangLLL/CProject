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
    product.image]);
  });
  db.stage(cfg)
    .execute(exeCmd, params)
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
}

function insertOrUpdateUSProduct(products, callback) {
  insertOrUpdateProduct(products, true, callback);
}

function insertOrUpdateCHProduct(products, callback) {
  insertOrUpdateProduct(products, false, callback);
}

function insertComparison(usId, chId, callback) {
  db.stage(cfg)
    .execute('insert into comparison (USID, CHID) values (?, ?) on duplicate key update VOTE=VOTE + 1', [usId, chId])
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
}

function loadComparisonById(usId, chId, callback) {
  db.stage(cfg)
    .query('select * from comparison where USID=? and CHID=?', [usId, chId])
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
}

function loadComparisonByName(name, callback) {
  db.stage(cfg)
    .query('select up.NAME as USNAME, cp.NAME as CHNAME, up.IMAGE as USIMAGE, cp.IMAGE as CHIMAGE, cp.URL as CHURL from comparison com inner join usproduct up on up.ID=com.USID and up.NAME=? inner join chproduct cp on cp.ID=com.CHID order by com.VOTE desc', [name])
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
}

function insertCategory(category, callback) {
  db.stage(cfg)
    .query('select ID from category where NAME=?', [category])
    .finale((err, results) => {
      if (err) return callback(err);
      if (results.length == 0) {
        db.stage(cfg)
          .execute('insert into category(NAME) values(?)', [category])
          .query('select ID from category where NAME=?', [category])
          .finale((err, results) => {
            if (err) return callback(err);
            if (results[1].length == 0) return callback(null, null);
            callback(null, results[1][0].ID);
          });
      }
      else {
        callback(null, results[0].ID);
      }
    });
}

function updateProduct(id, price, weight, category, callback) {
  var update = (id, price, weight, category, callback) => {
    var exeCmd = 'update usproduct set PRICE=?';
    var params = [price];

    if (weight) {
      exeCmd = exeCmd + ', WEIGHT=?';
      params.push(weight);
    }
    if (category) {
      exeCmd = exeCmd + ', CATEGORY=?';
      params.push(category);
    }

    exeCmd = exeCmd + ' where ID=?';
    params.push(id);

    db.stage(cfg)
      .execute(exeCmd, params)
      .finale((err, results) => {
        if (err) return callback(err);
        callback(null, results);
      });
  };

  if (category && isNaN(parseInt(category))) {
    insertCategory(category, (err, res) => {
      if (err) return callback(err);
      if (!res) return callback(null, null);
      update(id, price, weight, res, callback);
    });
  }
  else {
    update(id, price, weight, category, callback);
  }
}



function getTopRankingProducts(top, rate, credible, isFromUS, callback) {
  var queryCmd = 'select up.NAME as NAME, cp.NAME as CHNAME, up.URL as URL, cp.URL as CHURL, up.WEIGHT, up.PRICE as USPRICE, cp.PRICE as CHPRICE, (cp.PRICE * ? - up.PRICE) / up.WEIGHT as profit from usproduct up inner join comparison com on com.USID=up.ID inner join chproduct cp on cp.ID=com.CHID where up.WEIGHT is not null' + (credible ? ' and com.VOTE > (select AVG(VOTE) from comparison) ' : ' ') + 'order by profit ' + (isFromUS ? 'desc' : 'asc') + ' limit ?';
  db.stage(cfg)
    .query(queryCmd, [rate, top])
    .finale((err, results) => {
      callback(null, results);
    });
}

function getTopRankingProductForUS(top, rate, credible, callback) {
  getTopRankingProducts(top, rate, credible, true, callback);
}

function getTopRankingProductForChina(top, rate, credible, callback) {
  getTopRankingProducts(top, rate, credible, false, callback);
}

module.exports = {
  init: init,
  insertOrUpdateUSProduct: insertOrUpdateUSProduct,
  insertOrUpdateCHProduct: insertOrUpdateCHProduct,
  loadUSProductByName: loadUSProductByName,
  loadCHProductByName: loadCHProductByName,
  insertComparison: insertComparison,
  loadComparisonById: loadComparisonById,
  loadComparisonByName, loadComparisonByName,
  updateProduct: updateProduct,
  getTopRankingProductForUS: getTopRankingProductForUS,
  getTopRankingProductForChina: getTopRankingProductForChina
};
