const axios = require('axios');
const models = require('../models');
const date = require('./date');

const apiURL = 'https://api.exchangeratesapi.io/latest';
const baseParameter = 'base';
const toParameter = 'symbols';
const USDSymbol = 'USD';
const CNYSymbol = 'CNY';
const USDToCNYType = 1;
const CNYToUSDType = 2;

function constructURL(names, parameters) {
  if (names.length == 0) return apiURL;
  var result = apiURL + '?';
  for (var i = 0; i < names.length; i++) {
    result = result + names[i] + '=' + parameters[i] + '&'; 
  }

  return result.substring(0, result.length - 1);
}

function getExchangeRate(type, callback) {
  models.ExchangeRate.loadLatestByType(type , (err, results) => {
    if (err || results.length == 0 || date.isDaysAfter(results[0].DATE, 1)) {
      var base = type == USDToCNYType ? USDSymbol : CNYSymbol;
      var to = type == USDToCNYType ? CNYSymbol : USDSymbol;
      axios.get(constructURL([ baseParameter,toParameter ], [ base, to ]))
        .then(res => {
          models.ExchangeRate.insert(res.data.rates[to], res.data.date, type, (err, result) => {
            if (err) callback(err);
            else callback(null, res.date.rates[to]);
          });
        })
        .catch(err => {
          callback(err);
        });
    }
    else {
      callback(null, results[0].RATE);
    }
  });
}

function getRateFromUSDToCNY(callback) {
  this.getExchangeRate(USDToCNYType, callback);
}

function getRateFromCNYToUSD(callback) {
  this.getExchangeRate(CNYToUSDType, callback);
}

function convertUSDToCNY() {
}

function contertCNYToUSD() {
}

module.exports = {
  getRateFromUSDToCNY: getRateFromUSDToCNY,
  getRateFromCNYToUSD: getRateFromCNYToUSD
}