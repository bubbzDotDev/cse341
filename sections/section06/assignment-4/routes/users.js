const express = require('express');

const router = express.Router();

const userData = require('./home');

router.get('/users', (req, res, next) => {
  res.render('users', {
    pageTitle: 'Users',
    userList: userData.users,
  });
});

module.exports = router;
