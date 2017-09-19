var express = require('express');
var router = express.Router();
var config = require('config.json');
var userService = require("services/user.service");

router.get('/', function (req, res) {
    //render login
    var viewData = { success: req.session.success };
    res.render('login', viewData);
});

//post login form
router.post('/', function (req, res) {
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
                    return res.render('login', {user: user});
                } else {
                    // authentication failed
                    return res.render('login', { error: "Email or password incorrect" });
                }
            })
            // catch error if anything other than authentication error
            .catch(function(err) {
                return res.render('login', { error: err });
            });
    });
});

module.exports = router;