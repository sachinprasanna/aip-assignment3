/** File to write unit tests for post model */
const config = require("../config/config");
const Q         = require('q');
const chai  = require('chai');
const mongo   = require('mongoskin');
const db = mongo.db(process.env.MONGOLAB_URI || config.connectionString, { native_parser: true }); // use mongo db
const postService = require("../api/models/post");
db.bind('posts');

//Define tests for post model functions
describe('Post model', function() {
  
  /** TEST 1 */
  //test post is being saved in database
  /** 1. Calls function from post model to save a new post
   *  2. Checks in database if post has been added
   *  3. Checks stored post info matches original
   *  4. Checks createdAt field is not empty
   *  5. Checks version number of post is set to 1
   *  6. Passes test if all checks are passed, else fails test
   */
  it('saves a post and sets metadata', function(done) {
    let postData = {
        "title":"Test Post",
        "content":"Post Content",
        "userId":"some-user-id"
    };

    //call function to save post
    postService.create(postData)
    .then( function(data) {
      // check if post added in database
      db.posts.findOne(
      { _id:  data.ops[0]._id },
      function (err, post) {
        if (err) done(err);
  
        if (post) {
          //test success
          chai.expect(post.title).to.equal(postData.title);
          chai.expect(post.userId).to.equal(postData.userId);
          chai.expect(post.createdAt).to.be.not.null;
          chai.expect(post.version).to.equal(1);
          done();
        } else {
          //test failed if post not added
          done(new Error('Post not saved.'));
        }
      });
    })
    .catch( function(err) {
      //test failed due to any other error
      done(new Error(err));
    });
  });

  /** TEST 2 */
  //test post is being fetched correctly from database
  /** 1. Calls function from post model to save a new post
   *  2. Gets saved post data from database by using the returned post ID 
   *  3. Call function from model to get post data using the returned post ID
   *  4. Checks if both data in database and the one returned from model function match
   *  6. Passes test if checks are passed, else fails test
   */
  it('gets a post by id', function(done) {
    let postData = {
        "title":"Test Post",
        "content":"Post Content",
        "userId":"some-user-id"
    };

    let postFromDb = null;

    //call function to save post
    postService.create(postData)
    .then( function(data) {
      // fetch post directly from database by created post's id
      let deferred = Q.defer();
      db.posts.findOne(
      { _id:  data.ops[0]._id },
      function (err, post) {
        if (err) deferred.reject(err);
        deferred.resolve(post); //return post
      });
      return deferred.promise;
    })
    .then(function(fetchedPost) {
      postFromDb = fetchedPost; 
      //call function from post model to get post data by ID
      return postService.getById(postFromDb._id);
    })
    .then(function(postFromModel) {
      // test is success if post data added and post data saved in database match
      chai.expect(postFromDb).to.deep.equal(postFromModel);
      done();
    })
    .catch( function(err) {
      //test failed due to any other error
      done(new Error(err));
    });
  });

  /** TEST 3 */
  //test invalid id does not return any post
  /** 1. Calls function from post model to get data by passing invalid post ID
   *  2. Checks returned value is undefined or null
   *  3. Throws error if returned value is not undefined, passes test if it is
   */
  it('returns nothing if fetching post by invalid id', function(done) {
    postService.getById("some-invalid-id")
    .then(function(postFromModel) {
      //should be undefined for test to pass
      chai.expect(postFromModel).to.be.undefined;
      done();
    })
    .catch( function(err) {
      //test failed due to any other error
      done(new Error(err));
    });
  });
});