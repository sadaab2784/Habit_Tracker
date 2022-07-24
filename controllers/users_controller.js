const User = require('../models/user');

//controller to authenticate the user and lands him on the home page
module.exports.login = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    return res.render('login');
}

//controller for creating the user on signup 
module.exports.createUser = function(req,res){
    //if password and confirm_password doesn't match
    if(req.body.password != req.body.confirm_password){
        req.flash('error','Password does not match');
        return res.redirect('back');
    }
    //if password matches,then find the user in the database with mail-id
    User.findOne({email:req.body.email},function(err,user){
        if(err){console.log("Error in finding the user",err);return;}
        //if user found then return because email should be unique
        if(user){
            req.flash('error','User Already Exist');
            return res.redirect('back');
        }
        User.create(req.body,function(err){
            if(err){console.log("error in sign-up user creation",err);return;}
            req.flash('success','Successfully Signed up');
            return res.redirect('/users/sign-in');
        });
    });
}

//for creating session
module.exports.createSession = function(req,res){
    req.flash('success','Successfully Logged in');
    return res.redirect('/');
}

//for logout
module.exports.destroySession = function(req,res){
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.flash('success','Successfully Logged out');
        return res.redirect('/users/sign-in');
    });
}