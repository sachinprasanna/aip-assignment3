/*
Controller for rss routes
- Display rss data
*/
const express = require('express');
const router  = express.Router();
const config  = require('config/config');
const uri     = require('config/uri');

//declare _viewData variable to pass to view and initialize with uri variables
let _viewData = { uri: uri };

/** [GET] route for /rss 
 * Display view for rss feeds
*/
router.get('/', function (req, res) {

  //render view
  return res.render('rss', _viewData);
});

module.exports = router;