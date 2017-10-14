const JwtStrategy = require('passport-jwt').Strategy;  
const ExtractJwt  = require('passport-jwt').ExtractJwt;  
const userService = require('api/models/user');
const config      = require('./config');

// Setup work and export for the JWT passport strategy
module.exports  = function(passport) {  
  let opts            = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey    = config.session_secret;

  const strategy      = new JwtStrategy(opts, function(jwt_payload, done) {
    userService.getById(jwt_payload.id)
      .then(function (user) {
        if (user) { 
          done(null, user);
        } else {
          done(null, false);
        }
      })
      .catch(function (err) {
        res.send({ 'status': 0, 'response': err });
      });
  });

  passport.use(strategy);
};