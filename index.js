require('rootpath')();
var config = require('config/config.json');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
//var expressJwt = require('express-jwt');
var expressValidator = require('express-validator');
var passport = require('passport');
require('config/passport')(passport); // pass passport for configuration

var app = express();
app.set('view engine', 'ejs');
app.set('views', [__dirname + '/app/views', __dirname + '/admin/views']);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


// api routes
app.use('/api/user', require('./api/controllers/user'));
// use Passport auth to secure the api. Only Logged users have access to posts
app.use('/api/post', passport.authenticate('jwt', { session: false }), require('./api/controllers/post'));

//app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

// routes
//app.use('/login', require('./controllers/login.controller'));
//app.use('/register', require('./controllers/register.controller'));
app.use('/', require('./router'));
//app.use('/api/users', require('./controllers/api/users.controller'));
//app.use('/admin', require('./admin/controllers/app.controller'));
//app.use('/', require('./admin/controllers/login'));
//app.use('/admin/account', require('./admin/controllers/account'));
//app.use('/admin/users', require('./admin/controllers/users'));
//app.use('/api/users', require('./controllers/api/users.controller'));

// make '/admin' default route
//app.get('/', function (req, res) {
//    //return res.redirect('/app');
//    res.send('hello');
//});

// start server
var server = app.listen(config.port, function () {
  console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});