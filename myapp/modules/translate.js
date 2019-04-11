const axios = require('axios')

function translate(input, callback) {
  var url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + encodeURIComponent('trnsl.1.1.20190322T053830Z.be68ef09bc438708.3d4f533342a617c24fbd002ef82f25632b16d40a') + '&text=' + encodeURIComponent(input) + '&lang=' + encodeURIComponent('en-zh');
  axios.get(url)
    .then(res => {
      callback(null, res.data.text[0]);
    })
    .catch(err => {
      callback(err, null);
    });
}

module.exports = {
  translate: translate
}