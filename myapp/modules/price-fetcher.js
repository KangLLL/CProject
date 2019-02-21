const apple = require('./apple');
const date = require('./date');
const models = require('../models');
const cfg = require('../config/config.json');

const iphoneFamily = new Set(['iphone7', 'iphone8']);

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
    if (!result || date.isDaysAfter(result.DATE, cfg.priceRefreshDay)) {
      models.Product.load(productId, (err, result) => {
        if (err) return callback(err);

        if (iphoneFamily.has(result.NAME)) {
          apple.getIPhonePrice(result.USURL, result.CHURL, (err, res) => {
            console.log(res);
          });
        }
        else {
          console.log(result.NAME);
        }
      });
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