var flash = require('connect-flash');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../models/User');

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({_id: id}, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({username: username}, function(err, user) {
            if(err){
                return done(err);
            }
            if(!user) {
                return done(null, false, {message: 'Incorrect Username'});
            }
            return user.comparePassword(password, function(err, isMatch){
                if(err || !isMatch){
                    return done(null, false, {message: 'Incorrect Password'});
                }
                return done(null, user);
            })

        });
    }
));

module.exports = passport;