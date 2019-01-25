const axios = require('axios');
const apiURL = 'https://api.exchangeratesapi.io/latest';
const baseParameter = 'base';
const toParameter = 'symbols';
const USDSymbol = 'USD';
const CNYSymbol = 'CNY';

function constructURL(names, parameters) {
  if (names.length == 0) return apiURL;
  var result = apiURL + '?';
  for (var i = 0; i < names.length; i++) {
    result = result + names[i] + '=' + parameters[i] + '&'; 
  }

  return result.substring(0, result.length - 1);
}

function getExchangeRate(base, to) {
  axios.get(constructURL([ baseParameter,toParameter ], [ base, to ]))
    .then(res => {
      console.log(res.data.rates[to]);
    })
    .catch(err => {
      console.log(err.message);
    });
}

function getRateFromUSDToCNY() {
  getExchangeRate(USDSymbol, CNYSymbol);
}

function getRateFromCNYToUSD() {
  getExchangeRate(CNYSymbol, USDSymbol);
}

function convertUSDToCNY() {
}

function contertCNYToUSD() {
}

module.exports = {
  getRateFromUSDToCNY: getRateFromUSDToCNY,
  getRateFromCNYToUSD: getRateFromCNYToUSD
}