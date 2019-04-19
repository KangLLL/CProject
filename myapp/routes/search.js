var express = require('express');
var router = express.Router();

const exchange = require('../modules/exchange');
const priceFetcher = require('../modules/price-fetcher');
const tax = require('../config/tax.json');

const translate = require('../modules/translate');

/* Product Search */
router.get('/', function (req, res, next) {
  res.render('search', { title: 'Search Item' });
});

router.post('/', function (req, res, next) {
  var keyword = req.body.name;
  if (!keyword) return res.render('no-product', { title: 'No result' });
  
  var chKeyword = req.body.chname || keyword;
  
  priceFetcher.getProducts(keyword, chKeyword, (err, usproducts, chproducts, comparisons) => {
    if (err && err.message) return next(err);
    if (!usproducts || !chproducts || usproducts.length == 0 || chproducts.length == 0) return res.render('no-product', { title: 'No result' });
    res.render('product', { title: 'Products', us: usproducts, ch: chproducts, com: comparisons });
  });
});

router.get('/price', function (req, res, next) {
  priceFetcher.getPrices(decodeURIComponent(req.query.name), decodeURIComponent(req.query.chName), (err, price) => {
    if (err) return next(err);
    exchange.getExchangeRates((err, result) => {
      if (err) return next(err);
      res.render('price', { title: 'Price', prices: [price], tax: tax, exchange: result });
    });
  });
});

router.post('/translate', function (req, res, next) {
  translate.translate(req.body.name, (err, result) => {
    if (err) return res.json({ code: 0 });
    res.json({ code: 1, data: result });
  });
});

module.exports = router;
