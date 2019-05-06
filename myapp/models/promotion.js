var db = require('mysql2-db');
var cfg, models;

function init(_cfg, _models, callback) {
  cfg = _cfg;
  models = _models;
  callback();
}

function customWhereIn(columnName, values) {
  var result = 'where ' + columnName + '=' + values[0];
  for (var i = 1; i < values.length; i++) {
    result += ' or ' + columnName + '=' + values[i];
  }
  return result;
}

function loadLatestPromotions(count, callback) {
  db.stage(cfg)
    .query('select * from promotion order by DATE desc limit ?', [count])
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
}

function loadPromotionsByCategory(categories, count, callback) {
  var queryCmd = 'select * from promotion ' + customWhereIn('CATEGORY', categories) + ' order by DATE desc limit ?'; 
  db.stage(cfg)
    .query(queryCmd, [count])
    .finale((err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
}

module.exports = {
  init: init,
  loadLatestPromotions: loadLatestPromotions,
  loadPromotionsByCategory: loadPromotionsByCategory
};
