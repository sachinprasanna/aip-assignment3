var express = require('express');
var router = express.Router();
var request = require('request');
var jwt = require('jsonwebtoken');
var config = require('config.json');
var userService = require('services/user.service');

router.get('/', function (req, res) {
     try {
          decoded = jwt.verify(req.session.token, config.secret);
          userService.getById(decoded.id)
               .then(function (user) {
                    res.render('account', {user: user});
               })
               .catch(function (err) {
                    console.log('Error')
               });
     } catch (e) {
          res.redirect('/login');
     }
});

router.post('/', function (req, res) {
    // authenticate using api to maintain clean separation between layers

    // check the validation object for errors
    req.getValidationResult().then(function(errors) {
        //throw error, if any
        if (!errors.isEmpty()) {
            res.render('account', {user: user, error: errors.array() });
        } else {
          decoded = jwt.verify(req.session.token, config.secret);
          //update user in DB
         userService
              .update(decoded.id, req.body)
              .then(function() {
                  // user account updated successfully
                  res.render('account', {user: user, success: "Account updated successfully."});
              })
              .catch(function(err) {
                  // catch error
                  res.render('account', {user: user, error: err});
              });
        }
    });
});

module.exports = router;