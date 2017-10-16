require('rootpath')();
const express           = require('express');
const bodyParser        = require('body-parser');
const passport          = require('passport');
const expressValidator  = require('express-validator');
const session           = require('express-session');
const path              = require('path');
const favicon           = require('serve-favicon');
const config            = require('config/config');
const port              = process.env.PORT || config.port;
const i18n              = require("i18n");
const app               = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(session({ secret: config.session_secret, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session()); /** persistent login sessions */
app.use(i18n.init);

/** set default view engine */
app.set('view engine', 'ejs');
app.set('views', __dirname + '/app/views');

/** set default language */
i18n.configure({
  locales   :['en'],
  directory : __dirname + '/lang'
});
i18n.setLocale(config.lang);

/** add static files */
app.use(express.static(path.join(__dirname, '/public')));
app.use(favicon(__dirname + '/public/favicon.ico'));

/** api routes */
app.use('/api', require('./api/router'));

/** app routes */
app.use('/', require('./app/router'));

/** 404 error handling of pages */
app.use(function(req, res, next){
  res.status(404);

  // display 404 message
  res.type('html').send( i18n.__('404_message') );
});

/** start server */
const server = app.listen(port, function () {
  console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});