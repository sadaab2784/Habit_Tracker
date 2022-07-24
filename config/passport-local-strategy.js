const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;  

const User = require('../models/user'); //importing user model

//need to tell the passport to use this local strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
},function(req,email,password,done){
    User.findOne({email: email},function(err,user){
        if(err){
            req.flash('error','Invalid Username or Password');
            // console.log("error in finding the user",err);return done(err);
        }

        if(!user || user.password != password){
            req.flash('error','Invalid Username or Password');
            // console.log("Invalid Username or password");
            return done(null,false);
        }

        //if user is found
        return done(null,user);
    });
}));

//serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user,done){
    done(null,user.id);
});

//deserializing the user from the key in cookies
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){console.log("error in finding the user",err);return done(err);}

        return done(null,user);
    });
});

passport.checkAuthentication = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }

    next();
}

module.exports = passport;
