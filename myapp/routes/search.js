var express = require('express');
var router = express.Router();

/* Product Search */
router.get('/', function(req, res, next) {
  res.render('search', { title: 'Search Item' });
});

router.post('/', function(req, res, next) {
  res.render('result', { info:req.body.name });
  console.log(req.body.name);
});

module.exports = router;
