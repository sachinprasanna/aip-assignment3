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
var userService = require("services/user.service");
var passport = require("passport");

/* routes for user api controller */
router.get("/myaccount/", passport.authenticate("jwt", { session: false }), getCurrentUser);
router.post("/authenticate", authenticateUser);
router.post("/register", registerUser);
router.put("/update/:_id", passport.authenticate("jwt", { session: false }), updateUser);
router.delete("/delete/:_id", passport.authenticate("jwt", { session: false }), deleteUser);

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
            //util.inspect(errors.array())
            res.send({ status: "error", response: errors.array() });
            return;
        }

        //check for valid user in DB
        userService
            .authenticate(req.body.email, req.body.password)
            .then(function(user) {
                if (user) {
                    // authentication successful, return token
                    res.send({ status: "success", response: user });
                } else {
                    // authentication failed
                    res.status(401).send({ status: "error", response: "Email or password is incorrect." });
                }
            })
            // catch error if anything other than authentication error
            .catch(function(err) {
                res.status(400).send({ status: "error", response: err });
            });
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
            res.send({ status: "error", response: errors.array() });
            return;
        }

        //save user in DB
        userService
            .create(req.body)
            .then(function() {
                // User successfully registered
                res.status(200).send({ status: "success", response: "User registered successfully." });
            })
            .catch(function(err) {
                res.status(400).send({ status: "error", response: err });
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
function getCurrentUser(req, res) {
    userService
        .getById(req.user._id)
        .then(function(user) {
            if (user) {
                // result should return the user
                res.send({ status: "success", response: user });
            } else {
                // user not found
                res.status(404).send({ status: "error", response: "User not found." });
            }
        })
        .catch(function(err) {
            // return error
            res.status(400).send({ status: "error", response: err });
        });
}

/*
@method updateUser

update user's info

@param req - request from frontend
@param res - result to frontend
@return    - null

*/
function updateUser(req, res) {
    var userId = req.params._id;
    if (req.user._id != userId) {
        // can only update own account
        return res.status(401).send({ status: "error", response: "You can only update your own account." });
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
            res.send({ status: "error", response: errors.array() });
            return;
        }

        //update user in DB
        userService
            .update(userId, req.body)
            .then(function() {
                // user account updated successfully
                res.status(200).send({ status: "success", response: "Account updated successfully." });
            })
            .catch(function(err) {
                // catch error
                res.status(400).send({ status: "error", response: err });
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
function deleteUser(req, res) {
    var userId = req.params._id;
    if (req.user._id != userId) {
        // can only delete own account
        res.status(401).send({ status: "error", response: "You can only delete your own account" });
    }

    userService
        .delete(userId)
        .then(function() {
            // deletion successful
            res.status(200).send({ status: "success", response: "Account deleted successfully." });
        })
        .catch(function(err) {
            res.status(400).send({ status: "error", response: err });
        });
}
