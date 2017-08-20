require('rootpath')();
var config = require('./config/config.json');
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
//var expressJwt = require('express-jwt');
var passport = require('passport');

require('./config/passport')(passport); // pass passport for configuration

//app.set('view engine', 'ejs');
//app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// secure the api by using JWT auth
//app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/user/authenticate', '/api/user/register'] }));
//app.use('/api', passport.authenticate('jwt', { session: false }).unless({ path: ['/api/user/authenticate', '/api/user/register'] }));

// admin routes
//app.use('/admin', require('./controllers/admin.controller'));
app.use('/api/user', require('./controllers/api/users.controller'));

// Homepage
app.get('/', function (req, res) {
    res.send('Welcome User!');
});

// start server
var server = app.listen(5000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});