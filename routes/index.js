const express = require('express');

const passport = require('passport');
const User = require('../models/user');

const router = express.Router();


// Root Route
router.get('/', (req, res) => {
  res.render('landing');
});

// Register Form Route
router.get('/register', (req, res) => {
  res.render('register');
});

// Register Logic Route
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Create a new user using username from the form
  const newUser = new User({ username });

  // Register new user using username and password sent from the form
  User.register(newUser, password, (err, user) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/register');
    }

    // After creating the user, authenticate using 'local' strategy
    passport.authenticate('local')(req, res, () => {
      req.flash('success', `${user.username} is now registered`);
      res.redirect('/campgrounds');
    });
  });
});

// Login Form Route
router.get('/login', (req, res) => {
  res.render('login');
});

// Login Authenticate Route
router.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login',
}), (req, res) => {});


// Logout Route
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged you out!!');
  res.redirect('/campgrounds');
});

module.exports = router;
