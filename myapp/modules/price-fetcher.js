const ama = require('./amazon');
const jd = require('./jd');
const date = require('./date');
const models = require('../models');
const cfg = require('../config/config.json');

const feature = require('./feature-fetcher');

function getPrices(keyword, callback) {
  ama.getPrice(keyword, (err, name, price, url) => {
    if (err) return callback(err);
    price = price.replace(/,|\$/g, '');
    models.Product.loadByNameWithPrice(name, (err, result) => {
      if (err) return callback(err);
      if (!result) {
        jd.getPrice(keyword, name, price, (err, chname, chprice) => {
          if (err) return callback(err);
          if (!chname || !chprice) return callback(null, null, null, null, null);
          chprice = chprice.replace(/,|￥/g, '');
          models.Product.insertProduct(name, chname, url, (err) => {
            if (err) return callback(err);
            models.Product.loadByName(name, (err, result) => {
              if (err) return callback(err);
              updateProductWeight(result);
              models.Product.insertPrice(result.ID, price, chprice, date.currentDate(), (err) => {
                if (err) return callback(err);
                callback(null, name, price, chname, chprice);
              });
            });
          });
        });
      }
      else if (!result.USPRICE || date.isDaysAfter(result.DATE, cfg.priceRefreshDay)) {
        updateProductWeight(result);
        jd.getPrice(keyword, name, price, (err, chname, chprice) => {
          if (err) return callback(err);
          chprice = chprice.replace(/,|￥/g, '');
          models.Product.insertPrice(result.ID, price, chprice, date.currentDate(), (err) => {
            if (err) return callback(err);
            callback(null, name, price, chname, chprice);
          });
        });
      }
      else {
        updateProductWeight(result);
        callback(null, name, result.USPRICE, result.CHNAME, result.CHPRICE);
      }
    });
  });
}

function updateProductWeight(product) {
  if (!product.WEIGHT) {
    feature.getWeight('https://www.amazon.com' + product.URL, (err, w) => {
      if (!err) {
        models.Product.updateWeight(product.ID, w, (err, result) => {
          console.log(err);
          console.log(result);
        });
      }
    });
  }
}

module.exports = {
  getPrices: getPrices
}