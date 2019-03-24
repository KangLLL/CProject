const axios = require('axios');
const $ = require('cheerio');
const algorithm = require('./algorithm');

function getPrice(keyword, name, price, callback) {
  // var keys = name.split(' ');
  // var temp = keys[0];
  // var i = 1;
  // while (i < keys.length && temp.length < 20) {
  //   temp = temp + ' ' + keys[i];
  //   i ++;
  // }
  price = parseFloat(price);
  var url = 'https://search.jd.com/Search?keyword=' + encodeURIComponent(keyword) + '&ev=exprice_' + (price * 3) + '-' + (price * 30);
  console.log(url);
  axios.get(url)
    .then(res => {
      var html = res.data;

      var mPrice = '';
      var mName = '';
      var mURL = '';
      var match = 1000;

      var errorDiv = $('.check-error', html);
      if (errorDiv && errorDiv.text().includes('汪~没有找到与')) {
        return callback(null, null, null);
      }

      $('.gl-item .gl-i-wrap', html).each((i, ele) => {
        var n = $('.p-name em', $(ele)).text();

        if (!n.includes('二手')) {

          name = 'Apple iPhone XR (64GB) - Black - [Locked to Simple Mobile Prepaid]';

          var temp = algorithm.editDistance(n, name);
          // console.log(temp);
          // console.log(n);
          // console.log(name);

          if (temp < match || (temp == match && n.length < mName.length)) {
            mPrice = $('.p-price strong', $(ele)).text();
            mName = n;
            mURL = $('.p-name a', $(ele)).attr('href');
            match = temp;
          }
        }
      });
      callback(null, mName, mPrice, mURL);
    })
    .catch(err => {
      callback(err, null, null, null);
    });
}

module.exports = {
  getPrice: getPrice
}