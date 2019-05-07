const models = require('../models');
const algorithm = require('./algorithm');
const exchange = require('./exchange');
const config = require('../config/config');

function mapFunction(result) {
  return { usName: result.NAME, usPrice: parseFloat(result.USPRICE), chName: result.CHNAME, chPrice: parseFloat(result.CHPRICE), weight: parseFloat(result.WEIGHT), url: result.URL, churl: result.CHURL };
}

function getTopProfitProducts(top, credible, callback) {
  exchange.getRateFromCNYToUSD((err, rate) => {
    if (err) return callback(err);
    models.Product.getTopRankingProductForUS(top, rate, credible, (err, results) => {
      if (err) return callback(err);
      const us = results.map(mapFunction);
      models.Product.getTopRankingProductForChina(top, rate, credible, (err, results) => {
        if (err) return callback(err);
        const chn = results.map(mapFunction);
        callback(null, us, chn);
      });
    });
  });
}

function processResult(prices, weight, rate, isFromUS, callback) {
  var list = prices.map((price) => {
    return { name: price.NAME, value: isFromUS ? (price.CHPRICE * rate - price.USPRICE) : (price.USPRICE - price.CHPRICE * rate), weight: parseInt(price.WEIGHT * 100), url: isFromUS ? 'https://www.amazon.com' + price.URL : price.CHURL }
  });

  list = list.filter((price) => {
    return price.value > 0;
  });
  var result = algorithm.knapsack(weight * 100, list);

  var results = [];
  Object.keys(result).forEach(i => {
    results[i] = { name: list[i].name, count: result[i], url: list[i].url };
  });
  callback(null, results);
}

function getRecommendProducts(weight, isFromUS, credible, callback) {
  exchange.getRateFromCNYToUSD((err, rate) => {
    if (err) return callback(err);
    if (isFromUS) {
      models.Product.getTopRankingProductForUS(config.rankCount, rate, credible, (err, results) => {
        if (err) return callback(err);
        processResult(results, weight, rate, isFromUS, callback);
      });
    }
    else {
      models.Product.getTopRankingProductForChina(config.rankCount, rate, credible, (err, results) => {
        if (err) return callback(err);
        processResult(results, weight, rate, isFromUS, callback);
      });
    }
  });
}

module.exports = {
  getTopProfitProducts: getTopProfitProducts,
  getRecommendProducts: getRecommendProducts
}