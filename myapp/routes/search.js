var express = require('express');
var router = express.Router();

var fetcher = require('../modules/price-fetcher');

/* Product Search */
router.get('/', function(req, res, next) {
  res.render('search', { title: 'Search Item' });
});

router.post('/', function(req, res, next) {
  fetcher.getProduct(req.body.name, (err, result) => {
  });

  // apple.getIPhonePrice('7', (err, usPrices, chinaPrices) => {
  //   res.render('result', { title: 'Search Result', usPrice: usPrices, chnPrice: chinaPrices });
  // });
});

module.exports = router;
