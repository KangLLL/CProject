var db = require('mysql2-db');
var cfg, models;

function init(_cfg, _models, callback) {
  cfg = _cfg;
  models = _models;
  callback();
}

function updatePrice(id, price, isUS, callback) {
  var exeCmd = 'update ' + (isUS ? 'usproduct' : 'chproduct') + ' set PRICE=? where ID=?';
  db.stage(cfg)
    .execute(exeCmd, [price, id])
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
}

function updateUSPrice(id, price, callback) {
  updatePrice(id, price, true, callback);
}

function updateCHPrice(id, price, callback) {
  updatePrice(id, price, false, callback);
}

function loadComparisonProducts(isUS, callback) {
  var queryCmd = 'select distinct(' + (isUS ? 'USID' : 'CHID') + ') from comparison';
  db.stage(cfg)
    .query(queryCmd)
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
}

function loadUSComparisonProducts(callback) {
  loadComparisonProducts(true, callback);
}

function loadCHComparisonProducts(callback) {
  loadComparisonProducts(false, callback);
}

function customWhereIn(columnName, values) {
  var result = 'where ' + columnName + '=' + values[0];
  for (var i = 1; i < values.length; i++) {
    result += ' or ' + columnName + '=' + values[i];
  }
  return result;
}

function loadProducts(ids, isUS, callback) {
  var queryCmd = 'select ID, NAME, URL, PRICE' + (isUS ? ', WEIGHT, CATEGORY ' : ' ') + 'from ' + (isUS ? 'usproduct ' : 'chproduct ') + customWhereIn('ID', ids);
  db.stage(cfg)
    .query(queryCmd)
    .finale((err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
}

function loadUSProducts(ids, callback) {
  loadProducts(ids, true, callback);
}

function loadCHProducts(ids, callback) {
  loadProducts(ids, false, callback);
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

module.exports = {
  init: init,
  updateUSPrice: updateUSPrice,
  updateCHPrice: updateCHPrice,
  loadUSComparisonProducts: loadUSComparisonProducts,
  loadCHComparisonProducts: loadCHComparisonProducts,
  loadUSProducts: loadUSProducts,
  loadCHProducts: loadCHProducts,
  updateProduct: updateProduct,
  insertCategory: insertCategory
};
