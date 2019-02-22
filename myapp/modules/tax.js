const taxMap = require("../config/tax.json");

function getTax(prices, state) {
  for (var name in prices) {
    var price = prices[name]["price"];
    var purchaseTax = price * taxMap[state] / 100;
    prices[name]["tax"] = purchaseTax;
  }
  return prices;
}

module.exports = {
  getTax: getTax
}