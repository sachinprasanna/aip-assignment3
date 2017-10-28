/** File to write unit tests for user model */
const config = require("../config/config");
const chai  = require('chai');
const mongo   = require('mongoskin');
const jwt     = require('jsonwebtoken');
const db = mongo.db(process.env.MONGOLAB_URI || config.connectionString, { native_parser: true }); // use mongo db
const userService = require("../api/models/user");
db.bind('users');


//Define tests for user model functions
describe('User model', function() {
  
  /** TEST 1 */
  //test user is being saved in database
  /** 1. Calls user model function to save a new user
   *  2. Checks in database if user has been added
   *  3. Checks stored userinfo matches original
   *  4. Passes test if all checks are passed, else fails test
   */
  it('should add user', function(done) {
    let userData = {
        "firstName":"John",
        "lastName":"Doe",
        "email":new Date().getTime() + "@example.com",
        "password":"111"
    };

    //call function to save user
    userService.create(userData)
      .then( function() {
        //check if user added in database
        db.users.findOne(
          { email: userData.email },
          function (err, user) {
            if (err) done(err);
      
            if (user) {
              //test success if user added and has same info
              chai.expect(user.firstName).to.equal(userData.firstName);
              chai.expect(user.lastName).to.equal(userData.lastName);
              chai.expect(user.email).to.equal(userData.email);
              done();
            } else {
              //test failed if user not added
              done(new Error('User not saved.'));
            }
          });
      })
      .catch( function(err) {
        //test failed due to any other error
        done(new Error(err));
      });
    });

  /** TEST 2 */
  //test same user is not being saved in database
  /** 1. Calls user model function to save a new user
   *  2. Calls same user model function again to save same user info
   *  3. Throws error if same user is being saved, else passes test
   */
  it('should not add same user', function(done) {
    let _email = new Date().getTime() + "@example.com";
    let userData = {
        "firstName":"John",
        "lastName":"Doe",
        "email":_email,
        "password":"111"
    };

    //call function to create user
    userService.create(userData)
      .then( function() {
        //call function again to add same user info
        return userService.create(userData)
      })
      .then( function(){
        //throw error if test failed
        return done(new Error('User saved.'));
      })
      .catch( function(err){
        // success if same user is not being saved
        return done();
      });
  });


  /** TEST 3 */
    //test valid token and user info is returned when user logs in
  /** 1. Calls user model function to save a new user
   *  2. Calls authenticate function from user model
   *  3. Checks returned userinfo matches original
   *  4. Checks returned token is valid
   *  5. Passes test if all checks are passed, else fails test
   */
    it('should return valid token and userinfo when logged in', function(done) {
      let _email = new Date().getTime() + "@example.com";
      let userData = {
        "firstName":"John",
        "lastName":"Doe",
        "email":_email,
        "password":"111"
      };
      //call function to save new user
      userService.create(userData)
      .then( function() {
        //call function to authenticate user
        return userService.authenticate(userData.email, userData.password)
      })
      .then( function(res){
        chai.expect(res).to.have.property('token');
        chai.expect(res).to.have.property('user');
        chai.expect(res.user.firstName).to.equal(userData.firstName);
        chai.expect(res.user.lastName).to.equal(userData.lastName);
        chai.expect(res.user.email).to.equal(userData.email);
        res.token = (res.token).replace("Bearer ", "");
        jwt.verify(res.token, config.session_secret); //verify token
        done(); //passes test
      })
      .catch( function(err) {
        //test failed due to any other error
        done(new Error(err));
      });
  });
  
});