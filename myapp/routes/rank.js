var express = require('express');
var router = express.Router();

const ranking = require('../modules/ranking');
const exchange = require('../modules/exchange');
const tax = require('../config/tax.json');

/* Show Ranking */
router.get('/', function (req, res, next) {
  ranking.getTopProfitProducts(10, (err, results) => {
    if (err) return next(err);
    exchange.getExchangeRates((err, result) => {
      if (err) return next(err);
      res.render('ranking', { title: 'Ranking', prices: results, tax: tax, exchange: result });
    });
  });
});

module.exports = router;
