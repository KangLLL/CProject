const axios = require('axios');
const models = require('../models');
const date = require('./date');
const cfg = require('../config/config.json');
const async = require('async');

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
  models.ExchangeRate.loadLatestByType(type, (err, result) => {
    if (err || !result || date.isDaysAfter(result.DATE, cfg.exchangeRateRefreshDay)) {
      var base = type == USDToCNYType ? USDSymbol : CNYSymbol;
      var to = type == USDToCNYType ? CNYSymbol : USDSymbol;
      axios.get(constructURL([baseParameter, toParameter], [base, to]))
        .then(res => {
          if (!result || res.data.date != date.dateString(result.DATE)) {
            models.ExchangeRate.insert(res.data.rates[to], res.data.date, type, (err, result) => {
              if (err) return callback(err);
              else callback(null, res.data.rates[to]);
            });
          }
          else {
            callback(null, result.RATE);
          }
        })
        .catch(err => {
          callback(err);
        });
    }
    else {
      callback(null, result.RATE);
    }
  });
}

function getRateFromUSDToCNY(callback) {
  getExchangeRate(USDToCNYType, callback);
}

function getRateFromCNYToUSD(callback) {
  getExchangeRate(CNYToUSDType, callback);
}

function convertUSDToCNY(price, callback) {
  getRateFromUSDToCNY((err, res) => {
    if (err) callback(err);
    else callback(null, price * res);
  });
}

function convertCNYToUSD(price, callback) {
  getRateFromCNYToUSD((err, res) => {
    if (err) callback(err);
    else callback(null, price * res);
  })
}

function getExchangeRates(callback) {
  var result = {};
  async.forEach(['CU', 'UC'], (val, cb) => {
    if (val == 'CU') getRateFromCNYToUSD((err, res) => {
      if (err) return cb(err);
      result['CTU'] = res;
      cb();
    });
    else getRateFromUSDToCNY((err, res) => {
      if (err) return cb(err);
      result['UTC'] = res;
      cb();
    });
  }, err => {
    if (err) return callback(err);
    callback(null, result);
  });
}

module.exports = {
  getRateFromUSDToCNY: getRateFromUSDToCNY,
  getRateFromCNYToUSD: getRateFromCNYToUSD,
  getExchangeRates: getExchangeRates,
  convertUSDToCNY: convertUSDToCNY,
  convertCNYToUSD: convertCNYToUSD
}