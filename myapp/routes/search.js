var express = require('express');
var router = express.Router();

var models = require('../models');
const exchange = require('../modules/exchange');
const priceFetcher = require('../modules/price-fetcher');
const tax = require('../config/tax.json');

/* Product Search */
router.get('/', function (req, res, next) {
  res.render('search', { title: 'Search Item' });
});

router.post('/', function (req, res, next) {
  priceFetcher.getPrices(req.body.name, (err, name, usprice, chname, chprice) => {
    if (err) return next(err);
    exchange.getExchangeRates((err, result) => {
      if (err) return next(err);
      res.render('price', { title: 'Price', prices: { usName: name, usPrice: parseFloat(usprice), chName: chname, chPrice: parseFloat(chprice) }, tax: tax, exchange: result });
    });
  });
});

module.exports = router;
