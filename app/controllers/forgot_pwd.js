const express = require('express');
const router  = express.Router();
const request = require('request');
const config  = require('config/config');
const uri     = require('config/uri');

let _viewData = { uri: uri };

router.get('/', function (req, res) {
  delete _viewData.success
  delete _viewData.error

  res.render('forgot_pwd', _viewData);
});

router.post('/', function (req, res) {
  delete _viewData.success
  delete _viewData.error
  delete _viewData.email
  
  /** authenticate using api to maintain clean separation between layers */
  request.post({
    url : config.apiUrl + uri.api.link.resetpwd,
    form: req.body,
    json: true
  }, function (error, response, body) {
      if(typeof body === 'object' && body.status == 0){
        _viewData.error = body.response;
        _viewData.email = req.body.email;
        return res.render('forgot_pwd', _viewData);
      }
      
      _viewData.success = body;
      return res.render('forgot_pwd', _viewData);
  });
});

module.exports = router;