const apple = require('./apple');
const date = require('./date');
const tax = require('./tax');
const exchange = require('./exchange');
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

function getPrice(productId, state, callback) {
  models.Product.loadLatestPriceByProductId(productId, (err, result) => {
    if (err) return callback(err);
    if (!result || date.isDaysAfter(result.DATE, cfg.priceRefreshDay)) {
      models.Product.load(productId, (err, result) => {
        if (err) return callback(err);

        if (iphoneFamily.has(result.NAME)) {
          var info = {};
          apple.getIPhonePrice(result.USURL, result.CHURL, (err, usPrices, chPrices) => {
            if (err) return callback(err);
            usPrices = tax.getTax(usPrices, state);
            info.usPrices = usPrices;
            info.chPrices = chPrices;
            exchange.getExchangeRates((err, res) => {
              if (err) return callback(err);
              info.exchangeRate = res;
              callback(null, info);
            });
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