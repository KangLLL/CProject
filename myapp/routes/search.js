var express = require('express');
var router = express.Router();

var ama = require('../modules/amazon');
var jd = require('../modules/jd');
const exchange = require('../modules/exchange');
const tax = require("../config/tax.json");

/* Product Search */
router.get('/', function (req, res, next) {
  res.render('search', { title: 'Search Item' });
});

router.post('/', function (req, res, next) {
  return res.render('price', { title: 'Price', prices: { usName: 'iphone', usPrice: 300, chName: 'iphoneCH', chPrice: 2200 }, tax: tax, exchange: { UTC: 6, CTU: 0.167 } });
});

  // ama.getPrice(req.body.name, (err, name, price) => {
  //   if (err) return next(err);
  //   var info = { keyword: req.body.name, usName: name, usPrice: price };

  //   jd.getPrice(name, (err, name, price) => {
  //     if (err) return next(err);
  //     info['chName'] = name;
  //     info['chPrice'] = price;

  //     exchange.getExchangeRates((err, result) => {
  //       if (err) return next(err);

  //       res.render('price', { title: 'Price', prices: info, tax: tax, exchange: result });
  //     });
  //   });
  // });

  router.post('/product', function (req, res, next) {
    fetcher.getPrice(req.body.product, (err, result) => {
      if (err) return next(err);

      res.render('price', { title: 'Price', prices: result.prices, tax: result.tax, exchange: exchangeRate });
    });
  });

  // apple.getIPhonePrice('7', (err, usPrices, chinaPrices) => {
  //   res.render('result', { title: 'Search Result', usPrice: usPrices, chnPrice: chinaPrices });
  // });


  module.exports = router;
