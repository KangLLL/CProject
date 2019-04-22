var express = require('express');
var router = express.Router();

const user = require('../modules/user');
const { check, validationResult } = require('express-validator/check')

const signupValidate = [
  check('email')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  check('password')
    .isLength({ min: 5 })
    .withMessage('Please provide password at least 5 chars long')
];

const loginValidate = [
  check('email')
    .not()
    .isEmpty()
    .withMessage('Please provide login email'),
  check('password')
    .not()
    .isEmpty()
    .withMessage('Please provide login password')
];

/* Register User */
router.get('/signup', function (req, res, next) {
  if (req.originalUrl.slice(-1) != '/') return res.redirect(req.originalUrl + '/');
  res.render('signup', { title: 'Sign Up' });
});

router.post('/signup', signupValidate, function (req, res, next) {
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


/* Login User */
router.get('/login', function (req, res, next) {
  if (req.originalUrl.slice(-1) != '/') return res.redirect(req.originalUrl + '/');
  res.render('login', { title: 'Login' });
});

router.post('/login', loginValidate, function (req, res, next) {
  var errors = validationResult(req);
  if (errors.isEmpty()) {
    user.login(req.body.email, req.body.password, (err, result) => {
      if (err) return next(err);
      if (result == null) return res.render('login', { title: 'Login', email: req.body.email, password: req.body.password, errs: [{ msg: 'The email was not registered yet' }] });
      if (!result) return res.render('login', { title: 'Login', email: req.body.email, password: req.body.password, errs: [{ msg: 'The password is incorrect' }] });
      res.redirect('/');
    });
  }
  else {
    res.render('login', { title: 'Login', email: req.body.email, password: req.body.password, errs: errors.array() });
  }
});

module.exports = router;
