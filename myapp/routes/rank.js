var express = require('express');
var router = express.Router();

const ranking = require('../modules/ranking');

/* Show Ranking */
router.get('/', function (req, res, next) {
  ranking.getTopProfitProducts(10, (err, results) => {
    res.render('ranking', { title: 'Ranking', rankings: results });
  });
});

module.exports = router;
