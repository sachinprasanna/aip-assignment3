const express = require('express');
const router  = express.Router();
const request = require('request');
const config  = require('config/config');
const uri     = require('config/uri');

let _viewData = { uri: uri };

router.get('/', function (req, res) {
  /** log user out */
  delete req.session.user;

  /** move success message into local variable so it only appears once (single read) */
  _viewData.success = req.session.success;
  delete req.session.success;

  res.render('login', _viewData);
});

router.post('/', function (req, res) {
  /** authenticate using api to maintain clean separation between layers */
  
  request.post({
    url : config.apiUrl + uri.api.link.login,
    form: req.body,
    json: true
  }, function (error, response, body) {

    if (body.status == 0) {
      _viewData.error = body.response;
      _viewData.email = req.body.email;
      return res.render('login', _viewData);
    }

    /** save JWT token in the session to make it available */
    req.session.token = body.response.token;
    req.session.user  = body.response.user;
    
    /** redirect to homepage */
    res.redirect('/');
  });
});

module.exports = router;