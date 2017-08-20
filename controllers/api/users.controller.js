var express = require('express');
var router = express.Router();
var userService = require('services/user.service');
var passport = require('passport');

// routes
router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);
router.get('/myaccount/', passport.authenticate('jwt', { session: false }), getCurrentUser);
router.put('/update/:_id', passport.authenticate('jwt', { session: false }), updateUser);
router.delete('/delete/:_id', passport.authenticate('jwt', { session: false }), deleteUser);

module.exports = router;

//authenticate user for login, return token if user valid
function authenticateUser(req, res) {
    // validate the input
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email does not appear to be valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    
    // check the validation object for errors
    req.getValidationResult()
        .then(function(errors){
          
            //throw error, if any
            if(!errors.isEmpty()){
                //util.inspect(errors.array())
                res.send({'status': 'error', 'response': errors.array()});
                return;
            }
          
            //check for valid user in DB
            userService.authenticate(req.body.email, req.body.password)
            .then(function (user) {
                if (user) {
                    // authentication successful, return token
                    res.send({ 'status': 'success', 'response': user });
                } else {
                    // authentication failed
                    res.status(401).send({'status': 'error', 'response': 'Email or password is incorrect.'});
                }
            })
            .catch(function (err) {
                res.status(400).send({'status': 'error', 'response': err});
            });
    });
}

//register a new user
function registerUser(req, res) {
    // validate the input
    req.checkBody('firstName', 'First Name is required').notEmpty();
    req.checkBody('lastName', 'Last Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email does not appear to be valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    
    // check the validation object for errors
    req.getValidationResult()
       .then(function(errors){
          
          //throw error, if any
          if(!errors.isEmpty()){
              //util.inspect(errors.array())
              res.send({'status': 'error', 'response': errors.array()});
              return;
          }
          
          //save user in DB
          userService.create(req.body)
            .then(function () {
                res.status(200).send({'status': 'success', 'response': 'User registered successfully.'});
            })
            .catch(function (err) {
                res.status(400).send({'status': 'error', 'response': err});
            });
     });
}

//get user's info
function getCurrentUser(req, res) {
    userService.getById(req.user._id)
        .then(function (user) {
            if (user) {
                res.send({'status': 'success', 'response': user});
            } else {
                res.status(404).send({'status': 'error', 'response': 'User not found.'});
            }
        })
        .catch(function (err) {
            res.status(400).send({'status': 'error', 'response': err});
        });
}

//update user's info
function updateUser(req, res) {
    var userId = req.params._id;
    if (req.user._id != userId) {
        // can only update own account
        return res.status(401).send({'status': 'error', 'response': 'You can only update your own account.'});
    }

    // validate the input
    req.checkBody('firstName', 'First Name is required').notEmpty();
    req.checkBody('lastName', 'Last Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email does not appear to be valid').isEmail();
    
    // check the validation object for errors
    req.getValidationResult()
       .then(function(errors){
          
        //throw error, if any
        if(!errors.isEmpty()){
            //util.inspect(errors.array())
            res.send({'status': 'error', 'response': errors.array()});
            return;
        }
        
        //update user in DB
        userService.update(userId, req.body)
            .then(function () {
                res.status(200).send({'status': 'success', 'response': 'Account updated successfully.'});
            })
            .catch(function (err) {
                res.status(400).send({'status': 'error', 'response': err});
            });
     });
}

//delete user's account
function deleteUser(req, res) {
    var userId = req.params._id;
    if (req.user._id != userId) {
        // can only delete own account
        return res.status(401).send({'status': 'error', 'response': 'You can only delete your own account'});
    }

    userService.delete(userId)
        .then(function () {
            res.status(200).send({'status': 'success', 'response': 'Account deleted successfully.'});
        })
        .catch(function (err) {
            res.status(400).send({'status': 'error', 'response': err});
        });
}