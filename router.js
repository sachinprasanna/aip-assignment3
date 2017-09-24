var express = require('express');
var router = express.Router();
var uri = require('config/uri');

var app = express();
app.set('views', __dirname + '/app/views');

// use session auth to secure the angular app files
router.use('/', function (req, res, next) {
  if ((req.path !== uri.app.login && req.path !== uri.app.register) && !req.session.token) {
    return res.redirect(uri.app.login);
  }

  next();
});

router.use(uri.app.login, require('./app/controllers/login'));
router.use(uri.app.register, require('./app/controllers/register'));
router.use(uri.app.my_account, require('./app/controllers/account'));
router.use('/', require('./app/controllers/post'));
router.use(uri.app.post, require('./app/controllers/post'));


// serve angular app files from the '/app' route
//router.use('/', express.static('app'));

module.exports = router;