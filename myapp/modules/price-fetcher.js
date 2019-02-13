const apple = require('./apple');
const date = require('./date');
const models = require('../models');
const cfg = require('../config/config.json');

function getProduct(product, callback) {
  models.Product.loadByName(product, (err, result) => {
    if (err) return callback(err);

    if (result.length == 0) {
      models.Product.insertProduct(product, (err, result) => {
        if (err) return callback(err);
        models.Product.loadByName(product, (err, result) => {
          if (err) return callback(err);
          callback(null, result);
        });
      });
    }
    else {
      callback(null, result);
    }
  });
}

function getPrice(productId, callback) {
  models.Product.loadLatestPriceByProductId(productId, (err, result) => {
    if (err) return callback(err);
    if (date.isDaysAfter(price.DATE, cfg.priceRefreshDay)) {

    }
    else {
      callback(null, result);
    }
  });
}

module.exports = {
  getProduct: getProduct,
  getPrice: getPrice
}