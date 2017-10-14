/*
Post controller for
  - Creating new post

*/

/* imports for express router, database for users and passport */
const express = require("express");
const router = express.Router();
const postService = require("api/models/post");
const uri = require('config/uri');
const i18n = require("i18n");

/* routes for post api controller */
router.post(uri.api.route.post_create, createPost);
router.get(uri.api.route.post_detail + '/:id', getUserPostById);
router.post(uri.api.route.post_edit + '/:id', updateUserPostById);
router.get(uri.api.route.post_user + '/:id', getUserPosts);
router.get(uri.api.route.all_posts, getAllPosts);

// Export default for router
module.exports = router;


/*
@method createPost

create a new post

@param req - request from frontend
@param res - result to frontend
@return    - null

*/
function createPost(req, res) {
  let userId = req.user._id;

  // validate the input
  req.checkBody("title", i18n.__('title_required')).notEmpty();
  req.checkBody("content", i18n.__('content_required')).notEmpty();

  // check the validation object for errors
  req.getValidationResult().then(function(errors) {
    //throw error, if any
    if (!errors.isEmpty()) {
      let errorArray = errors.array();
      let msg = '';
      for (i = 0; i < errorArray.length; i++) { 
          msg += errorArray[i].msg + ".";
      }
      res.send({ status: 0, response: msg });
      //util.inspect(errors.array())
      return;
    }

    let postParam = req.body;
    postParam.userId = userId;
  
    //save post in DB
    postService
      .create(postParam)
      .then(function() {
        // post added in DB
        res.send({ status: 1, response: i18n.__('post_added') });
      })
      .catch(function(err) {
        res.send({ status: 0, response: err });
      });
  });
}

function getUserPostById(req, res) {
  let postId = req.params.id;
  let userId = req.user._id;
  postService
    .getUserPost(postId, userId)
    .then(function(posts) {
      posts.toArray(function(err, postList) {
        res.send({ status: 1, response: postList[0] });
      });
    })
    .catch(function(err) {
      // return error
      res.send({ status: 0, response: err });
    });
}

function updateUserPostById(req, res) {
  let postId = req.params.id;
  let userId = req.user._id;

  // validate the input
  req.checkBody("title", i18n.__('title_required')).notEmpty();
  req.checkBody("content", i18n.__('content_required')).notEmpty();

  // check the validation object for errors
  req.getValidationResult().then(function(errors) {
    //throw error, if any
    if (!errors.isEmpty()) {
      //util.inspect(errors.array())
      let errorArray = errors.array();
      let msg = '';
      for (i = 0; i < errorArray.length; i++) { 
          msg += errorArray[i].msg + ".";
      }
      res.send({ status: 0, response: msg });
      return;
    }

    let postParam = req.body;
    
    //save post in DB
    postService
      .update(postId, userId, postParam)
      .then(function(post) {
        // post added in DB
        res.send({ status: 1, response: i18n.__('post_updated'), result: post });
      })
      .catch(function(err) {
        res.send({ status: 0, response: err });
      });
  });
}

function getUserPosts(req, res) {
  let userId = req.params.id;
  postService
    .getUserPosts(userId)
    .then(function(posts) {
      posts.toArray(function(err, postList) {
        res.send({ status: 1, response: postList });
      });
    })
    .catch(function(err) {
      // return error
      res.send({ status: 0, response: err });
    });
}

function getAllPosts(req, res) {
  postService
    .getAllPosts(req.query.q)
    .then(function(posts) {
      res.send({ status: 1, response: posts });
    })
    .catch(function(err) {
      // return error
      res.send({ status: 0, response: err });
    });
}
