function convertWeight(weight) {
  weight = weight.trim();
  
  reg = /(\d+\.?\d+)\s(lbs|ounces|pounds|ozs|lb|ounce|pound|oz)/ig

  if (!weight.match(reg)) return parseFloat(weight);

  var info = reg.exec(weight);
  var value = info[1];
  var unit = info[2];


  return (unit == 'lbs' || unit == 'lb' || unit == 'pound' || unit == 'pounds') ? parseFloat(value) : parseFloat(value) / 16;
}

module.exports = {
  convertWeight: convertWeight;
}