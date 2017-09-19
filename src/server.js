require('rootpath')();
//const config = require('../config');
import config from 'config'
import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import expressValidator from 'express-validator'
import passport from 'passport'

require('./config/passport')(passport); // pass passport to configuration

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(session({ secret: con, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// api routes
app.use('/api/user', require('api/controllers/users.controller'));
app.use('/admin', require('admin/app.controller'));

// Homepage
app.get('/', function(req, res) {
    res.send('Welcome User!');
});

// start server
var server = app.listen(config.server.port, function() {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});