/*
Controller for register routes
*/
const express = require('express');
const router  = express.Router();
const request = require('request');
const config  = require('config/config');
const uri     = require('config/uri');
const i18n    = require("i18n");

//declare _viewData variable to pass to view and initialize with uri variables
let _viewData = { uri: uri };

/** [GET] route for /register 
 * Display view to enter firstname, lastname, email and password
*/
router.get('/', function (req, res) {
  /** log user out */
  delete req.session.token;
  clearSessionData();

  res.render('register', _viewData);
});

/** [POST] route for /register 
 * Send entered email and password to API for authentication
*/
router.post('/', function (req, res) {
  clearSessionData();
  
  /** authenticate using api to maintain clean separation between layers */
  request.post({
    url : config.apiUrl + uri.api.link.register,
    form: req.body,
    json: true
  }, function (error, response, body) {

    //render view with error message
    if (body.status == 0) {
      _viewData.error     = body.response;
      _viewData.lastName  = req.body.lastName;
      _viewData.firstName = req.body.firstName;
      _viewData.email     = req.body.email;
      return res.render('register', _viewData);
    }
    
    //render view with success message
    _viewData.success = i18n.__('register_successfully');
    return res.render('register', _viewData);
  });
});

/** @method clearSessionData
 * Function to clear all local session data used to display error or success
*/
function clearSessionData(){
  delete _viewData.success;
  delete _viewData.error;
  delete _viewData.lastName;
  delete _viewData.firstName;
  delete _viewData.email;
}
module.exports = router;