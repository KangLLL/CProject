const ama = require('./amazon');
const jd = require('./jd');
const date = require('./date');
const models = require('../models');
const cfg = require('../config/config.json');

function getPrices(keyword, callback) {
  ama.getPrice(keyword, (err, name, price) => {
    if (err) return callback(err);
    price = price.replace(/,|\$/g,'');
    models.Product.loadByNameWithPrice(name, (err, result) => {
      if (err) return callback(err);
      if (!result) {
        jd.getPrice(name, (err, chname, chprice) => {
          if (err) return callback(err);
          chprice = chprice.replace(/,|￥/g,'');
          models.Product.insertProduct(name, chname, (err) => {
            if (err) return callback(err);
            models.Product.loadByName(name, (err, result) => {
              if (err) return callback(err);
              models.Product.insertPrice(result.ID, price, chprice, date.currentDate(), (err) => {
                if (err) return callback(err);
                callback(null, name, price, chname, chprice);
              });
            });
          });
        });
      }
      else if (!result.USPRICE || date.isDaysAfter(result.DATE, cfg.priceRefreshDay)) {
        jd.getPrice(name, (err, chname, chprice) => {
          if (err) return callback(err);
          chprice = chprice.replace(/,|￥/g,'');
          models.Product.insertPrice(result.ID, price, chprice, date.currentDate(), (err) => {
            if (err) return callback(err);
            callback(null, name, price, chname, chprice);
          });
        });
      }
      else {
        callback(null, name, result.USPRICE, result.CHNAME, result.CHPRICE);
      }
    });
  });
}

module.exports = {
  getPrices: getPrices
}