const axios = require('axios');
const $ = require('cheerio');
const algorithm = require('./algorithm');

function fetch(keyword, name, price, callback) {
  price = parseFloat(price);
  var url = 'https://search.jd.com/Search?keyword=' + encodeURIComponent(keyword) + '&ev=exprice_' + (price * 2) + '-' + (price * 50);
  console.log(url);
  axios.get(url)
    .then(res => {
      var html = res.data;

      // var mPrice = '';
      // var mName = '';
      // var mURL = '';
      // var match = 1000;

      // var errorDiv = $('.check-error', html);
      // if (errorDiv && errorDiv.text().includes('汪~没有找到与')) {
      //   return callback(null, null, null);
      // }
      products = [];

      $('.gl-item .gl-i-wrap', html).each((i, ele) => {
        var n = $('.p-name em', $(ele)).text();

        if (!n.includes('二手') && $('.p-price strong', $(ele)).text().length > 1) {
          var temp = algorithm.editDistance(n, name);

          // var temp1 = algorithm.editDistance(n, translate);
          // temp = (temp + temp1) / 2;
          // console.log(translate);
          // console.log(temp1);

          // console.log(temp);
          // console.log(n);
          // console.log(name);

          var lo = 0;
          var hi = products.length;
          while (lo < hi) {
            var mid = Math.floor((lo + hi) / 2);
            if (products[mid].distance < temp) {
              lo = mid + 1;
            }
            else {
              hi = mid;
            }
          }

          products.splice(hi, 0, { name: n, price: $('.p-price strong', $(ele)).text(), url: $('.p-name a', $(ele)).attr('href'), image: $('.p-img img', $(ele)).attr('source-data-lazy-img'), distance: temp });

          // if (temp < match || (temp == match && n.length < mName.length)) {
          //   mPrice = $('.p-price strong', $(ele)).text();
          //   mName = n;
          //   mURL = $('.p-name a', $(ele)).attr('href');
          //   match = temp;
          // }
        }
      });
      callback(null, products);
    })
    .catch(err => {
      callback(err, null);
    });
}


function getPrice(keyword, name, price, callback) {
  // var url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + encodeURIComponent('trnsl.1.1.20190322T053830Z.be68ef09bc438708.3d4f533342a617c24fbd002ef82f25632b16d40a') + '&text=' + encodeURIComponent(name) + '&lang=' + encodeURIComponent('en-zh');
  // axios.get(url)
  //   .then(res => {
  //     fetch(keyword, name, res.data.text[0], price, callback);
  //   })
  //   .catch(err => {
  //     fetch(keyword, name, null, price, callback);
  //   });

  fetch(keyword, name, price, callback);
}

module.exports = {
  getPrice: getPrice
}