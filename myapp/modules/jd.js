const axios = require('axios');
const $ = require('cheerio');
const algorithm = require('./algorithm');

function fetch(keyword, name, translate, price, callback) {
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
          var temp = algorithm.editDistance(n, name);
          if (translate) {
            var temp1 = algorithm.editDistance(n, translate);
            // temp = (temp + temp1) / 2;
            console.log(translate);
            console.log(temp1);
          }
          console.log(temp);
          console.log(n);
          console.log(name);

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


function getPrice(keyword, name, price, callback) {
  var url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + encodeURIComponent('trnsl.1.1.20190322T053830Z.be68ef09bc438708.3d4f533342a617c24fbd002ef82f25632b16d40a') + '&text=' + encodeURIComponent(name) + '&lang=' + encodeURIComponent('en-zh');
  axios.get(url)
    .then(res => {
      fetch(keyword, name, res.data.text[0], price, callback);
    })
    .catch(err => {
      fetch(keyword, name, null, price, callback);
    });
}

module.exports = {
  getPrice: getPrice
}