const express = require('express');
const router  = express.Router();
const config  = require('config/config');
const uri     = require('config/uri');

// use session auth to secure the angular app files
router.use('/', function (req, res, next) {
  if ((req.path !== uri.app.login && req.path !== uri.app.register && req.path !== uri.app.forgotpwd) && !req.session.token) {
    return res.redirect(uri.app.login);
  }

  next();
});

router.use(uri.app.login, require('app/controllers/login'));
router.use(uri.app.register, require('app/controllers/register'));
router.use(uri.app.forgotpwd, require('app/controllers/forgot_pwd'));
router.use(uri.app.my_account, require('app/controllers/account'));
router.use('/', require('app/controllers/post'));
router.use(uri.app.post, require('app/controllers/post'));

module.exports = router;