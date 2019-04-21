const models = require('../models')
const bcrypt = require('bcrypt');

function signUp(email, password, callback) {
  models.User.loadByEmail(email, (err, result) => {
    if (err) return callback(err);
    if (result) return callback(null, null);
    bcrypt.hash(password, 2019, (err, hashedPassword) => {
      if (err) return callback(err);
      models.User.insert(email, hashedPassword, (err, result) => {
        if (err) return callback(err);
        callback(null, result);
      });
    });
  });
}

function login(email, password, callback) {
  models.User.loadByEmail(email, (err, result) => {
    if (err) return callback(err);
    if (!result) return callback(null, null);
    bcrypt.compare(password, result.PASSWORD, (err, same) => {
      if (err) return callback(err);
      return callback(null, same);
    });
  });
}

module.exports = {
  signUp: signUp,
  login: login
}