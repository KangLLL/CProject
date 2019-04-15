const models = require('./models');
const async = require('async')

models.init((err) => {
  if (!err) {
    async.parallel([
      (callback) => {
        models.Product.loadUSComparisonProducts((err, usIds) => {
          if (err) return callback(err);
          models.Product.loadUSProducts(usIds.map((ob) => { return ob.USID; }), (err, results) => {
            if (err) return callback(err);
            console.log(results);
            callback(null, results);
          });
        });
      },
      (callback) => {
        models.Product.loadCHComparisonProducts((err, chIds) => {
          if (err) return callback(err);
          models.Product.loadCHProducts(chIds.map((ob) => { return ob.CHID; }), (err, results) => {
            if (err) return callback(err);
            console.log(results);
            callback(null, results);
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