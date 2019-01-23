const taxMap = require("../config/tax.json");

function getTax(price, state) {
  return price * taxMap[state];
}

module.exports = {
  getTax: getTax
}