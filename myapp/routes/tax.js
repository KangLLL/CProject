var express = require('express');
var router = express.Router();

const tax = require('../config/tax.json');

/* Show Tax */
router.get('/', function (req, res, next) {
  res.render('tax', { title: 'Purchase Tax', states: tax });
});

module.exports = router;
