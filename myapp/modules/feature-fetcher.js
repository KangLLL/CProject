const axios = require('axios');
const $ = require('cheerio');
const weightUtil = require('./weight');

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

function getWeight(url, callback) {
  axios.get(url)
    .then(res => {
      var html = res.data;

      var title = $('td.a-text-bold', html).filter((i, ele) => {
        return $(ele).children().first().text() == 'Weight';
      });

      var weight = title.next().children().first().text();

      if (weight) return callback(null, weightUtil.convertWeight(weight));

      title = $('#productDescription strong', html).filter((i, ele) => {
        return $(ele).text() == 'Weight';
      });

      var info = title.parent().text();
      var partern = /Weight:\s(\d+\.?\d+\s(?:lbs|ounces|pounds|ozs|lb|ounce|pound|oz))/g;
      if (info) weight = partern.exec(info)[1];
      
      if (weight) return callback(null, weightUtil.convertWeight(weight));


      weight = extractWeightFromTable('productDetails_techSpec_section_2', html);
      if (weight) return callback(null, weightUtil.convertWeight(weight));

      weight = extractWeightFromTable('productDetails_detailBullets_sections1', html);
      if (weight) return callback(null, weightUtil.convertWeight(weight));

      title = $('#feature-bullets .a-list-item', html).filter((i, ele)=>{
        return $(ele).text().includes('oz') || $(ele).text().includes('OZ');
      });
      partern = /(\d+\.?\d+\s(?:OZ|oz))\s/g;
      if (title.text()) weight = partern.exec(title.text())[1];

      if (weight) return callback(null, weightUtil.convertWeight(weight));
    })
    .catch(err => {
      callback(err, null);
    });
}

module.exports = {
  getWeight: getWeight
}