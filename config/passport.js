var JwtStrategy = require('passport-jwt').Strategy;  
var ExtractJwt = require('passport-jwt').ExtractJwt;  
var userService = require('services/user.service');
var config = require('./config.json');

// Setup work and export for the JWT passport strategy
module.exports = function(passport) {  
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.secret;
  
  var strategy = new JwtStrategy(opts, function(jwt_payload, done) {
    userService.getById(jwt_payload.id)
        .then(function (user) {
            if (user) { 
                done(null, user);
            } else {
                done(null, false);
            }
        })
        .catch(function (err) {
            res.status(400).send({'status': 'error', 'response': err});
        });
  });

  passport.use(strategy);
};