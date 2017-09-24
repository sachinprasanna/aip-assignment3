//File used to interact with DB (Mongo DB)
var config = require('config/config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs'); //encrypt password
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true }); // use mongo db
db.bind('users'); //users table

var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

//authenticate user
function authenticate(email, password) {
  var deferred = Q.defer();

  //get user by email
  db.users.findOne({ email: email }, function (err, user) {
    if (err) deferred.reject(err.name + ': ' + err.message);

    //compare password if user valid
    if (user && bcrypt.compareSync(password, user.hash)) {
      // authentication successful, return token
      var profile = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };

      //deferred.resolve(jwt.sign(profile, config.secret, {
      //  expiresIn: 10080 // in seconds
      //}));
      deferred.resolve({ "token": "Bearer " + jwt.sign({id: user._id}, config.secret, {
          expiresIn: 10080 // in seconds
        }),"user": profile });
    } else {
      // authentication failed
      deferred.resolve();
    }
  });

  return deferred.promise;
}

//get user by id
function getById(_id) {
  var deferred = Q.defer(); //save promise

  //find user by id
  db.users.findById(_id, function (err, user) {
    if (err) deferred.reject(err.name + ': ' + err.message);

    if (user) {
      // return user (without hashed password)
      deferred.resolve(_.omit(user, 'hash'));
    } else {
      // user not found
      deferred.resolve();
    }
  });

  return deferred.promise;
}

//create new user
function create(userParam) {
  var deferred = Q.defer();

  // validate user
  db.users.findOne(
    { email: userParam.email },
    function (err, user) {
      if (err) deferred.reject(err.name + ': ' + err.message);

      if (user) {
        // email already exists
        deferred.reject('Email "' + userParam.email + '" is already taken');
      } else {
        createUser();
      }
    });

  //save user detail in DB
  function createUser() {
    // set user object to userParam without the cleartext password
    var user = _.omit(userParam, 'password');

    // add hashed password to user object
    user.hash = bcrypt.hashSync(userParam.password, 10);
    
    //insert in table
    db.users.insert(
      user,
      function (err, doc) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve();
      });
  }

  return deferred.promise;
}

//update user detail
function update(_id, userParam) {
  var deferred = Q.defer();

  // check if user id is relevant
  db.users.findById(_id, function (err, user) {
    if (err) deferred.reject(err.name + ': ' + err.message);

    //check if email is changed
    if (user.email !== userParam.email) {
      // email has changed so check if the new email is already taken
      db.users.findOne(
        { email: userParam.email },
        function (err, user) {
          if (err) deferred.reject(err.name + ': ' + err.message);

          if (user) {
            // email already exists
            deferred.reject('Email "' + req.body.email + '" is already taken')
          } else {
            updateUser();
        }
      });
    } else {
      updateUser();
    }
  });

  //update user details
  function updateUser() {
    // fields to update
    var set = {
      firstName: userParam.firstName,
      lastName: userParam.lastName,
      email: userParam.email,
    };

    // update password if it was entered
    if (userParam.password) {
      set.hash = bcrypt.hashSync(userParam.password, 10);
    }

    //update in table
    db.users.update(
      { _id: mongo.helper.toObjectID(_id) },
      { $set: set },
      function (err, doc) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve();
      });
  }

  return deferred.promise;
}

//delete user account
function _delete(_id) {
  var deferred = Q.defer();

  //delete record from table
  db.users.remove(
    { _id: mongo.helper.toObjectID(_id) },
    function (err) {
      if (err) deferred.reject(err.name + ': ' + err.message);

      deferred.resolve();
    });

  return deferred.promise;
}