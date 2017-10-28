const chai  = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
const userController = require("../api/controllers/user");

chai.use(chaiHttp);

describe('User controller', function() {

  it('should add a user', function() {
    let userData = {
        "firstName":"John",
        "lastName":"Doe",
        "email":"john@example.com",
        "password":"111"
    };

    chai.request(userController)
    .post('/register')
    .send(userData)
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('status');
      res.body.status.should.be.a('number');
      res.body.should.have.property('response');
      res.body.status.should.be.a('string');
      done();
    });
  });


  // it.only('should register user', function(done) {
  //   let userData = {
  //       "firstName":"John",
  //       "lastName":"Doe",
  //       "email":"john@example.com",
  //       "password":"111"
  //   };
  //   console.log(1111);
  //   userService.create(userData)
  //   .then( function() {
  //     console.log(123);
  //     assert.pass();
  //     done();
  //   })
  //   .catch( function(err) {
  //     console.log(456);
  //     assert.fail();
  //     done();
  //   });
    
  // });

  
});