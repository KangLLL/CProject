const dayjs = require('dayjs');

function isDaysAfter(date, days) {
  var now = dayjs(Date.now());
  var date1 = dayjs(date);
  return now.isAfter(date1.add(days, "day"));
}

module.exports = {
  isDaysAfter: isDaysAfter
}