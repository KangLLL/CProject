const apple = require('./apple');
const models = require('../models')

function getPrice(product, callback) {
  models.Product.loadByName(product, (err, result) => {
    console.log(err);
    console.log(result.length);

    callback(err, result);
  });
}

module.exports = {
  getPrice: getPrice
}