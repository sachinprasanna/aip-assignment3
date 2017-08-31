# aip-assignment3 - Cheap Aussie

# About

This repo contains the backend code for the app *Cheap Aussie*, made for UTS Advanced Internet Programming, Assignment 3. Built with Node.js, Express and sweat.

# Installation

Run the following command to run the backend code:

```
# install modules
$ npm install 
# or if you want to use yarn
$ yarn install
```

-------------
# Start the App

```
# In terminal
$ npm start
$ mongod
```

#API Docs

**NOTE:** API Url: http://localhost:5000/ or whatever port you specified in your env

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
    
### Get user detail [GET] (/api/user/myaccount/)
+ Request
    + Headers
      Authorization : USER TOKEN

### Update user detail [PUT] (/api/user/update/USER ID)
+ Request
    + Headers
      Authorization : USER TOKEN
    + Body
    {
        "firstName":"John12",
        "lastName":"Doe12",
        "email":"john12@example.com"
    }    

### Delete user account [DELETE] (/api/user/delete/USER ID)
+ Request
    + Headers
      Authorization : USER TOKEN

## Using ITEM API

### Add Item [POST] (/items)
+ Request
    + Body (application/json)
    {
        "name":"Item 1.1",
        "price":"$1.1",
        "description":"this is where description goes",
        "image":"image url",
        "url" : "url"
    }

### List all Items [GET] (/items)

### List Items by id [GET] (/items/:itemId)
+ Param
    + Key : itemId
    + Value : enter item's id here.

### Delete Items by id [DELETE] (/items/:itemId)
+ Param
    + Key : itemId
    + Value : enter item's id here supposed to be deleted.

### Edit Items by id [PUT] (/items/:itemId)
+ Param
    + Key : itemId
    + Value : enter item's id here supposed to be deleted.
+ Body (application/json)
    {
        "name":"Item 1.1",
        "price":"$1.1",
        "description":"this is where description goes",
        "image":"image url",
        "url" : "url"
    }

# TODO
- Add OAuth2