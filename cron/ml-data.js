const models = require('./models');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csv = require('csv-parser');
const fs = require('fs');

const csvWriter = createCsvWriter({
  path: 'out.csv',
  encoding: 'utf8',
  header: [
    { id: 'NAME', title: 'name' },
    { id: 'CATEGORY', title: 'category' }
  ]
});

models.init((err) => {
  if (!err) {
    models.Product.loadNameAndCategory((err, results) => {
      if (!err) {
        // results.forEach(result => {
        //   console.log(result.NAME);
        // });
        csvWriter.writeRecords(results)
          .then(() => {
            console.log('done');

            // var results = [];
            // fs.createReadStream('out.csv')
            //   .pipe(csv())
            //   .on('data', (data) => results.push(data))
            //   .on('end', () => {
            //     console.log(results);

            //     results.forEach(result => {
            //       console.log(result.name);
            //     });
            //   });
          });
      }
    });
  }
});