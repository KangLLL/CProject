const axios = require('axios');
const $ = require('cheerio');
const weightUtil = require('./weight');

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

      title = $('#productDetails_techSpec_section_2 th', html).filter((i, ele) => {
        return $(ele).text().trim() == 'Item Weight';
      });
      weight = title.next().text().trim();

      if (weight) return callback(null, weightUtil.convertWeight(weight));

    })
    .catch(err => {
      callback(err, null);
    });
}

module.exports = {
  getWeight: getWeight
}