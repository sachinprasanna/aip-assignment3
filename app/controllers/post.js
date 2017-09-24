var express = require('express');
var router = express.Router();
var request = require('request');
var jwt = require('jsonwebtoken');
var config = require('config/config.json');
var lang = require('lang/en/text.json');
var uri = require('config/uri');

var _viewData = { lang: lang, uri: uri };
  
router.get('/', function (req, res) {
  var searchParam = '';
  if(req.query.q){
    searchParam = '?q=' + req.query.q;
  }
  request.get({
    url: config.apiUrl + '/post/all/' + searchParam,
    headers: {'Authorization': req.session.token},
    json: true
  }, function (error, response, body) {
    if (body.status == 0) {
      return res.redirect('/login');
    }

    _viewData.posts = body.response;
    _viewData.q = req.query.q;
     return res.render('post_list', _viewData);
  });
});

router.get('/create', function (req, res) {
  
  return res.render('post_editor', _viewData);
});

router.post('/create', function (req, res) {
  var userId = req.session.user.id;
  var postParam = req.body;
  var data = _viewData;

  delete data.error
  delete data.success
  
  request.post({
    url: config.apiUrl + uri.api.post_create,
    form: postParam,
    headers: {'Authorization': req.session.token},
    json: true
  }, function (error, response, body) {
    if (body.status == 0) {
      data.error = body.response;
      data.post = postParam;
      return res.render('post_editor', data);
    }

    _viewData.success = body.response;
    return res.render('post_editor', data);
  });
});

router.get('/myposts', function (req, res) {
  
  request.get({
    url: config.apiUrl + '/post/myposts',
    headers: {'Authorization': req.session.token},
    json: true
  }, function (error, response, body) {
    if (body.status == 0) {
      return res.redirect('/');
    }

    _viewData.posts = body.response;
     return res.render('my_post_list', _viewData);
  });
  
});

module.exports = router;