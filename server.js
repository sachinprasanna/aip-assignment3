require('rootpath')();
var config = require('./config/config.json');
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var passport = require('passport');
var port = process.env.PORT || 5000;

require('./config/passport')(passport); // pass passport for configuration

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// api routes
app.use('/api/user', require('./controllers/api/users.controller'));

// Homepage
app.get('/', function (req, res) {
    res.send('Welcome User!');
});

// start server
var server = app.listen(port, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});