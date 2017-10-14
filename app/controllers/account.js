const express = require('express');
const router  = express.Router();
const request = require('request');
const jwt     = require('jsonwebtoken');
const config  = require('config/config');
const uri     = require('config/uri');

let _viewData = { uri: uri };

router.get('/', function (req, res) {
  let data  = _viewData;
  data.user = req.session.user;
  delete data.success
  delete data.error
  
  return res.render('account', data);
});

router.post('/', function (req, res) {
  let data    = _viewData;
  let userId  = req.session.user.id;
  delete data.success
  delete data.error
  
  request.put({
    url   : config.apiUrl + uri.api.user_account + userId,
    form  : req.body,
    headers: {'Authorization': req.session.token},
    json  : true
  }, function (error, response, body) {
    if (body.status == 0) {
      data.error      = body.response;
      data.user       = req.session.user;
      return res.render('account', data);
    }

    req.session.user  = body.user;
    data.user         = req.session.user;
    data.user.id      = userId;
    data.success      = body.response;
    
    // redirect to returnUrl
    res.render('account', data);
  });
});

module.exports = router;