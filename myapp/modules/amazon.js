const axios = require('axios');
const $ = require('cheerio');
const algorithm = require('./algorithm');

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
      var top = 5;
      $('.sg-col-inner .sg-col-inner', html).each((i, ele) => {
        if ($('h5 span', $(ele))[0] && $('.a-offscreen', $(ele))[0]) {
          var temp = $('h5 span', $(ele)).text();
          
          var dist = algorithm.editDistance(temp.toLowerCase(), name.toLowerCase());
          if (dist < minDistance || (dist == minDistance && temp.length < n.length)) {
            minDistance = dist;
            price = $('.a-offscreen', $(ele)).first().text();
            n = temp;
            url = $('h5>a', $(ele)).attr('href');
          }
          if (--top == 0) return false;
        }
      });
      callback(null, n, price, url);
    })
    .catch(err => {
      callback(err, null, null, null);
    });
}

module.exports = {
  getPrice: getPrice
}