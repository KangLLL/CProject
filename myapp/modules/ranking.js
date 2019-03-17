const models = require('../models')

function getTopProfitProducts(top, callback) {
  models.Product.getTopRankingProduct(top, callback);
}

module.exports = {
  getTopProfitProducts: getTopProfitProducts
}