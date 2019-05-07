var express = require('express');
var router = express.Router();

const models = require('../models');
const config = require('../config/config');

/* GET home page. */
router.get('/', function (req, res, next) {
  models.Promotion.loadLatestPromotions(config.promotionCount, (err, result) => {
    if (err) return next(err);
    res.render('index', { title: 'Price Comparison System', promotions: result });
  });
});

module.exports = router;
