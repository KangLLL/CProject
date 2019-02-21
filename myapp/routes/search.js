var express = require('express');
var router = express.Router();

var fetcher = require('../modules/price-fetcher');

/* Product Search */
router.get('/', function (req, res, next) {
  res.render('search', { title: 'Search Item' });
});

router.post('/', function (req, res, next) {
  fetcher.getProduct(req.body.name, (err, result) => {
    if (err) return next(err);
    if (result.length == 1) {
      console.log('to result page');
    }
    else {
      res.render('product', { products: result });

      console.log('to select page');
    }
  });

  router.post('/product', function (req, res, next) {
    fetcher.getPrice(req.body.product, (err, result) => {
      if (err) return next(err);
    });
  });

  // apple.getIPhonePrice('7', (err, usPrices, chinaPrices) => {
  //   res.render('result', { title: 'Search Result', usPrice: usPrices, chnPrice: chinaPrices });
  // });
});

module.exports = router;
