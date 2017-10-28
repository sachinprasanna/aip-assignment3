/*
User controller for
  - Authenticating user
  - Registering user
  - Resetting user password
  - Sending new password via email
  - User Account details
  - Updating user details
  - Deleting user

*/

/* imports for express router, database for users and passport */
const express     = require("express");
const router      = express.Router();
const userService = require("../models/user");
const passport    = require("passport");
const sendmail    = require('sendmail')();
const config      = require('../../config/config');
const uri         = require('../../config/uri');
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
@return    - status (0,1), error message or valid user token

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
      return res.send({ status: 0, response: msg });
    } else { 

      //check for valid user in DB
      userService
        .authenticate(req.body.email, req.body.password)
        .then( function(user) {
          if (user) {
            // authentication successful, return token
            return res.send({ status: 1, response: user });
          } else {
            // authentication failed
            return res.send({ status: 0, response: i18n.__('incorrect_credentials') });
          }
        })
        // catch error if anything other than authentication error
        .catch( function(err) {
          return res.send({ status: 0, response: err });
        });
    }
  })
  .catch( function(err) {
    return res.send({ status: 0, response: i18n.__('unexpected_error') });
  });
}

/*
@method registerUser

register a new user

@param req - request from frontend
@param res - result to frontend
@return    - status (0,1), error or success message

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
        return res.send({ status: 1, response: i18n.__('user_registered') });
      })
      .catch( function(err) {
        return res.send({ status: 0, response: err });
      });
  });
}

/*
@method resetPassword

reset password for a user and send via email

@param req - request from frontend
@param res - result to frontend
@return    - status (0,1), error or success message

*/
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
      return res.send({ status: 0, response: msg });
    } else { 

      //check for valid user in DB
      userService
        .getByEmail(req.body.email)
        .then( function(user) {
          if (user) {
            // authentication successful, generate new password
            let newPassword = Math.random().toString(36).substring(2);

            //update new password in user account
            userService
            .resetUserPassword(user._id, newPassword)
            .then( function() {

              //send new password to the user via email
              emailNewPasswordToUser(res, req.body.email, newPassword);
            })
            .catch( function(err) {
              return res.send({ status: 0, response: err });
            });
            
          } else {
            // authentication failed
            return res.send({ status: 0, response: i18n.__('no_account') });
          }
        })
        // catch error if anything other than authentication error
        .catch( function(err) {
          return res.send({ status: 0, response: err });
        });
    }
  })
  .catch( function(err) {
    return res.send({ status: 0, response: i18n.__('unexpected_error') });
  });
}

/*
@method getUser

get user's info

@param req - request from frontend
@param res - result to frontend
@return    - status (0,1), error message or user object

*/
function getUser(req, res) {
  const userId = req.user._id;

  //get valid user from DB using user ID
  userService
    .getById(userId)
    .then( function(user) {
      if (user) {
        // result should return the user
        return res.send({ status: 1, response: user });
      } else {
        // user not found
        return res.send({ status: 0, response: i18n.__('no_user') });
      }
    })
    .catch( function(err) {
      // return error
      return res.send({ status: 0, response: err });
    });
}

/*
@method updateCurrentUser

update user's info

@param req - request from frontend
@param res - result to frontend
@return    - status (0,1), error or (success message and user object)

*/
function updateCurrentUser(req, res) {
  const userId = req.params._id;

  // user can only update own account
  if (req.user._id != userId) {
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
        return res.send({ status: 1, response: i18n.__('account_updated') , user: req.body});
      })
      .catch( function(err) {
        // catch error
        return res.send({ status: 0, response: err });
      });
  });
}

/*
@method deleteUser

delete user's account

@param req - request from frontend
@param res - result to frontend
@return    - status (0,1), error or success message

*/
function deleteCurrentUser(req, res) {
  const userId = req.params._id;
  
  // can only delete own account
  if (req.user._id != userId) {
    return res.send({ status: 0, response: i18n.__('own_account_delete') });
  }

  //delete user account from DB
  userService
    .delete(userId)
    .then( function() {
      // deletion successful
      return res.send({ status: 1, response: i18n.__('account_deleted') });
    })
    .catch( function(err) {
      return res.send({ status: 0, response: err });
    });
}

/*
@method emailNewPasswordToUser

delete user's account

@param res         - result to frontend
@param email       - send email to
@param newPassword - new password to email
@return            - null

*/
function emailNewPasswordToUser(res, email, newPassword){
  //send email
  sendmail({
      from    : config.email_from,
      to      : email,
      subject : i18n.__('app_name') + '-' + i18n.__('reset_password_subject'),
      html    : i18n.__('new_password_email_text') + ' ' + newPassword,
    }, function(err, reply) {
      res.end(i18n.__('password_sent'));
  });
}