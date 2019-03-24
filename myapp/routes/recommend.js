var express = require('express');
var router = express.Router();

const ranking = require('../modules/ranking');

router.get('/', function (req, res, next) {
  res.render('recommend', { title: 'Recommend' });
});

router.post('/', function (req, res, next) {
  ranking.getRecommendProducts(req.body.weight, req.body.direction == '1', (err, recommends) => {
    if (err) return next(err);
    res.render('recommend-list', { title: 'Recommend List', recommends: recommends });
  });
});



module.exports = router;
