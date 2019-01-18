var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var pattern = /([\w| ]+) (\d+GB)/;
  var test = 'iPhone 7 Plus 128GB Black Unlocked - Apple';

  console.log(test.match(pattern));


  res.render('index', { title: 'Price Comparison System' });
});

module.exports = router;
