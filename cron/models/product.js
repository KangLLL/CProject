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
  var queryCmd = 'select ID, NAME' + (isUS ? ', WEIGHT ' : ' ') + 'from ' + (isUS ? 'usproduct ' : 'chproduct ') + customWhereIn('ID', ids);
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

function updateWeight(id, weight, callback) {
  db.stage(cfg)
    .execute('update usproduct set WEIGHT=? where ID=?', [weight, id])
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
}

module.exports = {
  init: init,
  updateUSPrice: updateUSPrice,
  updateCHPrice: updateCHPrice,
  loadUSComparisonProducts: loadUSComparisonProducts,
  loadCHComparisonProducts: loadCHComparisonProducts,
  loadUSProducts: loadUSProducts,
  loadCHProducts: loadCHProducts,
  updateWeight: updateWeight
};
