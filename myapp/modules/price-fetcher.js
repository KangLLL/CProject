const ama = require('./amazon');
const jd = require('./jd');
const date = require('./date');
const models = require('../models');
const cfg = require('../config/config.json');

const feature = require('./feature-fetcher');
const async = require('async');

function getProducts(keyword, chKeyword, callback) {
  var name = '';
  var price = '';
  async.series(
    [
      (cb) => {
        ama.getPrice(keyword, (err, products) => {
          if (err) return cb(err);
          name = products[0].name;
          price = products[0].price.replace(/,|\$/g, '');
          products[0].price = price;
          models.Product.insertOrUpdateUSProduct(products, (err) => {
            if (err) return cb(err);
            cb(null, products);
          });
        });
      },
      (cb) => {
        jd.getPrice(chKeyword, name, price, (err, products) => {
          products.forEach((product) => {
            product.price = product.price.replace(/,|￥|¥/g, '');
          });
          if (err) return cb(err);
          models.Product.insertOrUpdateCHProduct(products, (err) => {
            if (err) return cb(err);
            cb(null, products);
          });
        });
      }
    ], (err, results) => {
      if (err) return callback(err);
      callback(err, results[0], results[1]);
    });
}

// function getPrices(keyword, callback) {
//   ama.getPrice(keyword, (err, name, price, url) => {
//     if (err) return callback(err);
//     price = price.replace(/,|\$/g, '');
//     models.Product.loadByNameWithPrice(name, (err, result) => {
//       if (err) return callback(err);
//       if (!result) {
//         jd.getPrice(keyword, name, price, (err, chname, chprice, churl) => {
//           if (err) return callback(err);
//           if (!chname || !chprice) return callback(null, null, null, null, null, null, null);
//           chprice = chprice.replace(/,|￥/g, '');
//           models.Product.insertProduct(name, chname, url, churl, (err) => {
//             if (err) return callback(err);
//             models.Product.loadByName(name, (err, result) => {
//               if (err) return callback(err);
//               updateProductWeight(result);
//               models.Product.insertPrice(result.ID, price, chprice, date.currentDate(), (err) => {
//                 if (err) return callback(err);
//                 callback(null, name, price, url, chname, chprice, churl);
//               });
//             });
//           });
//         });
//       }
//       else if (!result.USPRICE || date.isDaysAfter(result.DATE, cfg.priceRefreshDay)) {
//         updateProductWeight(result);
//         jd.getPrice(keyword, name, price, (err, chname, chprice, churl) => {
//           if (err) return callback(err);
//           chprice = chprice.replace(/,|￥/g, '');
//           models.Product.insertPrice(result.ID, price, chprice, date.currentDate(), (err) => {
//             if (err) return callback(err);
//             callback(null, name, price, url, chname, chprice, churl);
//           });
//         });
//       }
//       else {
//         updateProductWeight(result);
//         callback(null, name, result.USPRICE, result.URL, result.CHNAME, result.CHPRICE, result.CHURL);
//       }
//     });
//   });
// }

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

function getPrices(usName, chName, callback) {
  async.series(
    [
      (cb) => {
        models.Product.loadUSProductByName(usName, (err, result) => {
          if (err) return cb(err);
          updateProductWeight(result);
          cb(null, result);
        });
      },
      (cb) => {
        models.Product.loadCHProductByName(chName, (err, result) => {
          if (err) return cb(err);
          cb(null, result);
        });
      }
    ], (err, result) => {
      if (err) return callback(err);
      models.Product.insertComparision(result[0].ID, result[1].ID, (e, r) => {
      });
      callback(null, { usName: result[0].NAME, usPrice: parseFloat(result[0].PRICE), chName: result[1].NAME, chPrice: parseFloat(result[1].PRICE), url: result[0].URL, churl: result[1].URL });
    });
}

module.exports = {
  getProducts: getProducts,
  getPrices: getPrices
}