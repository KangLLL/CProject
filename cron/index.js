const models = require('./models');
const async = require('async');
const fetcher = require('./feature-fetcher');

models.init((err) => {
  if (!err) {
    async.parallel([
      (callback) => {
        models.Product.loadUSComparisonProducts((err, usIds) => {
          if (err) return callback(err);
          models.Product.loadUSProducts(usIds.map((ob) => { return ob.USID; }), (err, results) => {
            if (err) return callback(err);
            async.series(
              results.map((result) => {
                return (cb) => {
                  // if (result.WEIGHT) return cb();
                  fetcher.getUSInformation(result.NAME, 'https://www.amazon.com' + result.URL, result.WEIGHT, (err, price, weight) => {
                    if (!err) {
                      models.Product.updateUSPrice(result.ID, price, (e, r) => {
                        if (weight) {
                          models.Product.updateWeight(result.ID, weight, (e, r) => {
                            setTimeout(() => { cb(); }, 30000);
                          });
                        }
                        else {
                          setTimeout(() => { cb(); }, 30000);
                        }
                      });
                    }
                    else {
                      setTimeout(() => { cb(); }, 30000);
                    }
                  });
                };
              }), (err) => {
                callback(err);
              });
          });
        });
      },
      (callback) => {
        models.Product.loadCHComparisonProducts((err, chIds) => {
          if (err) return callback(err);
          models.Product.loadCHProducts(chIds.map((ob) => { return ob.CHID; }), (err, results) => {
            if (err) return callback(err);
            async.series(
              results.map((result) => {
                return (cb) => {
                  fetcher.getCHInformation("http:" + result.URL, (err, price) => {
                    setTimeout(() => { cb(null); }, 10000);
                  });
                };
              }), (err) => {
                callback(err);
              });
          });
        });
      }
    ], (err, results) => {
      console.log(err);
      console.log(results);
      process.exit(1);
    });
  }
});