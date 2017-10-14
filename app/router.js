const express = require('express');
const router  = express.Router();
const session = require('express-session');
const config  = require('config/config');
const uri     = require('config/uri');

const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/app/views');
app.use(session({ secret: config.session_secret, resave: false, saveUninitialized: true }));

// use session auth to secure the angular app files
router.use('/', function (req, res, next) {
  if ((req.path !== uri.app.route.login && req.path !== uri.app.route.register && req.path !== uri.app.route.forgotpwd) && !req.session.token) {
    return res.redirect(uri.app.route.login);
  }

  next();
});

router.use(uri.app.route.login, require('app/controllers/login'));
//router.use(uri.app.register, require('app/controllers/register'));
//router.use(uri.app.forgotpwd, require('app/controllers/forgot_pwd'));
//router.use(uri.app.my_account, require('app/controllers/account'));
//router.use('/', require('app/controllers/post'));
//router.use(uri.app.post, require('app/controllers/post'));

module.exports = router;