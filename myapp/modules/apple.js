const axios = require('axios');
const $ = require('cheerio');

var async = require('async');

function getIPhonePrice(usURL, chURL, callback) {
  const urls = { us: usURL, china: chURL };

  var usPrices = {};
  var chinaPrices = {};

  async.forEachOf(urls, (url, key, callback) => {
    var result = key == 'us' ? usPrices : chinaPrices;

    var productURLs = [];

    axios.get(url)
      .then(res => {
        var html = res.data;
        $('.details', html).each((i, ele) => {
          var carrier = $('.carrier-logos', $(ele)).text();
          var model = $('.dimensionCapacity', $(ele)).text();
          var price = $('.current_price', $(ele)).text();

          if (carrier == 'Unlocked' || key == 'china') {
            productURLs.push('https://www.apple.com/' + $(ele).parent().attr('href'));
          }
        });

        const modelPattern = /(.*) (\d+GB)/;
        const pricePattern = /[\$|RMB ]*(\d{1,3}(,\d{3})*(.\d+))/;

        async.forEach(productURLs, (val, cb) => {
          axios.get(val)
            .then(res => {
              var html = res.data;
              var title = $("title", html).text().trimLeft().trimRight();
              var infos = title.match(modelPattern);
              var model = infos[1];
              var cap = infos[2];
              if (!(model in result)) {
                result[model] = {};
              }
              if (!(cap in result[model])) {
                var prices = $(".as-price-currentprice", html).text().trimLeft().trimRight().match(pricePattern);
                result[model][cap] = prices[1];
              }
              cb();
            })
            .catch(err => {
              console.log(err.message);
              cb(err);
            })
        }, err => {
          if (err) console.log(err.message);
          callback();
        });
      })
      .catch(err => {
        console.log(err);
        callback(err);
      })
  }, err => {
    if (err) console.log(err.message);
    callback(err, usPrices, chinaPrices);
  });

}

module.exports = {
  getIPhonePrice: getIPhonePrice
}