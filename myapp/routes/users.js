var express = require('express');
var router = express.Router();

const user = require('../modules/user');

/* GET users listing. */
router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'Sign Up' });
});

router.post('/signup', function (req, res, next) {
  user.signUp(req.body.email, req.body.password, (err, result) => {

  });
});

router.get('/login', funtion(req, res, next) {

});

router.post('/login', function (req, res, next)) {

});

module.exports = router;
