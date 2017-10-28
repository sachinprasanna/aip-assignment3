/** File used to interact with DB (Mongo DB) */
/*
Post model for
  - Creating new post
  - Get a post by id
  - Get a user's post
  - Update post
  - Delete post
  - Get all user's post
  - Get all posts
*/
const config    = require('../../config/config');
const _         = require('lodash');
const Entities  = require('html-entities').AllHtmlEntities;
const i18n      = require("i18n");
const Q         = require('q');
const mongo     = require('mongoskin');
const db        = mongo.db(process.env.MONGOLAB_URI || config.connectionString, { native_parser: true }); // use mongo db
const entities  = new Entities();

db.bind('posts'); //posts table

/** set index on fields to make them searchable  */
db.posts.createIndex(
  {
    title   : "text",
    content : "text"
  }
)
const service         = {};

/* services for post model */
service.create        = create;
service.getById       = getById;
service.getUserPost   = getUserPost;
service.update        = update;
service.delete        = _delete;
service.getUserPosts  = getUserPosts;
service.getAllPosts   = getAllPosts;

module.exports        = service;

/*
@method create

create new post

@param post - post data object

*/
function create(post) {

  let deferred = Q.defer();
  
  /** fields to add */
  let collectionData = {
    title   : entities.encode(post.title),
    content : entities.encode(post.content),
    userId  : post.userId,
    version : 1,
    createdAt: new Date()
  };

  /** insert in table */
  db.posts.insert(
    collectionData,
    function (err, doc) {
      if (err) deferred.reject(err.name + ': ' + err.message);

      deferred.resolve(doc);
    });

  return deferred.promise;
}

/*
@method getById

get post by id

@param _id - post ID

*/
function getById(_id) {
  let deferred = Q.defer(); /**save promise */

  /** find post by id */
  db.posts.findById(_id, function (err, post) {
    if (err) deferred.reject(err.name + ': ' + err.message);

    if (post) {
      /** return post */
      deferred.resolve(post);
    } else {
      /** post not found */
      deferred.resolve();
    }
  });

  return deferred.promise;
}

/*
@method getUserPost

get user's post by id

@param postId - post ID
@param userId - user ID

*/
function getUserPost(postId, userId) {
  let deferred = Q.defer(); /** save promise  */

  /** find post by post id and user id */
  db.posts.find({'_id': mongo.helper.toObjectID(postId), 'userId': mongo.helper.toObjectID(userId)},
    function (err, post) {
      if (err) deferred.reject(err.name + ': ' + err.message);
  
      if (post) {
        /** return post */
        deferred.resolve(post);
      } else {
        /** post not found */
        deferred.resolve();
      }
    });

  return deferred.promise;
}

/*
@method update

update post

@param _id       - post ID
@param userId    - user ID
@param postParam - post data

*/
function update(_id, userId, postParam) {
  let deferred = Q.defer();

  /** check if post id is relevant and belongs to user id */
  db.posts.find({'_id': mongo.helper.toObjectID(_id), 'userId': mongo.helper.toObjectID(userId)},
    function (err, post) {
      if (err) deferred.reject(err.name + ': ' + err.message);

      post.toArray(function(err, postList) {
        /** check if array is not empty */
        if(!postList.length) { deferred.reject(i18n.__('invalid_entry') ); return  deferred.promise; }
        
        /** check version of post */
        if(postList[0].version != postParam.version) { deferred.reject(i18n.__('invalid_version') ); return  deferred.promise; }
        
        /** fields to update */
        let set = {
          title   : entities.encode(postParam.title),
          content : entities.encode(postParam.content),
          version : ++postList[0].version
        };
        
        /** update in table */
        db.posts.update(
          { _id: mongo.helper.toObjectID(_id) },
          { $set: set },
          function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
    
            deferred.resolve(getById(_id));
          });
      });
    });


  return deferred.promise;
}

/*
@method _delete

 delete post

@param _id       - post ID
@param userId    - user ID

*/
function _delete(_id, userId) {
  let deferred = Q.defer();

  /** delete record from table */
  db.posts.remove(
    { _id   : mongo.helper.toObjectID(_id), 
      userId: mongo.helper.toObjectID(userId),},
    function (err) {
      if (err) deferred.reject(err.name + ': ' + err.message);

      deferred.resolve();
    });

  return deferred.promise;
}

/*
@method getUserPosts

get all posts by a user

@param userId    - user ID

*/
function getUserPosts(userId) {
  let deferred = Q.defer();

  //get all posts of user
  deferred.resolve(db.posts.find({ "userId": mongo.helper.toObjectID(userId) }).sort({ createdAt: -1 }));
  return deferred.promise;
}

/*
@method getAllPosts

get all posts

@param searchParam  - search posts consisting of search string

*/
function getAllPosts(searchParam){
  let deferred = Q.defer();
  
  let queryOption = [];
  /** if search query string variable is not empty, add to nosql query */
  if(searchParam){
    queryOption.push({ $match : { $text: { $search: searchParam } } })
  }
  
  /**set query for search */
  queryOption.push({
        "$lookup": {
          "from"        : "users",
          "localField"  : "userId",
          "foreignField": "_id",
          "as"          : "userinfo"
        }
      },
      {
        $unwind         : "$userinfo"
      },
      {   
        $project: {
          _id           : 1,
          title         : 1,
          content       : 1,
          createdAt     : 1,
          userFirstName : "$userinfo.firstName",
          userLastName  : "$userinfo.lastName",
        } 
      },
      { $sort : { createdAt : -1 } });

  db.posts.aggregate(queryOption, function(err, posts) {
      deferred.resolve(posts);
  });
  
  return deferred.promise;
}