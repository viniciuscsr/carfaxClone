const userController = {};
const User = require('../models/user');
const passport = require('passport');

userController.getLogin = function (req, res) {
  res.render('login');
};

userController.postLogin = passport.authenticate('local', {
  successRedirect: '/cars',
  failureRedirect: '/login',
});

userController.getSignup = function (req, res) {
  res.render('register');
};

userController.postSignup = function (req, res) {
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  });
  if (req.body.password !== req.body.confirmPassword) {
    req.flash('error', 'Password must match');
    return res.redirect('./register');
  } else {
    User.register(newUser, req.body.password, function (err, user) {
      if (err) {
        console.log(err);
        req.flash('error', err.message);
        return res.redirect('./register');
      }
      passport.authenticate('local')(req, res, function () {
        req.flash('success', 'Welcome to Carfax Clone ' + user.firstName);
        res.redirect('/cars');
      });
    });
  }
};

userController.logout = function (req, res) {
  req.logout();
  req.flash('success', 'Logged out');
  res.redirect('/cars');
};

module.exports = userController;
