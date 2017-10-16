# aip-assignment3 - MyDiary

# About

MyDiary allows user to add and maintain their posts as well as read other registered user's posts. A user needs to be logged in to access the website.
This repo contains the server-side(api) and client-side(app) code for the web application *MyDiary*, made for subject - Advanced Internet Programming, Assignment 3. This project is built in Node.js, Express and EJS template engine.

-------------

# Deployed at

https://blooming-fjord-52237.herokuapp.com

-------------

# Dependencies
NPM - Minimum: 5.4.2

Node - Minimum: v8.1.2

MongoDB

```
Install mongoDB locally and run with command:
$ mongod

```
-------------

# Installation

Run the following command to run the code:

```
# install modules
$ npm install 

```

-------------

# Start the App locally

**Note:** 
1. Make sure MongoDB is running.
2. Set up local configuration in /config/config.js:
    a. Check "connectionString" for database configuration is set to a valid database
       Preferably - "mongodb://localhost:27017/mydiary"
    b. Check "apiUrl" is set to "http://localhost:5000/api" (Adjust port number accordingly)
3. App will run at http://localhost:5000/

```
# In terminal
$ npm start

OR

$ nodemon index.js
```

-------------

# API Docs

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

### Get user detail [GET] (/api/user/[USER ID])
+ Request
    + Headers
      Authorization : USER TOKEN

### Update user detail [PUT] (/api/user/[USER ID])
+ Request
    + Headers
      Authorization : USER TOKEN
    + Body
    {
        "firstName":"John12",
        "lastName":"Doe12",
        "email":"john12@example.com"
    }    

### Delete user account [DELETE] (/api/user/[USER ID])
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

### Get post detail [GET] (/api/post/[POST ID])
+ Request
    + Headers
      Authorization : USER TOKEN
 
### Edit a post [PUT] (/api/post/[POST ID])
+ Request
    + Headers
      Authorization : USER TOKEN
    + Body (application/json)
    {
      "title": "test1",
      "content": "testing content",
      "version": 1
    }

### Delete a post [DELETE] (/api/post/[POST ID])
+ Request
    + Headers
      Authorization : USER TOKEN

### Get all posts [GET] (/api/post/all/)
+ Request
    + Headers
      Authorization : USER TOKEN

### Get a user's posts [GET] (/api/post/user/[USER ID])
+ Request
    + Headers
      Authorization : USER TOKEN
    

# Coding Rules
1. Declare variables as 'const' for variables that should not change and 'let' for the ones that can change
2. Indentation should be 2 spaces
3. Do not use static message strings. Use a language file to store message strings.
4. Encode html entities while storing in db to prevent script injection
5. Curly brackets of a function start in same line and end in new line
6. Pass number - 0, 1 as a status for API responses. 0 being an error and 1 is success.
7. API or route names to be stored in separate file to keep record
8. Use camelcase for function names and uris
9. Use underscore for filenames and language variables
10. Do not repeat code
11. Code should be readable
12. Explanatory comments at the top of every file and also on every method
13. Password must be encrypted
14. Precautions for concurrent saves
15. Precautions for sql injection
16. Add ajax requests on necessary pages which display dynamic content such as post listing, search posts, delete posts