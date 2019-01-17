var express = require('express');
var router = express.Router();

const rp = require('request-promise');
const $ = require('cheerio');

const fs = require('fs');

/* Product Search */
router.get('/', function(req, res, next) {
  // var html = '<ul id="fruits"><li class="apple">Apple</li><li class="orange">Orange</li><li class="pear">Pear</li></ul>';

  // console.log($('li', html).length);
  
  // $('li', html).each((i, ele) => {
  //   console.log(ele.text());
  // });
  res.render('search', { title: 'Search Item' });
});

router.post('/', function(req, res, next) {
  var usPrices = {};
  var chinaPrices = [];

  rp('https://www.apple.com/shop/buy-iphone/iphone-7')
    .then((html)=>{
  
      $('.details', html).each((i, ele)=> {
        console.log($(ele).parent());
        var carrier = $('.carrier-logos', $(ele)).text();
        var model = $('.dimensionCapacity', $(ele)).text();
        var price = $('.current_price', $(ele)).text();

        if (carrier == 'Unlocked') {
          var infos = $(ele).parent().attr('href').split('/');var size = infos[infos.length - 1].split('-')[0];
          if (!(size in usPrices)) {
            usPrices[size] = {};
          }
          if (!(model in usPrices[size])) {
            usPrices[size][model] = price;
          }
        }
      });

      console.log(usPrices);
      
      // console.log(caps.length);
      // for (let i = 0; i < caps.length; i++) {
      //   console.log(caps[i]);
      //   console.log(caps[i].textContent());
      //   models.push(caps[i].text);
      //   // urls.push(caps[i].attribs.href);
      // }
      console.log(models);
      res.render('result', { info:req.body.models[0] });
      // console.log(html);
    })
    .catch((err)=>{
      console.log(err);
    });
});

module.exports = router;
