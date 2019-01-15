var express = require('express');
var router = express.Router();

const rp = require('request-promise');
const $ = require('cheerio');


/* GET home page. */
router.get('/', function(req, res, next) {

  // const urls = [];

  // rp('https://www.apple.com/iphone')
  //   .then((html)=>{
  //     var links = $('.chapternav-item > .chapternav-link', html);
  //     for (let i = 0; i < links.length; i++) {
  //       urls.push(links[i].attribs.href);
  //     }
  //     console.log(urls);

  //     // console.log(html);
  //   })
  //   .catch((err)=>{
  //     console.log(err);
  //   });


  res.render('index', { title: 'Price Comparison System' });
});

module.exports = router;
