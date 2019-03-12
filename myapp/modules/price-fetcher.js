const apple = require('./apple');
const date = require('./date');
const exchange = require('./exchange');
const models = require('../models');
const cfg = require('../config/config.json');
const taxMap = require("../config/tax.json");

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

function constructPrice(prices, callback) {
  var info = { prices: prices, tax: taxMap };
  exchange.getExchangeRates((err, res) => {
    if (err) return callback(err);
    info.exchangeRate = res;
    callback(null, info);
  });
}

function getPrice(productId, callback) {
  models.Product.loadLatestPriceByProductId(productId, (err, results) => {
    if (err) return callback(err);
    if (!results || !results[0] || date.isDaysAfter(result[0].DATE, cfg.priceRefreshDay)) {
      models.Product.load(productId, (err, result) => {
        if (err) return callback(err);

        if (iphoneFamily.has(result.NAME)) {
          apple.getIPhonePrice(productId, result.USURL, result.CHURL, err => {
            if (err) return callback(err);

            models.Product.loadLatestPriceByProductId(productId, (err, results) => {
              if (err) return callback(err);
              constructPrice(results, callback);
            });
          });
        }
        else {
          console.log(result.NAME);
        }
      });
    }
    else {
      constructPrice(results, callback);
    }
  });
}

module.exports = {
  getProduct: getProduct,
  getPrice: getPrice
}