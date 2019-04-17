const axios = require('axios');
const $ = require('cheerio');
const weightUtil = require('./weight');

const iconv = require('iconv-lite');

function extractWeightFromTable(id, html) {
  var selector = '#' + id + ' th';
  var weight = null;
  $(selector, html).each((i, ele) => {
    if ($(ele).text().trim() == 'Shipping Weight') {
      weight = $(ele).next().text().trim();
      return false;
    }
  });
  return weight;
}

function extractWeightFromUl(id, html) {
  var selector = '#' + id + ' .a-list-item';
  var weight = null;
  $(selector, html).each((i, ele) => {
    if ($(ele).children().first().text().trim() == 'Shipping Weight:') {
      weight = $(ele).children().last().text().trim();
      return false;
    }
  });
  return weight;
}

function extractWeightFromLi(id, html) {
  var selector = '#' + id + ' li';
  var weight = null;
  $(selector, html).each((i, ele) => {
    if ($(ele).text().includes('Shipping Weight')) {
      weight = $(ele).text().trim();
      return false;
    }
  });
  return weight;
}

function getWeight(name, html) {
  // get weight from additional information & product information
  weight = extractWeightFromTable('productDetails_detailBullets_sections1', html);
  if (weight) return weightUtil.convertWeight(weight);

  // get weight from product description
  weight = extractWeightFromUl('detailBullets_feature_div', html);
  if (weight) return weightUtil.convertWeight(weight);

  // get weight from product detail
  weight = extractWeightFromLi('detail-bullets', html);
  if (weight) return weightUtil.convertWeight(weight);

  // get weight from name
  var partern = /(?:\d+\.)?\d+\s(?:OZ|oz|Ounce|ounce)/g;
  if (partern.exec(name)) return weightUtil.convertWeight(partern.exec(name)[0]);

  return '';
}

function getUSInformation(name, url, weight, callback) {
  axios.get(url)
    .then(res => {
      var html = res.data;
      var price = $('#cerberus-data-metrics', html).prop('data-asin-price');

      if (!price) price = $('.priceBlockBuyingPriceString', html).first().text();
      if (!price) price = $('.offer-price', html).first().text();
      if (price) {
        price = price.replace(/,|\$/g, '');
        if (price.includes('-')) {
          price = price.slice(0, price.indexOf('-')).trim();
        }
      }

      // if (!weight) {
      weight = getWeight(name, html)
      // }

      callback(null, price, weight);
    })
    .catch(err => {
      callback(err, null, null);
    });
}

function getCHInformation(url, callback) {
  axios.get(url, { 'headers': { 'Content-Type': 'text/html; charset=utf8' } })
    .then(res => {
      // var html = iconv.decode(Buffer.from(res.data, 'gb2312'), 'utf8');
      var html = res.data;
      var price = $('.summary-price', html).first();
      var result = $('.p-price', price).first().text();
      console.log(result);
      callback(null, result);
    })
    .catch(err => {
      callback(err);
    });
}

module.exports = {
  getWeight: getWeight,
  getUSInformation: getUSInformation,
  getCHInformation: getCHInformation
}