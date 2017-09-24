/*
User controller for
  - Account details
  - Authenticating user
  - Registering user
  - Updating user details
  - Deleting user

*/

/* imports for express router, database for users and passport */
var express = require("express");
var router = express.Router();
var userService = require("api/models/user");
var passport = require("passport");

/* routes for user api controller */
router.post("/authenticate", authenticateUser);
router.post("/register", registerUser);
router.get('/myaccount/', passport.authenticate('jwt', { session: false }), getUser);
router.put('/myaccount/:_id', passport.authenticate('jwt', { session: false }), updateCurrentUser);
router.delete('/myaccount/:_id', passport.authenticate('jwt', { session: false }), deleteCurrentUser);

// Export default for router
module.exports = router;

/*
@method authenticateUser

authenticate user for login, return token if user valid

@param req - request from frontend
@param res - result to frontend
@return    - null

*/
function authenticateUser(req, res) {
  // validate the input
  req.checkBody("email", "Email is required").notEmpty();
  req.checkBody("email", "Email does not appear to be valid").isEmail();
  req.checkBody("password", "Password is required").notEmpty();
  
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
    } else { 

      //check for valid user in DB
      userService
        .authenticate(req.body.email, req.body.password)
        .then(function(user) {
          if (user) {
            // authentication successful, return token
            res.send({ status: 1, response: user });
          } else {
            // authentication failed
            res.send({ status: 0, response: "Email or password is incorrect." });
          }
        })
        // catch error if anything other than authentication error
        .catch(function(err) {
          res.send({ status: 0, response: err });
        });
    }
  })
  .catch(function(err) {
    res.send({ status: 0, response: 'An unexpected error occurred!' });
  });
}

/*
@method registerUser

register a new user

@param req - request from frontend
@param res - result to frontend
@return    - null

*/
function registerUser(req, res) {
  // validate the input
  req.checkBody("firstName", "First Name is required").notEmpty();
  req.checkBody("lastName", "Last Name is required").notEmpty();
  req.checkBody("email", "Email is required").notEmpty();
  req.checkBody("email", "Email does not appear to be valid").isEmail();
  req.checkBody("password", "Password is required").notEmpty();

  // check the validation object for errors
  req.getValidationResult().then(function(errors) {
    //throw error, if any
    if (!errors.isEmpty()) {
      //util.inspect(errors.array())
      res.send({ status: 0, response: errors.array() });
      return;
    }

    //save user in DB
    userService
      .create(req.body)
      .then(function() {
        // User successfully registered
        res.send({ status: 1, response: "User registered successfully." });
      })
      .catch(function(err) {
        res.send({ status: 0, response: err });
      });
  });
}

/*
@method getCurrentUser

get user's info

@param req - request from frontend
@param res - result to frontend
@return    - null

*/
function getUser(req, res) {
  var userId = req.user._id;
  userService
    .getById(userId)
    .then(function(user) {
      if (user) {
        // result should return the user
        res.send({ status: 1, response: user });
      } else {
        // user not found
        res.send({ status: 0, response: "User not found." });
      }
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
function updateCurrentUser(req, res) {
  var userId = req.params._id;
  if (req.user._id != userId) {
    // can only update own account
    return res.send({ status: 0, response: "You can only update your own account." });
  }

  // validate the input
  req.checkBody("firstName", "First Name is required").notEmpty();
  req.checkBody("lastName", "Last Name is required").notEmpty();
  req.checkBody("email", "Email is required").notEmpty();
  req.checkBody("email", "Email does not appear to be valid").isEmail();

  // check the validation object for errors
  req.getValidationResult().then(function(errors) {
    //throw error, if any
    if (!errors.isEmpty()) {
      //util.inspect(errors.array())
      res.send({ status: 0, response: errors.array() });
      return;
    }

    //update user in DB
    userService
      .update(userId, req.body)
      .then(function() {
        // user account updated successfully
        res.send({ status: 1, response: "Account updated successfully." , user: req.body});
      })
      .catch(function(err) {
        // catch error
        res.send({ status: 0, response: err });
      });
  });
}

/*
@method deleteUser

delete user's account

@param req - request from frontend
@param res - result to frontend
@return    - null

*/
function deleteCurrentUser(req, res) {
  var userId = req.params._id;
  if (req.user._id != userId) {
    // can only delete own account
    res.send({ status: 0, response: "You can only delete your own account" });
  }

  userService
    .delete(userId)
    .then(function() {
      // deletion successful
      res.send({ status: 1, response: "Account deleted successfully." });
    })
    .catch(function(err) {
      res.send({ status: 0, response: err });
    });
}
