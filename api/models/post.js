//File used to interact with DB (Mongo DB)
var config = require('config/config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs'); //encrypt password
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(process.env.MONGOLAB_URI || config.connectionString, { native_parser: true }); // use mongo db
db.bind('posts'); //posts table

// set index on fields to make them searchable 
db.posts.createIndex(
  {
    title: "text",
    content: "text"
  }
)
var service = {};

service.create = create;
service.getById = getById;
service.getUserPost = getUserPost;
service.update = update;
service.delete = _delete;
service.getUserPosts = getUserPosts;
service.getAllPosts = getAllPosts;

module.exports = service;

//create new post
function create(postParam) {
  var deferred = Q.defer();
  
  // fields to add
  var collectionData = {
    title: postParam.title,
    content: postParam.content,
    userId: postParam.userId,
    version: 1,
    createdAt: new Date()
  };
   console.log(collectionData);
  //insert in table
  db.posts.insert(
    collectionData,
    function (err, doc) {
      if (err) deferred.reject(err.name + ': ' + err.message);

      deferred.resolve();
    });

  return deferred.promise;
}

//get post by id
function getById(_id) {
  var deferred = Q.defer(); //save promise

  //find post by id
  db.posts.findById(_id, function (err, post) {
    if (err) deferred.reject(err.name + ': ' + err.message);

    if (post) {
      // return post
      deferred.resolve(post);
    } else {
      // post not found
      deferred.resolve();
    }
  });

  return deferred.promise;
}

//get user's post by id
function getUserPost(postId, userId) {
  var deferred = Q.defer(); //save promise

  //find post by id
  db.posts.find({'_id': mongo.helper.toObjectID(postId), 'userId': mongo.helper.toObjectID(userId)},
    function (err, post) {
      if (err) deferred.reject(err.name + ': ' + err.message);
  
      if (post) {
        // return post
        deferred.resolve(post);
      } else {
        // post not found
        deferred.resolve();
      }
    });

  return deferred.promise;
}

//update post
function update(_id, userId, postParam) {
  var deferred = Q.defer();

  // check if post id is relevant
  db.posts.find({'_id': mongo.helper.toObjectID(_id), 'userId': mongo.helper.toObjectID(userId)},
    function (err, post) {
      if (err) deferred.reject(err.name + ': ' + err.message);

      post.toArray(function(err, postList) {
        console.log(postList[0]);
        
        console.log(postList[0].version + ', ' + postParam.version);
        //check version of post
        if(postList[0].version != postParam.version) { deferred.reject('error: Wrong version!' ); return  deferred.promise; }
        
        // fields to update
        var set = {
          title: postParam.title,
          content: postParam.content,
          version: ++postList[0].version
        };
        
        //update in table
        db.posts.update(
          { _id: mongo.helper.toObjectID(_id) },
          { $set: set },
          function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
    
            deferred.resolve();
          });
      });
    });


  return deferred.promise;
}

//delete post
function _delete(_id) {
  var deferred = Q.defer();

  //delete record from table
  db.posts.remove(
    { _id: mongo.helper.toObjectID(_id) },
    function (err) {
      if (err) deferred.reject(err.name + ': ' + err.message);

      deferred.resolve();
    });

  return deferred.promise;
}

//get all post by user
function getUserPosts(userId) {
  var deferred = Q.defer(); //save promise
  deferred.resolve(db.posts.find({ "userId": userId }).sort({ createdAt: -1 }));
  return deferred.promise;
}

function getAllPosts(searchParam){
  var deferred = Q.defer(); //save promise
  
  var queryOption = [];
  // if search query string variable is not empty, add to nosql query
  if(searchParam){
    queryOption.push({ $match : { $text: { $search: searchParam } } })
  }
  
  queryOption.push({
        "$lookup":
        {
          "from": "users",
          "localField": "userId",
          "foreignField": "_id",
          "as": "userinfo"
        }
      },
      {
        $unwind: "$userinfo"
      },
      {   
        $project:{
          _id: 1,
          title: 1,
          content: 1,
          createdAt: 1,
          userFirstName: "$userinfo.firstName",
          userLastName: "$userinfo.lastName",
        } 
      },
      { $sort : { createdAt : -1 } });

  db.posts.aggregate(queryOption, function(err, posts) {
      deferred.resolve(posts);
  });
  
  return deferred.promise;
}