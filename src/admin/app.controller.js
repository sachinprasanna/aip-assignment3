var express = require('express');
var router = express.Router();


// TODO - add validation or middleware
router.use('/', function (req, res, next) {
    next();
});


// serve admin files from the '/admin' route
router.use('/', express.static('admin'));

module.exports = router;