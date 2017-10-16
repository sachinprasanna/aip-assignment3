/*
Controller for login routes
*/
const express = require('express');
const router  = express.Router();
const request = require('request');
const config  = require('config/config');
const uri     = require('config/uri');

//declare _viewData variable to pass to view and initialize with uri variables
let _viewData = { uri: uri };

/** [GET] route for /login 
 * Display view to enter email and password
*/
router.get('/', function (req, res) {
  /** log user out */
  delete req.session.user;
  delete _viewData.success
  delete _viewData.error
  delete _viewData.email

  res.render('login', _viewData);
});

/** [POST] route for /login 
 * Send entered email and password to API for authentication
*/
router.post('/', function (req, res) {
  delete _viewData.success
  delete _viewData.error
  
  /** authenticate using api to maintain clean separation between layers */
  request.post({
    url : config.apiUrl + uri.api.link.login,
    form: req.body,
    json: true
  }, function (error, response, body) {

    //render error
    if (body.status == 0) {
      _viewData.error = body.response;
      _viewData.email = req.body.email;
      return res.render('login', _viewData);
    }

    //login success
    /** save JWT token in the session to make it available */
    req.session.token = body.response.token;
    req.session.user  = body.response.user;
    
    /** redirect to homepage */
    res.redirect('/');
  });
});

module.exports = router;