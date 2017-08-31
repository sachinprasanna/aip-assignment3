require('rootpath')();
var config = require('./config/config.json');
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var passport = require('passport');
var port = process.env.PORT || 5000;

mongoose = require('mongoose'),
    Item = require('./api/models/itemsListModel'), //created model loading here
    // mongoose instance connection url connection
    mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/itemDB');


require('./config/passport')(passport); // pass passport for configuration
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// api routes
app.use('/api/user', require('./api/controllers/users.controller'));

var routes = require('./api/routes/itemsListRoutes'); //importing route
routes(app); //register the route


// Homepage
app.get('/', function(req, res) {
    res.send('Welcome User!');
});

// start server
var server = app.listen(port, function() {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});