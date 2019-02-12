const apple = require('./apple');
const models = require('../models')

function getPrice(product, callback) {
  models.Product.loadByName(product, (err, result) => {
    
  })
}

module.exports = {
  getIPhonePrice: getIPhonePrice
}