const express = require('express');
const router  = express.Router();
const request = require('request');
const jwt     = require('jsonwebtoken');
const nl2br   = require('nl2br');
const config  = require('config/config');
const uri     = require('config/uri');

let _viewData = { uri: uri };
  
router.get('/', function (req, res) {
  delete _viewData.success
  delete _viewData.error
  let searchParam = '';
  if(req.query.q){
    searchParam = '?q=' + req.query.q;
  }
  request.get({
    url     : config.apiUrl + uri.api.link.all_posts + searchParam,
    headers : {'Authorization': req.session.token},
    json    : true
  }, function (error, response, body) {
    if (body.status == 0) {
      return res.redirect('/login');
    }

    _viewData.posts         = body.response;
    _viewData.posts.content = nl2br(body.response.content);
    _viewData.q             = req.query.q;
     return res.render('post_list', _viewData);
  });
});

router.get('/create', function (req, res) {
  delete _viewData.success
  delete _viewData.error
  _viewData.post = {
      "title"   : "",
      "content" : ""
    }
  return res.render('post_editor', _viewData);
});

router.post('/create', function (req, res) {
  let userId    = req.session.user.id;
  let postParam = req.body;
  let data      = _viewData;
  delete data.error
  delete data.success

  request.post({
    url     : config.apiUrl + uri.api.link.create_post,
    form    : postParam,
    headers : {'Authorization': req.session.token},
    json    : true
  }, function (error, response, body) {
    if (body.status == 0) {
      data.error = body.response;
      data.post  = postParam;
      return res.render('post_editor', data);
    }

    _viewData.success = body.response;
    return res.render('post_editor', data);
  });
});

router.get('/edit/:id', function (req, res) { 
  delete _viewData.error
  delete _viewData.success
  let postId = req.params.id;

  request.get({
    url     : config.apiUrl + uri.api.link.get_post + postId,
    headers : {'Authorization': req.session.token},
    json    : true
  }, function (error, response, body) {
    if (body.status == 0) {
      return res.redirect('/');
    }

    /** if not post exists, redirect to home */
    if(!body.response) return res.redirect('/');

    _viewData.post = body.response;
    return res.render('post_editor', _viewData);
  });
});

router.post('/edit/:id', function (req, res) {
  delete _viewData.error
  delete _viewData.success
  let postId    = req.params.id;
  let userId    = req.session.user.id;
  let postParam = req.body;

  request.post({
    url     : config.apiUrl + uri.api.link.edit_post + postId,
    form    : postParam, 
    headers : {'Authorization': req.session.token},
    json    : true
  }, function (error, response, body) {
    if (body.status == 0) {
      _viewData.error = body.response;
      return res.render('post_editor', _viewData);
    }

    _viewData.success = body.response;
    _viewData.post    = body.result;
    return res.render('post_editor', _viewData);
  });
});

router.get('/myposts', function (req, res) {
  delete _viewData.error
  delete _viewData.success
  let userId = req.session.user.id;

  request.get({
    url     : config.apiUrl + uri.api.link.user_post + userId,
    headers : {'Authorization': req.session.token},
    json    : true
  }, function (error, response, body) {
    if (body.status == 0) {
      return res.redirect('/');
    }

    _viewData.posts = body.response;
     return res.render('my_post_list', _viewData);
  });
  
});

module.exports = router;