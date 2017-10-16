module.exports = {
  "api": {
    "route": {
      "user"              : "/user",
      "post"              : "/post",
      "user_authenticate" : "/authenticate",
      "user_register"     : "/register",
      "user_resetpwd"     : "/resetpwd",
      "user_myaccount"    : "/myaccount",
      "post_create"       : "/create",
      "post_detail"       : "/detail",
      "post_edit"         : "/edit",
      "post_user"         : "/user",
      "all_posts"         : "/all"
    },
    "link": {
      "login"             : "/user/authenticate/",
      "register"          : "/user/register/",
      "resetpwd"          : "/user/resetpwd",
      "user_account"      : "/user/myaccount/",
      "all_posts"         : "/post/all/",
      "user_post"         : "/post/user/",
      "create_post"       : "/post/create/",
      "get_post"          : "/post/detail/",
      "edit_post"         : "/post/edit/",
      "delete_post"       : "/post/"
    }
  },
  "app":{
    "link":{
      "login": "/login/",
      "register": "/register/",
      "forgotpwd": "/forgotpwd/",
      "resetpwd": "/resetpwd/",
      "home": "/",
      "my_account": "/myaccount/",
      "post": "/post/",
      "my_posts": "/myposts/",
      "edit_post": "/post/edit/",
      "create_post": "/post/create/",
      "rss": "/rss",
      "public_rss_url": "https://www.wired.com/feed/category/business/latest/rss"
    }
  }
}
