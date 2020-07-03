const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// HOME PAGE

router.get('/', function (req, res) {
  res.render('home');
});

// ABOUT PAGE

router.get('/about', function (req, res) {
  res.render('about');
});

// AUTH ROUTES

// register form

router.get('/register', function (req, res) {
  res.render('register');
});

// register post route

router.post('/register', function (req, res) {
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
        req.flash('success', 'Welcome to 9K ' + user.firstName);
        res.redirect('/cars');
      });
    });
  }
});

// login

router.get('/login', function (req, res) {
  res.render('login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/cars',
    failureRedirect: '/login',
  }),
  function (req, res) {}
);

// logout

router.get('/logout', function (req, res) {
  req.logout();
  req.flash('success', 'Logged you out!');
  res.redirect('/cars');
});

module.exports = router;
