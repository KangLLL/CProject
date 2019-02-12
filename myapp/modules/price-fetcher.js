const apple = require('./apple');
const date = require('./date');
const models = require('../models');
const cfg = require('../config/config.json');

function getProduct(product, callback) {
  models.Product.loadByName(product, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
}

function getPrice(productId, callback) {
  models.Product.loadLatestPriceByProductId(productId, (err, result) => {
    if (err) return callback(err);
    var price = result;
    if (date.isDaysAfter(price.DATE, 1)) 
  });
}

module.exports = {
  getPrice: getPrice
}