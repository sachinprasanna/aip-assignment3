const express = require('express');
const router  = express.Router();
const config  = require('config/config');
const uri     = require('config/uri');

/** use session auth to secure the angular app files */
router.use('/', function (req, res, next) {
  if ((req.path !== uri.app.link.login && req.path !== uri.app.link.register && req.path !== uri.app.link.forgotpwd) && !req.session.token) {
    return res.redirect(uri.app.link.login);
  }

  next();
});

router.use(uri.app.link.login,      require('app/controllers/login'));
router.use(uri.app.link.register,   require('app/controllers/register'));
router.use(uri.app.link.forgotpwd,  require('app/controllers/forgot_pwd'));
router.use(uri.app.link.my_account, require('app/controllers/account'));
router.use('/',                     require('app/controllers/post'));
router.use(uri.app.link.post,       require('app/controllers/post'));

module.exports = router;