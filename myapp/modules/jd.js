const axios = require('axios');
const $ = require('cheerio');

function getPrice(name, callback) {
  var url = 'https://search.jd.com/Search?keyword=' + encodeURIComponent(name);
  console.log(url);
  axios.get(url)
    .then(res => {
      var html = res.data;
      var brand = name.split(' ')[0];

      var mPrice = '';
      var mName = '';
      var match = 0;

      $('.gl-item .gl-i-wrap', html).each((i, ele) => {
        var p = $('.p-price strong', $(ele)).text();
        var n = $('.p-name em', $(ele)).text();

        if (n.includes(brand) && !n.includes('二手')) {

          var temp = 0;
          var i = 0;
          var j = 0;

          while (i < name.length && j < n.length) {
            if (name.charAt(i) == n.charAt(j)) {
              i++;
              j++;
              temp++;
            }
            else {
              j++;
            }
          }

          if (temp > match || (temp == match && n.length < mName.length)) {
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