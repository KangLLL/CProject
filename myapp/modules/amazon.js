const axios = require('axios');
const $ = require('cheerio');

function getPrice(name, callback) {
  var url = 'https://www.amazon.com/s?k=' + name.replace(/ /g, '+');
  console.log(url);
  axios.get(url)
    .then(res => {
      var html = res.data;
      var name = '';
      var price = '';
      $('.sg-col-inner .sg-col-inner', html).each((i, ele) => {
        if ($('h5 span', $(ele))[0] && $('.a-offscreen', $(ele))[0]) {
          
          name = $('h5 span', $(ele)).text();
          name = name.slice(0, name.indexOf('-') - 1);
          price = $('.a-offscreen', $(ele)).first().text();

          return false;
        }
      });
      callback(null, name, price);
    })
    .catch(err => {
      callback(err, null, null);
    });
}

module.exports = {
  getPrice: getPrice
}