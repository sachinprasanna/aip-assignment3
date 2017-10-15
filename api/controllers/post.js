/*
Post controller for
  - Creating new post
  - Display post
  - Update post
  - Creating new post
  - Get all user posts
  - Get all posts
  - Delete post
*/

/* imports for express router, database for posts and passport */
const express     = require("express");
const router      = express.Router();
const postService = require("api/models/post");
const uri         = require('config/uri');
const i18n        = require("i18n");

/* routes for post api controller */
router.post(uri.api.route.post_create,          createPost);
router.get(uri.api.route.post_detail + '/:id',  getUserPostById);
router.put(uri.api.route.post_edit  + '/:id',   updateUserPostById);
router.get(uri.api.route.post_user   + '/:id',  getUserPosts);
router.get(uri.api.route.all_posts,             getAllPosts);
router.delete('/:id',                           deleteUserPosts);

// Export default for router
module.exports = router;


/*
@method createPost

create a new post

@param req - request from frontend
@param res - result to frontend
@return    - status (0,1), error or success message

*/
function createPost(req, res) {
  const userId = req.user._id;

  // validate the input
  req.checkBody("title",    i18n.__('title_required')).notEmpty();
  req.checkBody("content",  i18n.__('content_required')).notEmpty();

  // check the validation object for errors
  req.getValidationResult().then(function(errors) {
    //throw error, if any
    if (!errors.isEmpty()) {
      let errorArray  = errors.array();
      let msg         = '';
      for (i = 0; i < errorArray.length; i++) { 
          msg         += errorArray[i].msg + ".";
      }
      res.send({ status: 0, response: msg });
      return;
    }

    let postParam     = req.body;
    postParam.userId  = userId;
  
    //save post in DB
    postService
      .create(postParam)
      .then( function() {
        // post added in DB
        return res.send({ status: 1, response: i18n.__('post_added') });
      })
      .catch( function(err) {
        return res.send({ status: 0, response: err });
      });
  });
}

/*
@method getUserPostById

get post detail only for owner

@param req - request from frontend
@param res - result to frontend
@return    - status (0,1), error message or post data

*/
function getUserPostById(req, res) {
  const postId = req.params.id;
  const userId = req.user._id;

  //get post detail only for owner 
  postService
    .getUserPost(postId, userId)
    .then( function(posts) {
      posts.toArray( function(err, postList) {
        return res.send({ status: 1, response: postList[0] });
      });
    })
    .catch( function(err) {
      // return error
      return res.send({ status: 0, response: err });
    });
}

/*
@method updateUserPostById

update post detail only by owner

@param req - request from frontend
@param res - result to frontend
@return    - status (0,1), error message or post data

*/
function updateUserPostById(req, res) {
  const postId = req.params.id;
  const userId = req.user._id;

  // validate the input
  req.checkBody("title",    i18n.__('title_required')).notEmpty();
  req.checkBody("content",  i18n.__('content_required')).notEmpty();

  // check the validation object for errors
  req.getValidationResult().then( function(errors) {
    //throw error, if any
    if (!errors.isEmpty()) {
      let errorArray  = errors.array();
      let msg         = '';
      for (i = 0; i < errorArray.length; i++) { 
          msg         += errorArray[i].msg + ".";
      }
      res.send({ status: 0, response: msg });
      return;
    }

    let postParam     = req.body;
    
    //save post in DB
    postService
      .update(postId, userId, postParam)
      .then( function(post) {
        // post added in DB
        return res.send({ status: 1, response: i18n.__('post_updated'), result: post });
      })
      .catch( function(err) {
        return res.send({ status: 0, response: err });
      });
  });
}

/*
@method getUserPosts

get all user's posts

@param req - request from frontend
@param res - result to frontend
@return    - status (0,1), error message or posts

*/
function getUserPosts(req, res) {
  const userId = req.params.id;

  // get user's posts from DB
  postService
    .getUserPosts(userId)
    .then( function(posts) {
      posts.toArray( function(err, postList) {
        return res.send({ status: 1, response: postList });
      });
    })
    .catch( function(err) {
      // return error
      return res.send({ status: 0, response: err });
    });
}

/*
@method getAllPosts

get all posts

@param req - request from frontend
@param res - result to frontend
@return    - status (0,1), error message or posts

*/
function getAllPosts(req, res) {

  //get all posts from DB
  postService
    .getAllPosts(req.query.q)
    .then( function(posts) {
      return res.send({ status: 1, response: posts });
    })
    .catch( function(err) {
      // return error
      return res.send({ status: 0, response: err });
    });
}

/*
@method deleteUserPosts

delete post only by owner

@param req - request from frontend
@param res - result to frontend
@return    - status (0,1), error message

*/
function deleteUserPosts(req, res) {
  const postId = req.params.id;
  const userId = req.user._id;

  postService
    .delete(postId, userId)
    .then( function() {
      // deletion successful
      return res.send({ status: 1 });
    })
    .catch( function(err) {
      return res.send({ status: 0, response: err });
    });
}