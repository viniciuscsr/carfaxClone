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

module.exports = router;
