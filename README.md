# aip-assignment3

# Installation

Run the following command:

```
# install modules
$ npm install

```

-------------
# Start the App

```
# In browser
$ npm start
```

#API Docs
**NOTE:** API Url: http://localhost:5000/

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