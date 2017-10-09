var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config/config.json');
var lang = require('lang/en/text.json');
var uri = require('config/uri');

var _viewData = { lang: lang, uri: uri };

router.get('/', function (req, res) {console.log('hello');
  // log user out
  delete req.session.user;

  // move success message into local variable so it only appears once (single read)
  _viewData.success = req.session.success;
  delete req.session.success;

  res.render('forgot_pwd', _viewData);
});

router.post('/', function (req, res) { console.log(config.apiUrl + uri.api.resetpwd);
  // authenticate using api to maintain clean separation between layers
  request.post({
    url: "http://localhost:8000/api/user/resetpwd/",
    form: req.body,
    json: true
  }, function (error, response, body) {
    
console.log(error);
res.render('forgot_pwd', _viewData);
    //if (body.status == 0) {
    //  _viewData.error = body.response;
    //  _viewData.email = req.body.email;
    //  return res.render('forgot_pwd', _viewData);
    //}

    // save JWT token in the session to make it available
    //req.session.token = body.response.token;
    //req.session.user = body.response.user;
    
    // redirect to homepage
  //  res.redirect('/');
  });
});

module.exports = router;