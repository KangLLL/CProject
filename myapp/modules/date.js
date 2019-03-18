const dayjs = require('dayjs');

function isDaysAfter(date, days) {
  var now = dayjs(Date.now());
  var date1 = dayjs(date);
  return now.isAfter(date1.add(days, 'day'));
}

function currentDate() {
  return dayjs().format('YYYY-MM-DD');
}

function dateString(date) {
  return dayjs(date).format('YYYY-MM-DD');
}

module.exports = {
  isDaysAfter: isDaysAfter,
  currentDate: currentDate,
  dateString: dateString
}