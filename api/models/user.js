/** File used to interact with DB (Mongo DB) */
/*
User model for
  - Creating new user
  - Authenticating user
  - Get user by id
  - Get user by email
  - Update user
  - Delete user
  - Update user's password
*/
const config  = require('config/config');
const _       = require('lodash');
const i18n    = require("i18n");
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs'); /** encrypt password */
const Q       = require('q');
const mongo   = require('mongoskin');
const db      = mongo.db(process.env.MONGOLAB_URI || config.connectionString, { native_parser: true }); // use mongo db
db.bind('users'); /** users table */

/** set "email" field as unique index */
db.users.createIndex( { "email": 1 }, { unique: true } )

const service = {};

/* services for user model */
service.authenticate  = authenticate;
service.getById       = getById;
service.getByEmail    = getByEmail;
service.create        = create;
service.update        = update;
service.delete        = _delete;
service.resetUserPassword = updateUserPassword;

module.exports        = service;

/*
@method authenticate

authenticate user

@param email - user's email
@param password - user's password
@return user session token and user data
*/
function authenticate(email, password) {
  let deferred = Q.defer();

  /** get user by email */
  db.users.findOne({ email: email }, function (err, user) {
    if (err) deferred.reject( err.name + ': ' + err.message );

    /** compare password if user valid */
    if (user && bcrypt.compareSync(password, user.hash)) {
      /** authentication successful, return token */
      let profile = {
        id        : user._id,
        firstName : user.firstName,
        lastName  : user.lastName,
        email     : user.email
      };

      deferred.resolve({ 
                      "token": "Bearer " + jwt.sign(
                                            {id: user._id}, 
                                            config.session_secret, {
                                            expiresIn: 10080 // in seconds
                                          }),
                      "user": profile });
    } else {
      /** authentication failed */
      deferred.resolve();
    }
  });

  return deferred.promise;
}

/*
@method getById

get user by id

@param _id - user id
@return user data
*/
function getById(_id) {
  let deferred = Q.defer(); //save promise

  /** find user by id */
  db.users.findById(_id, function (err, user) {
    if (err) deferred.reject(err.name + ': ' + err.message);

    if (user) {
      /** return user data without password/hash string */
      deferred.resolve(_.omit(user, 'hash'));
    } else {
      /** user not found */
      deferred.resolve();
    }
  });

  return deferred.promise;
}

/*
@method getByEmail

get user by meail

@param email - user's email
@return user data
*/
function getByEmail(email){
  let deferred = Q.defer(); //save promise

  /** validate user */
  db.users.findOne(
    { email: email },
    function (err, user) {
      if (err) deferred.reject(err.name + ': ' + err.message);

      if (user) {
        deferred.resolve(user);
      } else {
        /** email does not exists */
        deferred.reject(i18n.__('no_account'));
      }
    });

  return deferred.promise;
}

/*
@method create

create new user

@param userParam - user data

*/
function create(userParam) {
  let deferred = Q.defer();

  /** check if email id does not already exists */
  db.users.findOne(
    { email: userParam.email },
    function (err, user) {
      if (err) deferred.reject(err.name + ': ' + err.message);

      if (user) {
        /** email already exists */
        deferred.reject(i18n.__('email_already_exist', userParam.email));
      } else {
        /** reset userParam variable to contain required values */
        userParam = {
          firstName : userParam.firstName,
          lastName  : userParam.lastName,
          email     : userParam.email,
          password  : userParam.password
        }
        createUser();
      }
    });

  /** save user detail in DB */
  function createUser() {
    /** set user object to userParam without the cleartext password */
    let user = _.omit(userParam, 'password');

    /** add hashed password to user object */
    user.hash = bcrypt.hashSync(userParam.password, 10);
    
    /** insert in table */
    db.users.insert(
      user,
      function (err, doc) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve();
      });
  }

  return deferred.promise;
}

/*
@method update

update user

@param _id       - user ID
@param userParam - user data

*/
function update(_id, userParam) {
  let deferred = Q.defer();

  /** check if user id is relevant */
  db.users.findById(_id, function (err, user) {
    if (err) deferred.reject(err.name + ': ' + err.message);

    /** check if email is changed */
    if (user.email !== userParam.email) {
      /** email has changed so check if the new email is already taken */
      db.users.findOne(
        { email: userParam.email },
        function (err, user) {
          if (err) deferred.reject(err.name + ': ' + err.message);

          if (user) {
            /** email already exists */
            deferred.reject(i18n.__('email_already_exist', userParam.email));
          } else {
            updateUser();
        }
      });
    } else {
      updateUser();
    }
  });

  /** update user details */
  function updateUser() {
    /** fields to update */
    let set = {
      firstName : userParam.firstName,
      lastName  : userParam.lastName,
      email     : userParam.email,
    };

    /** update password if it was entered */
    if (userParam.password) {
      set.hash = bcrypt.hashSync(userParam.password, 10);
    }

    /** update in table */
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

/*
@method updateUserPassword

update user's password

@param _id       - user ID
@param password  - new password

*/
function updateUserPassword(_id, password){
  let deferred = Q.defer();
  let set = {};

  /** encrypt password */
  set.hash = bcrypt.hashSync(password, 10);

  /** update in table */
  db.users.update(
    { _id: mongo.helper.toObjectID(_id) },
    { $set: set },
    function (err, doc) {
      if (err) deferred.reject(err.name + ': ' + err.message);

      deferred.resolve();
    });
  
  return deferred.promise;
}

/*
@method _delete

delete user account

@param _id  - user ID

*/
function _delete(_id) {
  let deferred = Q.defer();

  /** delete record from table */
  db.users.remove(
    { _id: mongo.helper.toObjectID(_id) },
    function (err) {
      if (err) deferred.reject(err.name + ': ' + err.message);

      deferred.resolve();
    });

  return deferred.promise;
}