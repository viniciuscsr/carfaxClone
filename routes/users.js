const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// register form

router.get('/register', userController.getSignup);

// register post route

router.post('/register', userController.postSignup);

// login

router.get('/login', userController.getLogin);

router.post('/login', userController.postLogin);

// logout

router.get('/logout', userController.logout);

module.exports = router;
