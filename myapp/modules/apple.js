const rp = require('request-promise');
const $ = require('cheerio');

var async = require('async');

function getIPhonePrice(model, callback) {
  const modelDict = {7: 'iphone-7', 8:'iphone-8'};
  const urls = {us: 'https://www.apple.com/shop/buy-iphone/', china: 'https://www.apple.cn/shop/buy-iphone/'};

  var usPrices = {};
  var chinaPrices = {};

  async.forEachOf(urls, (value, key, callback)=>{
    var url = value + modelDict[model];
    var result = key == 'us' ? usPrices : chinaPrices;

    var productURLs = [];
    
    rp(url).then((html) => {
      
      $('.details', html).each((i, ele)=> {
        var carrier = $('.carrier-logos', $(ele)).text();
        var model = $('.dimensionCapacity', $(ele)).text();
        var price = $('.current_price', $(ele)).text();

        if (carrier == 'Unlocked' || key == 'china') {
          productURLs.push('https://www.apple.com/' + $(ele).parent().attr('href'));
          // var infos = $(ele).parent().attr('href').split('/');var size = infos[infos.length - 1].split('-')[0];
          // if (!(size in result)) {
          //   result[size] = {};
          // }
          // if (!(model in result[size])) {
          //   result[size][model] = price;
          // }
        }
      });


      var pattern = '(*) (\d+GB)*';
      var test = 'iPhone 7 Plus 128GB Black Unlocked - Apple';

      async.forEach(productURLs, (val, cb)=>{
        rp(val).then((html) => {
          console.log($.load(html)("title").text());
          cb();
        })
        .catch (err=>{
          console.log(err.message);
          cb(err);
        })
      }, err=>{
        if (err) console.log(err.message);
        callback();
      });
    })
    .catch(err=>{
      console.log(err);
      callback(err);
    })
  }, err=>{
    if (err) console.log(err.message);
    callback(err, usPrices, chinaPrices);
  });

}

module.exports = {
  getIPhonePrice: getIPhonePrice
}