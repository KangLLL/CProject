const axios = require('axios');
const $ = require('cheerio');
const utility = require('./utility');

function getPrice(keyword, name, price, callback) {
  // var keys = name.split(' ');
  // var temp = keys[0];
  // var i = 1;
  // while (i < keys.length && temp.length < 20) {
  //   temp = temp + ' ' + keys[i];
  //   i ++;
  // }
  price = parseFloat(price);
  var url = 'https://search.jd.com/Search?keyword=' + encodeURIComponent(keyword) + '&ev=exprice_' + (price * 5) + '-' + (price * 20);
  console.log(url);
  axios.get(url)
    .then(res => {
      var html = res.data;
      var brand = name.split(' ')[0];

      var mPrice = '';
      var mName = '';
      var match = 1000;

      var errorDiv = $('.check-error', html);
      if (errorDiv && errorDiv.text().includes('汪~没有找到与')) {
        return callback(null, null, null);
      }

      $('.gl-item .gl-i-wrap', html).each((i, ele) => {
        var p = $('.p-price strong', $(ele)).text();
        var n = $('.p-name em', $(ele)).text();

        if (n.includes(brand) && !n.includes('二手')) {

          var temp = utility.editDistance(n, name);

          console.log(temp);
          console.log(n);
          console.log(name);

          if (temp < match || (temp == match && n.length < mName.length)) {
            mPrice = p;
            mName = n;
            match = temp;
          }
        }
      });
      callback(null, mName, mPrice);
    })
    .catch(err => {
      callback(err, null, null);
    });
}

module.exports = {
  getPrice: getPrice
}