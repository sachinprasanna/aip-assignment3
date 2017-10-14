var express = require('express');
var router = express.Router();
var request = require('request');
var jwt = require('jsonwebtoken');
var config = require('config/config');
var lang = require('lang/en/text.json');
var uri = require('config/uri');

var _viewData = { lang: lang, uri: uri };

router.get('/', function (req, res) {
  var data = _viewData;
  data.user = req.session.user;
  delete data.success
  delete data.error
  return res.render('account', data);
});

router.post('/', function (req, res) {
  var data = _viewData;
  var userId = req.session.user.id;
  request.put({
    url: config.apiUrl + uri.api.user_account + userId,
    form: req.body,
    headers: {'Authorization': req.session.token},
    json: true
  }, function (error, response, body) {
    if (body.status == 0) {
      data.error = body.response;
      data.user = req.session.user;
      return res.render('account', data);
    }

    req.session.user  = body.user;
    data.user = req.session.user;
    data.user.id = userId;
    data.success = body.response;
    
    // redirect to returnUrl
    res.render('account', data);
  });
});

module.exports = router;