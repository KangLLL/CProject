var express = require('express');
var router = express.Router();

const user = require('../modules/user');
const { check, validationResult } = require('express-validator/check')

const validate = [check('email')
  .isEmail()
  .withMessage('Please provide a valid email address'),
check('password')
  .isLength({ min: 5 })
  .withMessage('Please provide password at least 5 chars long')];

/* GET users listing. */
router.get('/signup', function (req, res, next) {
  if (req.originalUrl.slice(-1) != '/') return res.redirect(req.originalUrl + '/');
  res.render('signup', { title: 'Sign Up' });
});

router.post('/signup', validate, function (req, res, next) {
  var errors = validationResult(req);
  if (errors.isEmpty()) {
    user.signUp(req.body.email, req.body.password, (err, result) => {
      if (err) return next(err);
      if (result == null) return res.render('signup', { title: 'Sign Up', email: req.body.email, password: req.body.password, errs: [{ msg: 'The email was used by other user' }] });
      res.redirect('/');
    });
  }
  else {
    res.render('signup', { title: 'Sign Up', email: req.body.email, password: req.body.password, errs: errors.array() });
  }
});

// router.get('/login', funtion(req, res, next) {

// });

// router.post('/login', function (req, res, next)) {

// });

module.exports = router;
