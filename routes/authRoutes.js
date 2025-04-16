// authRoutes.js
const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login',
    successRedirect: '/protected'
  })
);

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;
