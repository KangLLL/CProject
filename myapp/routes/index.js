var express = require('express');
var router = express.Router();

const models = require('../models');
const config = require('../config/config');

/* GET home page. */
router.get('/', function (req, res, next) {
  var load = (interests) => {
    models.Promotion.loadLatestPromotions(config.promotionCount, (err, result) => {
      if (err) return next(err);
      res.render('index', { title: 'Price Comparison System', promotions: result, interests: interests });
    });
  }
  if (req.session.user) {
    models.Interest.loadInterestCategory(req.session.user, (err, result) => {
      if (err) return next(err);
      if (result.length > 0) {
        models.Promotion.loadPromotionsByCategory(result.map(r => r.CATEGORY), config.promotionCount, (err, result) => {
          if (err) return next(err);
          load(result);
        });
      }
      else {
        load(null);
      }
    });
  }
  else {
    load(null);
  }
});

module.exports = router;
