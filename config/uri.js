module.exports = {
  "api": {
    "route": {
      "user": "/user",
      "post": "/post",
      "user_authenticate": "/authenticate",
      "user_register": "/register",
      "user_resetpwd": "/resetpwd",
      "user_myaccount": "/myaccount",
      "post_create": "/create",
      "post_detail": "/detail",
      "post_edit": "/edit",
      "post_user": "/user",
      "all_posts": "/all"
    },
    "login": "/user/authenticate",
    "register": "/user/register",
    "resetpwd": "/user/resetpwd",
    "user_account": "/user/myaccount/",
    "post_create": "/post/create"
  },
  "app":{
    "route": {
      "login": "/login",
      "register": "/register",
      "forgotpwd": "/forgotpwd",
      "resetpwd": "/resetpwd",
      "my_account": "/myaccount",
      "post": "/post",
      "my_posts": "/myposts",
      "edit_post": "/edit/post" 
    }
  }
}
