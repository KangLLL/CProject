const axios = require('axios');
const $ = require('cheerio');
const weightUtil = require('./weight');

const iconv = require('iconv-lite');

function extractWeightFromTable(id, html) {
  var selector = '#' + id + ' th';
  var weight = null;
  $(selector, html).each((i, ele) => {
    if ($(ele).text().trim() == 'Item Weight') {
      weight = $(ele).next().text().trim();
      return false;
    }
  });
  return weight;
}

function getWeight(name, html) {
  var partern = /(?:\d+\.)?\d+\s(?:OZ|oz)/g;
  if (partern.exec(name)) return weightUtil.convertWeight(partern.exec(name)[0]);

  var title = $('td.a-text-bold', html).filter((i, ele) => {
    return $(ele).children().first().text() == 'Weight';
  });

  var weight = title.next().children().first().text();

  if (weight) return weightUtil.convertWeight(weight);

  title = $('#productDescription strong', html).filter((i, ele) => {
    return $(ele).text() == 'Weight';
  });

  var info = title.parent().text();
  var partern = /Weight:\s((?:\d+\.)?\d+\s(?:lbs|ounces|pounds|ozs|lb|ounce|pound|oz))/g;
  if (info) weight = partern.exec(info)[1];

  if (weight) return weightUtil.convertWeight(weight);

  weight = extractWeightFromTable('productDetails_techSpec_section_2', html);
  if (weight) return weightUtil.convertWeight(weight);

  weight = extractWeightFromTable('productDetails_detailBullets_sections1', html);
  if (weight) return weightUtil.convertWeight(weight);

  title = $('#feature-bullets .a-list-item', html).filter((i, ele) => {
    return $(ele).text().includes('oz') || $(ele).text().includes('OZ');
  });
  partern = /((?:\d+\.)?\d+\s(?:OZ|oz))\s/g;
  if (title.text()) weight = partern.exec(title.text())[1];

  if (weight) return weightUtil.convertWeight(weight);

  return null;
}

function getUSInformation(name, url, weight, callback) {
  axios.get(url)
    .then(res => {
      var html = res.data;
      var price = $('#cerberus-data-metrics', html).prop('data-asin-price');

      if (!price) price = $('.priceBlockBuyingPriceString', html).first.text(); 
      if (price) price = price.replace(/,|￥|¥/g, '');

      if (!weight) {
        weight = getWeight(name, html)
      }

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