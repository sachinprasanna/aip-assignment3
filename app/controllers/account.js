/*
Controller for user account routes
- Display user data
- Update user data
*/
const express = require('express');
const router  = express.Router();
const request = require('request');
const jwt     = require('jsonwebtoken');
const config  = require('config/config');
const uri     = require('config/uri');

//declare _viewData variable to pass to view and initialize with uri variables
let _viewData = { uri: uri };

/** [GET] route for /myaccount 
 * DIsplay user data
*/
router.get('/', function (req, res) {
  //create template variable
  let data  = _viewData;
  data.user = req.session.user;
  delete data.success
  delete data.error
  
  //render view
  return res.render('account', data);
});

/** [POST] route for /myaccount 
 * Call API to update user data
*/
router.post('/', function (req, res) {
  //create template variable
  let data    = _viewData;
  const userId  = req.session.user.id;
  delete data.success
  delete data.error
  
  /** call api to maintain clean separation between layers */
  //call user account update API to update changes
  request.put({
    url   : config.apiUrl + uri.api.link.user_account + userId,
    form  : req.body,
    headers: {'Authorization': req.session.token},
    json  : true
  }, function (error, response, body) {
    //set error
    if (body.status == 0) {
      data.error      = body.response;
      data.user       = req.session.user;
      return res.render('account', data);
    }

    //set user detail
    req.session.user  = body.user;
    data.user         = req.session.user;
    data.user.id      = userId;
    data.success      = body.response;
    
    //render view
    res.render('account', data);
  });
});

module.exports = router;