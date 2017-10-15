const express = require('express');
const router  = express.Router();
const request = require('request');
const config  = require('config/config');
const uri     = require('config/uri');

let _viewData = { uri: uri };

router.get('/', function (req, res) {
  /** log user out */
  delete req.session.user;
  delete _viewData.success
  delete _viewData.error

  /** move success message into local variable so it only appears once (single read) */
  _viewData.success = req.session.success;

  res.render('forgot_pwd', _viewData);
});

router.post('/', function (req, res) {
  delete _viewData.success
  delete _viewData.error
  
  /** authenticate using api to maintain clean separation between layers */
  request.post({
    url : config.apiUrl + uri.api.link.resetpwd,
    form: req.body,
    json: true
  }, function (error, response, body) {
    
      _viewData.success = body;
      res.render('forgot_pwd', _viewData);
  });
});

module.exports = router;