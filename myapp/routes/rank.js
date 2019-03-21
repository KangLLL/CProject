var express = require('express');
var router = express.Router();

const ranking = require('../modules/ranking');
const exchange = require('../modules/exchange');
const tax = require('../config/tax.json');

/* Show Ranking */
router.get('/', function (req, res, next) {
  if (req.originalUrl.slice(-1) != '/') return res.redirect(req.originalUrl + '/');
  ranking.getTopProfitProducts(20, (err, usPrice, chnPrice) => {
    if (err) return next(err);
    exchange.getExchangeRates((err, result) => {
      if (err) return next(err);
      res.render('ranking', { title: 'Ranking', usPrices: usPrice, chnPrices: chnPrice, tax: tax, exchange: result });
    });
  });
});

router.get('/recommend', function (req, res, next) {
  res.render('recommend', { title: 'Recommend' });
});

router.post('/recommend', function (req, res, next) {
  ranking.getRecommendProducts(req.body.weight, req.body.direction == '1', (err, recommends) => {
    if (err) return next(err);
    res.render('recommend-list', { title: 'Recommend List', recommends: recommends });
  });
});



module.exports = router;
