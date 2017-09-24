//File used to interact with DB (Mongo DB)
var config = require('config/config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs'); //encrypt password
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true }); // use mongo db
db.bind('posts'); //posts table
db.posts.createIndex(
   {
     title: "text",
     content: "text"
   }
 )
var service = {};

service.create = create;
//service.update = update;
//service.delete = _delete;
service.getUserPosts = getUserPosts;
service.getAllPosts = getAllPosts;

module.exports = service;

//create new post
function create(postParam) {
  var deferred = Q.defer();

  //insert in table
  db.posts.insert(
    postParam,
    function (err, doc) {
      if (err) deferred.reject(err.name + ': ' + err.message);

      deferred.resolve();
    });

  return deferred.promise;
}

//update post
function update(_id, postParam) {
  var deferred = Q.defer();

  // check if user id is relevant
  db.posts.findById(_id, function (err, user) {
    if (err) deferred.reject(err.name + ': ' + err.message);
    
    // fields to update
    var set = {
      title: postParam.title,
      content: postParam.content
    };
    
    //update in table
    db.users.update(
      { _id: mongo.helper.toObjectID(_id) },
      { $set: set },
      function (err, doc) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve();
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
  deferred.resolve(db.posts.find({ "userId": userId }));
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
          _id : 1,
          title : 1,
          content : 1,
          userFirstName : "$userinfo.firstName",
          userLastName : "$userinfo.lastName",
        } 
      });
console.log(queryOption);
  db.posts.aggregate(queryOption, function(err, posts) {
      deferred.resolve(posts);
  });
  
  return deferred.promise;
}