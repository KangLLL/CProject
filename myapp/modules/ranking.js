const models = require('../models');
const algorithm = require('./algorithm');
const exchange = require('./exchange');

function getTopProfitProducts(top, callback) {
  models.Product.getTopRankingProduct(top, (err, results) => {
    if (err) return callback(err);
    const prices = results.map((result) => {
      return { usName: result.NAME, usPrice: parseFloat(result.USPRICE), chName: result.CHNAME, chPrice: parseFloat(result.CHPRICE), weight: parseFloat(result.WEIGHT) };
    });
    callback(null, prices);
  });
}

function getRecommendProducts(weight, callback) {
  getTopProfitProducts(20, (err, prices) => {
    if (err) return callback(err);
    exchange.getRateFromCNYToUSD((err, rate) => {
      if (err) return callback(err);
      var list = prices.map((price) => {
        return { name: price.usName, value: price.chPrice * rate - price.usPrice, weight: parseInt(price.weight * 100) }
      });

      var result = algorithm.knapsack(weight * 100, list);

      var results = {};
      Object.keys(result).forEach(i => {
        results[list[i].name] = result[i];
      });
      callback(null, results);
    });
  });
}

module.exports = {
  getTopProfitProducts: getTopProfitProducts,
  getRecommendProducts: getRecommendProducts
}