/*
Controller for forgot password routes
*/
const express = require('express');
const router  = express.Router();
const request = require('request');
const config  = require('config/config');
const uri     = require('config/uri');

//declare _viewData variable to pass to view and initialize with uri variables
let _viewData = { uri: uri };

/** [GET] route for /forgotpwd 
 * Display view to enter email
*/
router.get('/', function (req, res) {
  /** log user out */
  delete req.session.token;
  delete _viewData.success
  delete _viewData.error

  res.render('forgot_pwd', _viewData);
});

/** [POST] route for /forgotpwd 
 * Send email input to API for resetting password and sending it via email
*/
router.post('/', function (req, res) {
  delete _viewData.success
  delete _viewData.error
  delete _viewData.email
  
  /** call API to maintain clean separation between layers */
  request.post({
    url : config.apiUrl + uri.api.link.resetpwd,
    form: req.body,
    json: true
  }, function (error, response, body) {
      if(typeof body === 'object' && body.status == 0){
        _viewData.error = body.response;
        _viewData.email = req.body.email;

        //render error message
        return res.render('forgot_pwd', _viewData);
      }
      
      //render success message
      _viewData.success = body;
      return res.render('forgot_pwd', _viewData);
  });
});

module.exports = router;