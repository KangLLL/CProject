const axios = require('axios');
const $ = require('cheerio');
const algorithm = require('./algorithm');
const cfg = require('../config/config.json')

function getPrice(name, callback) {
  var url = 'https://www.amazon.com/s?k=' + name.replace(/ /g, '+');
  console.log(url);
  axios.get(url)
    .then(res => {
      var html = res.data;
      var n = '';
      var price = '';
      var url = '';
      var minDistance = 1000;
      var top = cfg.amazonTop;

      $('h5 span', html).each((i, ele) => {
        if ($(ele).closest('.s-shopping-adviser').length == 0 && !$(ele).closest('.sg-col-inner').find('.a-color-secondary').first().text().includes('Sponsored')) {
          var temp = $(ele).text();

          var dist = algorithm.editDistance(temp.toLowerCase(), name.toLowerCase());
          if (dist < minDistance || (dist == minDistance && temp.length < n.length)) {
            minDistance = dist;

            var part = $(ele).closest('.sg-col-inner');
            while (part.find('.a-offscreen').length == 0) {
              part = part.parent().closest('.sg-col-inner');
            }

            price = $(part).find('.a-offscreen').first().text();
            n = temp;
            url = $(ele).parent().attr('href');
          }
          if (--top == 0) return false;
        }
      });

      // $('.sg-col-inner .sg-col-inner', html).not('.s-shopping-adviser').each((i, ele) => {
      //   if ($('h5 span', $(ele)).length == 1 && $('.a-offscreen', $(ele))[0] && !$('.sg-col-inner .a-color-secondary', $(ele)).first().text().includes('Sponsored')) {
      //     var temp = $('h5 span', $(ele)).text();

      //     var dist = algorithm.editDistance(temp.toLowerCase(), name.toLowerCase());
      //     if (dist < minDistance || (dist == minDistance && temp.length < n.length)) {
      //       minDistance = dist;
      //       price = $('.a-offscreen', $(ele)).first().text();
      //       n = temp;
      //       url = $('h5>a', $(ele)).attr('href');
      //     }
      //     if (--top == 0) return false;
      //   }
      // });
      callback(null, n, price, url);
    })
    .catch(err => {
      callback(err, null, null, null);
    });
}

module.exports = {
  getPrice: getPrice
}