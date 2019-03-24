var express = require('express');
var router = express.Router();

const exchange = require('../modules/exchange');
const priceFetcher = require('../modules/price-fetcher');
const tax = require('../config/tax.json');

const featureFetcher = require('../modules/feature-fetcher');

const axios = require('axios');

/* Product Search */
router.get('/', function (req, res, next) {
  // var url = 'https://www.amazon.com/Apple-iPhone-32GB-Gold-Prepaid/dp/B06XBR43HF/ref=sr_1_1_sspa?keywords=iphone&qid=1552961179&s=gateway&sr=8-1-spons&psc=1';
  // var url = 'https://www.amazon.com/Lenovo-Computer-A6-9225-Bluetooth-Windows/dp/B07GYSFZLZ/ref=sr_1_1_sspa?keywords=lenovo+laptop&qid=1552975069&s=gateway&sr=8-1-spons&psc=1';
  // var url = 'https://www.amazon.com/Razer-Blade-15-Smallest-i7-8750H/dp/B07HPQPNV1/ref=sr_1_1_sspa?keywords=Alienware&qid=1552985559&s=gateway&sr=8-1-spons&psc=1';
  // featureFetcher.getWeight(url, (err, weight) => {
  //   console.log(weight);
  //   res.render('search', { title: 'Search Item' });
  // });

  // var url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + encodeURIComponent('trnsl.1.1.20190322T053830Z.be68ef09bc438708.3d4f533342a617c24fbd002ef82f25632b16d40a') + '&text=' + encodeURIComponent('Coach handbag') + '&lang=' + encodeURIComponent('en-zh');
  // axios.get(url)
  //   .then(res => {
  //     console.log(res.data);
  //   })
  //   .catch(err => {

  //     console.log(err);
  //   });

  res.render('search', { title: 'Search Item' });
});

router.post('/', function (req, res, next) {
  priceFetcher.getPrices(req.body.name, (err, name, usprice, url, chname, chprice, churl) => {
    if (err) return next(err);
    if (!name) return res.render('no-product', { title: 'No result' });
    exchange.getExchangeRates((err, result) => {
      if (err) return next(err);
      res.render('price', { title: 'Price', prices: [{ usName: name, usPrice: parseFloat(usprice), chName: chname, chPrice: parseFloat(chprice), url: url, churl: churl }], tax: tax, exchange: result });
    });
  });
});

module.exports = router;
