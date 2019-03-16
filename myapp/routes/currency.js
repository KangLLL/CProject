var express = require('express');
var router = express.Router();

const exchange = require('../modules/exchange');

/* Show Tax */
router.get('/', function (req, res, next) {
  exchange.getExchangeRates((err, result) => {
    if (err) next(err);
    res.render('currency', { title: 'Exchange Currency Rate', UTC: result.UTC, CTU: result.CTU });
  });
});

module.exports = router;
