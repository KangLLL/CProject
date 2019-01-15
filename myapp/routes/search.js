var express = require('express');
var router = express.Router();

/* Product Search */
router.get('/', function(req, res, next) {
  res.render('search', { title: 'Search Item' });
});

module.exports = router;
