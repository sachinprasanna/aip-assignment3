/*
User controller for
  - Account details
  - Authenticating user
  - Registering user
  - Updating user details
  - Deleting user

*/

/* imports for express router, database for users and passport */
const express     = require("express");
const router      = express.Router();
const userService = require("api/models/user");
const passport    = require("passport");
const sendmail    = require('sendmail')();
const config      = require('config/config');
const uri         = require('config/uri');
const i18n        = require("i18n");

/* routes for user api controller */
router.post(uri.api.route.user_authenticate,  authenticateUser);
router.post(uri.api.route.user_register,      registerUser);
router.post(uri.api.route.user_resetpwd,      resetPassword);
router.get(uri.api.route.user_myaccount,      passport.authenticate('jwt', { session: false }), getUser);
router.put(uri.api.route.user_myaccount    + '/:_id', passport.authenticate('jwt', { session: false }), updateCurrentUser);
router.delete(uri.api.route.user_myaccount + '/:_id', passport.authenticate('jwt', { session: false }), deleteCurrentUser);

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
  req.checkBody("email",    i18n.__('email_required')).notEmpty();
  req.checkBody("email",    i18n.__('invalid_email')).isEmail();
  req.checkBody("password", i18n.__('password_required')).notEmpty();
  
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
    } else { 

      //check for valid user in DB
      userService
        .authenticate(req.body.email, req.body.password)
        .then( function(user) {
          if (user) {
            // authentication successful, return token
            res.send({ status: 1, response: user });
          } else {
            // authentication failed
            res.send({ status: 0, response: i18n.__('incorrect_credentials') });
          }
        })
        // catch error if anything other than authentication error
        .catch( function(err) {
          res.send({ status: 0, response: err });
        });
    }
  })
  .catch( function(err) {
    res.send({ status: 0, response: i18n.__('unexpected_error') });
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
  req.checkBody("firstName",  i18n.__('firstname_required')).notEmpty();
  req.checkBody("lastName",   i18n.__('lastname_required')).notEmpty();
  req.checkBody("email",      i18n.__('email_required')).notEmpty();
  req.checkBody("email",      i18n.__('invalid_email')).isEmail();
  req.checkBody("password",   i18n.__('password_required')).notEmpty();

  // check the validation object for errors
  req.getValidationResult().then( function(errors) {
    //throw error, if any
    if (!errors.isEmpty()) {
      //util.inspect(errors.array())
      let errorArray  = errors.array();
      let msg         = '';
      for (i = 0; i < errorArray.length; i++) { 
          msg         += errorArray[i].msg + ".";
      }
      res.send({ status: 0, response: msg });
      return;
    }

    //save user in DB
    userService
      .create(req.body)
      .then( function() {
        // User successfully registered
        res.send({ status: 1, response: i18n.__('user_registered') });
      })
      .catch( function(err) {
        res.send({ status: 0, response: err });
      });
  });
}

function resetPassword(req, res){
  // validate the input
  req.checkBody("email",      i18n.__('email_required')).notEmpty();
  req.checkBody("email",      i18n.__('invalid_email')).isEmail();
  
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
    } else { 

      //check for valid user in DB
      userService
        .getByEmail(req.body.email)
        .then( function(user) {
          if (user) {
            // authentication successful, return token
              sendmail({
                from    : config.email_from,
                to      : req.body.email,
                subject : i18n.__('reset_password'),
                html    : '<a href="' + config.appUrl + uri.api.link.resetpwd + '" target="_blank">' + i18n.__('click_to_reset') + '</a>',
              }, function(err, reply) {
                res.end( i18n.__('password_sent') );
            });
          } else {
            // authentication failed
            res.send({ status: 0, response: "Account does not exist" });
          }
        })
        // catch error if anything other than authentication error
        .catch( function(err) {
          res.send({ status: 0, response: err });
        });
    }
  })
  .catch( function(err) {
    res.send({ status: 0, response: i18n.__('unexpected_error') });
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
  let userId = req.user._id;
  userService
    .getById(userId)
    .then( function(user) {
      if (user) {
        // result should return the user
        res.send({ status: 1, response: user });
      } else {
        // user not found
        res.send({ status: 0, response: i18n.__('no_user') });
      }
    })
    .catch( function(err) {
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
  let userId = req.params._id;
  if (req.user._id != userId) {
    // can only update own account
    return res.send({ status: 0, response: i18n.__('own_account_restriction') });
  }

  // validate the input
  req.checkBody("firstName",  i18n.__('firstname_required')).notEmpty();
  req.checkBody("lastName",   i18n.__('lastname_required')).notEmpty();
  req.checkBody("email",      i18n.__('email_required')).notEmpty();
  req.checkBody("email",      i18n.__('invalid_email')).isEmail();

  // check the validation object for errors
  req.getValidationResult().then( function(errors) {
    //throw error, if any
    if (!errors.isEmpty()) {
      //util.inspect(errors.array())
      let errorArray  = errors.array();
      let msg         = '';
      for (i = 0; i < errorArray.length; i++) { 
          msg         += errorArray[i].msg + ".";
      }
      res.send({ status: 0, response: msg });
      return;
    }

    //update user in DB
    userService
      .update(userId, req.body)
      .then( function() {
        // user account updated successfully
        res.send({ status: 1, response: i18n.__('account_updated') , user: req.body});
      })
      .catch( function(err) {
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
  let userId = req.params._id;
  if (req.user._id != userId) {
    // can only delete own account
    res.send({ status: 0, response: i18n.__('own_account_delete') });
  }

  userService
    .delete(userId)
    .then( function() {
      // deletion successful
      res.send({ status: 1, response: i18n.__('account_deleted') });
    })
    .catch( function(err) {
      res.send({ status: 0, response: err });
    });
}
