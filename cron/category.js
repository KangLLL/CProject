const models = require('./models');
const async = require('async');
const fetcher = require('./feature-fetcher');

models.init((err) => {
  if (!err) {
    models.Product.loadAllUSProducts((err, results) => {
      if (!err) {
        async.series(
          results.map((result) => {
            return (cb) => {
              // if (result.WEIGHT) return cb();
              fetcher.getUSInformation(result.NAME, 'https://www.amazon.com' + result.URL, result.WEIGHT, result.CATEGORY, (err, price, weight, category) => {
                if (!err) {
                  models.Product.updateProduct(result.ID, price, weight, category, (e, r) => {
                    setTimeout(() => { cb(); }, 10000);
                  });
                }
                else {
                  setTimeout(() => { cb(); }, 10000);
                }
              });
            };
          }), (err) => {
            console.log(err);
            process.exit(0);
          });
      }
    });
  }
});