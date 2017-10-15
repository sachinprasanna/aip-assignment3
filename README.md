# aip-assignment3 - MyDiary

# About

MyDiary allows user to add and maintain their posts as well as read other registered user's posts. A user needs to be logged in to access the website.
This repo contains the server-side(api) and client-side(app) code for the web application *MyDiary*, made for subject - Advanced Internet Programming, Assignment 3. This project is built in Node.js, Express and EJS template engine.

# Installation

Run the following command to run the code:

```
# install modules
$ npm install 

```

-------------
# Start the App

```
# In terminal
$ npm start
```

#API Docs

**NOTE:** API Url: http://localhost:8000/

### Register User [POST] (/api/user/register/)
+ Request
    + Body (application/json)
    {
        "firstName":"John",
        "lastName":"Doe",
        "email":"john@example.com",
        "password":"111"
    }
    
### Login User [POST] (/api/user/authenticate/)
+ Request
    + Body (application/json)
    {
        "email":"john@example.com",
        "password":"111"
    }
    
    
### Reset password of User [POST] (/api/user/resetpwd/)
+ Request
    + Body (application/json)
    {
        "email":"john@example.com",
    }

### Get user detail [GET] (/api/user/myaccount/)
+ Request
    + Headers
      Authorization : USER TOKEN

### Update user detail [PUT] (/api/user/myaccount/USER ID)
+ Request
    + Headers
      Authorization : USER TOKEN
    + Body
    {
        "firstName":"John12",
        "lastName":"Doe12",
        "email":"john12@example.com"
    }    

### Delete user account [DELETE] (/api/user/myaccount/USER ID)
+ Request
    + Headers
      Authorization : USER TOKEN

### Get all posts [GET] (/api/post/all/)
+ Request
    + Headers
      Authorization : USER TOKEN

### Get a user's posts [GET] (/api/post/user/USER ID)
+ Request
    + Headers
      Authorization : USER TOKEN
      
### Add new post [POST] (/api/post/create/)
+ Request
    + Headers
      Authorization : USER TOKEN
    + Body (application/json)
    {
      "title": "test1",
      "content": "testing content"
    }

### Get post detail [GET] (/api/post/detail/POST ID)
+ Request
    + Headers
      Authorization : USER TOKEN
 
### Edit a post [POST] (/api/post/edit/POST ID)
+ Request
    + Headers
      Authorization : USER TOKEN
    + Body (application/json)
    {
      "title": "test1",
      "content": "testing content",
      "version": 1
    }
