var express = require('express');
var router = express.Router();

const ranking = require('../modules/ranking');
const exchange = require('../modules/exchange');
const tax = require('../config/tax.json');
const config = require('../config/config');

/* Show Ranking */
router.get('/', function (req, res, next) {
  var cred = req.query.credibility;
  var isCred = cred == 'high';
  ranking.getTopProfitProducts(config.rankCount, isCred, (err, usPrice, chnPrice) => {
    if (err) return next(err);
    exchange.getExchangeRates((err, result) => {
      if (err) return next(err);
      res.render('ranking', { title: 'Ranking', isCred: isCred, usPrices: usPrice, chnPrices: chnPrice, tax: tax, exchange: result });
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
