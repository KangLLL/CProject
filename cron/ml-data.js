const models = require('./models');

models.init((err) => {
  if (!err) {
    models.Product.loadNameAndCategory((err, results)=>{
      if (!err) {
        console.log(results);
      }
    });
  }
});