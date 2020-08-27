const express = require('express');

const router = express.Router();
const createError = require('http-errors');
const { User } = require('../db');
const passport = require('../auth');

const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) return next(createError.Unauthorized('Login failed'));

  return next();
};

/* GET users listing. */
router.get('/getAll', isAuthenticated, (req, res, next) => {
  User.find((err, users) => {
    if (err) return next(err);
    return res.json(users);
  });
});

// POST add user
router.post('/register', async ({
  body,
}, res, next) => {
  const newUser = new User(body);
  await newUser.save((err) => {
    if (err) return next(err);
    return res.redirect('login.html');
  });
});

// POST login to existing user
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect('getAll');
});

module.exports = router;
