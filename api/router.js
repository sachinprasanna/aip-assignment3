const express = require('express');
const passport = require('passport');
//var expressValidator = require('express-validator');
const session = require('express-session');
const config = require('config/config');
const uri = require('config/uri');
require('config/passport')(passport); // pass passport for configuration

var app = express();
var router = express.Router();

//app.use(expressValidator());
app.use(session({ secret: config.session_secret, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//not all user requests require passport authentication, therefore validation applied in controller instead
router.use(uri.api.route.user, require('api/controllers/user'));
// use Passport auth to secure the api. Only Logged users have access to posts
router.use(uri.api.route.post, passport.authenticate('jwt', { session: false }), require('api/controllers/post'));

module.exports = router;