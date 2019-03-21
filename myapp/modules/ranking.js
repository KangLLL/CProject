const models = require('../models')

function getTopProfitProducts(top, callback) {
  models.Product.getTopRankingProduct(top, (err, results) => {
    if (err) return callback(err);
    const prices = results.map((result) => {
      return { usName: result.NAME, usPrice: parseFloat(result.USPRICE), chName: result.CHNAME, chPrice: parseFloat(result.CHPRICE), weight: parseFloat(result.WEIGHT) };
    });
    callback(null, prices);
  });
}

module.exports = {
  getTopProfitProducts: getTopProfitProducts
}