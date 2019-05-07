const models = require('./models');

const axios = require('axios');
const $ = require('cheerio');
const dayjs = require('dayjs');

axios.get('https://camelcamelcamel.com/')
  .then(res => {
    var html = res.data;
    var result = [];

    $('.deal_top_inner', html).each((i, ele) => {
      var name = $('h3 a', ele).attr('title');

      name = name.replace('Price history for ', '').trim();
      result.push({ name: name });
    });
    models.init((err) => {
      if (!err) {
        models.Product.insertOrUpdatePromotion(result, dayjs().format('YYYY-MM-DD'), (e, r) => { 
          if (e) {
            console.log(e);
            process.exit(1);
          }
          process.exit(0);
        });
      }
    });
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });