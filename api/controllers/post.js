/*
Post controller for
  - Creating new post

*/

/* imports for express router, database for users and passport */
var express = require("express");
var router = express.Router();
var postService = require("api/models/post");
var passport = require("passport");

/* routes for post api controller */
router.post('/create/', createPost);
router.get('/myposts/', getUserPosts);
router.get('/all/', getAllPosts);

//router.put('/myaccount/:_id', passport.authenticate('jwt', { session: false }), updateCurrentUser);
//router.delete('/myaccount/:_id', passport.authenticate('jwt', { session: false }), deleteCurrentUser);

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
      //util.inspect(errors.array())
      res.send({ status: 0, response: errors.array() });
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

function getUserPosts(req, res) {
  var userId = req.user._id;
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

/*
@method updateUser

update user's info

@param req - request from frontend
@param res - result to frontend
@return    - null

*/
//function updateCurrentUser(req, res) {
//  var userId = req.params._id;
//  if (req.user._id != userId) {
//    // can only update own account
//    return res.send({ status: 0, response: "You can only update your own account." });
//  }
//
//  // validate the input
//  req.checkBody("firstName", "First Name is required").notEmpty();
//  req.checkBody("lastName", "Last Name is required").notEmpty();
//  req.checkBody("email", "Email is required").notEmpty();
//  req.checkBody("email", "Email does not appear to be valid").isEmail();
//
//  // check the validation object for errors
//  req.getValidationResult().then(function(errors) {
//    //throw error, if any
//    if (!errors.isEmpty()) {
//      //util.inspect(errors.array())
//      res.send({ status: 0, response: errors.array() });
//      return;
//    }
//
//    //update user in DB
//    userService
//      .update(userId, req.body)
//      .then(function() {
//        // user account updated successfully
//        res.send({ status: 1, response: "Account updated successfully." , user: req.body});
//      })
//      .catch(function(err) {
//        // catch error
//        res.send({ status: 0, response: err });
//      });
//  });
//}
//
///*
//@method deleteUser
//
//delete user's account
//
//@param req - request from frontend
//@param res - result to frontend
//@return    - null
//
//*/
//function deleteCurrentUser(req, res) {
//  var userId = req.params._id;
//  if (req.user._id != userId) {
//    // can only delete own account
//    res.send({ status: 0, response: "You can only delete your own account" });
//  }
//
//  userService
//    .delete(userId)
//    .then(function() {
//      // deletion successful
//      res.send({ status: 1, response: "Account deleted successfully." });
//    })
//    .catch(function(err) {
//      res.send({ status: 0, response: err });
//    });
//}
