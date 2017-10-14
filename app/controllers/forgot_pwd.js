﻿var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config/config');
var uri = require('config/uri');

var _viewData = { uri: uri };

router.get('/', function (req, res) {
  // log user out
  delete req.session.user;

  // move success message into local variable so it only appears once (single read)
  _viewData.success = req.session.success;
  delete req.session.success;

  res.render('forgot_pwd', _viewData);
});

router.post('/', function (req, res) {
  // authenticate using api to maintain clean separation between layers
  request.post({
    url: config.apiUrl + uri.api.resetpwd,
    form: req.body,
    json: true
  }, function (error, response, body) {
    
      _viewData.success = body;
      res.render('forgot_pwd', _viewData);
  });
});

module.exports = router;