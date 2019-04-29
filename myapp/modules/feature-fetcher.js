const axios = require('axios');
const $ = require('cheerio');
const weightUtil = require('./weight');

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

function getCategory(html) {
  return $('#wayfinding-breadcrumbs_feature_div ul', html).children().first().text().trim();
}

function fetchFeature(name, url, callback) {
  setTimeout(() => {
    axios.get(url)
      .then(res => {
        var html = res.data;
        callback(null, getWeight(name, html), getCategory(html));
      })
      .catch(err => {
        callback(err, null, null);
      });
  }, 1000);
}

module.exports = {
  fetchFeature: fetchFeature
}