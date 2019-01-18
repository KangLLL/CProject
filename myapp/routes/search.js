var express = require('express');
var router = express.Router();

var apple = require('../modules/apple');

/* Product Search */
router.get('/', function(req, res, next) {
  res.render('search', { title: 'Search Item' });
});

router.post('/', function(req, res, next) {
  apple.getIPhonePrice('7', (err, usPrices, chinaPrices)=>{
    console.log('price');
  });
});

module.exports = router;
