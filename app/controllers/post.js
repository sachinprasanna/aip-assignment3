/*
Controller for post routes
*/
const express = require('express');
const router  = express.Router();
const request = require('request');
const jwt     = require('jsonwebtoken');
const nl2br   = require('nl2br');
const config  = require('config/config');
const uri     = require('config/uri');

//declare _viewData variable to pass to view and initialize with uri variables
let _viewData = { uri: uri };
  
/** [GET] route for /post 
 * Display view which will list and search all posts using AJAX request
*/
router.get('/', function (req, res) {
  delete _viewData.success
  delete _viewData.error
  
  _viewData.apiUrl = config.apiUrl + uri.api.link.all_posts;
  _viewData.token  = req.session.token;
   return res.render('post_list', _viewData);
});

/** [GET] route for /post/create
 * Display view to show create post form fields
*/
router.get('/create', function (req, res) {
  //clear local variables
  delete _viewData.success
  delete _viewData.error
  _viewData.post = {
      "title"   : "",
      "content" : ""
    }
  
  //render view
  return res.render('post_editor', _viewData);
});

/** [POST] route for /post/create
 * Send entered post data to API to create a new post
*/
router.post('/create', function (req, res) {
  const userId  = req.session.user.id;
  let postParam = req.body;
  let data      = _viewData;
  delete data.error
  delete data.success

  //call API to create a new post
  request.post({
    url     : config.apiUrl + uri.api.link.create_post,
    form    : postParam,
    headers : {'Authorization': req.session.token},
    json    : true
  }, function (error, response, body) {
    //display error message
    if (body.status == 0) {
      data.error = body.response;
      data.post  = postParam;
      return res.render('post_editor', data);
    }

    //display success message
    _viewData.success = body.response;
    return res.render('post_editor', data);
  });
});

/** [GET] route for /post/edit/:id
 * @param - Post ID will be passed in url
 * Get relevant post's data
*/
router.get('/edit/:id', function (req, res) { 
  delete _viewData.error
  delete _viewData.success
  const postId = req.params.id;

  //Call API to get post's data for the passed post id 
  request.get({
    url     : config.apiUrl + uri.api.link.get_post + postId,
    headers : {'Authorization': req.session.token},
    json    : true
  }, function (error, response, body) {
    /** if post is not valid, redirect to home */
    if (body.status == 0) {
      return res.redirect('/');
    }

    /** if post is not valid, redirect to home */
    if(!body.response) return res.redirect('/');

    //render post data in view
    _viewData.post = body.response;
    return res.render('post_editor', _viewData);
  });
});

/** [POST] route for /post/edit/:id
 * @param - Post ID will be passed in url
 * Update relevant post's data
*/
router.post('/edit/:id', function (req, res) {
  delete _viewData.error
  delete _viewData.success
  const postId    = req.params.id;
  const userId    = req.session.user.id;
  let postParam = req.body;

  //Call API to update post's data for the passed post id
  request.put({
    url     : config.apiUrl + uri.api.link.edit_post + postId,
    form    : postParam, 
    headers : {'Authorization': req.session.token},
    json    : true
  }, function (error, response, body) {
    /** if post is not valid, redirect to home */
    if (body.status == 0) {
      _viewData.error = body.response;
      return res.render('post_editor', _viewData);
    }

    /** if post is not valid, redirect to home */
    if(!body.response) return res.redirect('/');
    
    //render success message as well as updated post
    _viewData.success = body.response;
    _viewData.post    = body.result;
    return res.render('post_editor', _viewData);
  });
});

/** [GET] route for /myposts
 * Display all posts of logged in user
*/
router.get('/myposts', function (req, res) {
  delete _viewData.error
  delete _viewData.success
  const userId = req.session.user.id;

  //call API to get all posts of logged in user
  request.get({
    url     : config.apiUrl + uri.api.link.user_post + userId,
    headers : {'Authorization': req.session.token},
    json    : true
  }, function (error, response, body) {
    if (body.status == 0) {
      return res.redirect('/');
    }

    //render posts to view
    _viewData.baseurl = config.apiUrl;
    _viewData.token = req.session.token;
    _viewData.posts = body.response;
     return res.render('my_post_list', _viewData);
  });
  
});

module.exports = router;