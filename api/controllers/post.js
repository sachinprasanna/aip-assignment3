/*
Post controller for
  - Creating new post

*/

/* imports for express router, database for users and passport */
const express = require("express");
const router = express.Router();
const postService = require("api/models/post");
const uri = require('config/uri');

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
  var userId = req.user._id;

  // validate the input
  req.checkBody("title", "Title is required").notEmpty();
  req.checkBody("content", "Post Content is required").notEmpty();

  // check the validation object for errors
  req.getValidationResult().then(function(errors) {
    //throw error, if any
    if (!errors.isEmpty()) {
      var errorArray = errors.array();
      var msg = '';
      for (i = 0; i < errorArray.length; i++) { 
          msg += errorArray[i].msg + ".";
      }
      res.send({ status: 0, response: msg });
      //util.inspect(errors.array())
      return;
    }

    var postParam = req.body;
    postParam.userId = userId;
  
    //save post in DB
    postService
      .create(postParam)
      .then(function() {
        // post added in DB
        res.send({ status: 1, response: "Post added successfully." });
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
  req.checkBody("title", "Title is required").notEmpty();
  req.checkBody("content", "Post Content is required").notEmpty();

  // check the validation object for errors
  req.getValidationResult().then(function(errors) {
    //throw error, if any
    if (!errors.isEmpty()) {
      //util.inspect(errors.array())
      var errorArray = errors.array();
      var msg = '';
      for (i = 0; i < errorArray.length; i++) { 
          msg += errorArray[i].msg + ".";
      }
      res.send({ status: 0, response: msg });
      return;
    }

    var postParam = req.body;
    
    //save post in DB
    postService
      .update(postId, userId, postParam)
      .then(function(post) {
        // post added in DB
        res.send({ status: 1, response: "Post updated successfully.", result: post });
      })
      .catch(function(err) {
        res.send({ status: 0, response: err });
      });
  });
}

function getUserPosts(req, res) {
  var userId = req.params.id;
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
