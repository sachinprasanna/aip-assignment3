const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config/config');
const uri = require('config/uri');
const i18n = require("i18n");

let _viewData = { uri: uri };

router.get('/', function (req, res) {
  // log user out
  delete req.session.token;

  // move success message into local variable so it only appears once (single read)
  _viewData.success = req.session.success;
  delete req.session.success;

  res.render('register', _viewData);
});

router.post('/', function (req, res) {
  // authenticate using api to maintain clean separation between layers
  request.post({
    url: config.apiUrl + uri.api.register,
    form: req.body,
    json: true
  }, function (error, response, body) {

    if (body.status == 0) {
      _viewData.error = body.response;
      _viewData.lastName = req.body.lastName;
      _viewData.firstName = req.body.firstName;
      _viewData.email = req.body.email;
      return res.render('register', _viewData);
    }

    // save JWT token in the session to make it available
    req.session.token = body.response;

    // return success message
    _viewData.success = i18n.__('register_successfully');
    return res.render('register', _viewData);
  });
});

module.exports = router;