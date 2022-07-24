const dotEnv = require('dotenv');
dotEnv.config();
const express = require('express');
const port = process.env.PORT || 3000;

const db = require('./config/mongoose');  //mongoose setup
const session = require('express-session'); //used for session-cookie
const customMware = require('./config/middleware'); //using locally created middleware

//require passport and local startegy that we have set-in
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

//require mongostore to store the session-cookie in db
const MongoStore = require('connect-mongo');

const app = express();

const path = require('path');  //using path module
const flash = require('connect-flash');  //using this to send flash messages to frontend
app.set('view engine','ejs'); //setting view engine as ejs
app.set('views',path.join(__dirname,'views'));  //setting the path from which views will be rendered

//setting up the session
app.use(session({
    name: 'habitTracker',
    secret: 'timBerners',
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge: (1000*60*60)
    },
    store: MongoStore.create({  //setup mongostore to save the session-cookie in db
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost/habit_tracker_db',
        autoRemove: 'disabled'
    })
}));

app.use(passport.initialize());  //initializing passport
app.use(passport.session());     
app.use(passport.setAuthenticatedUser);  //setting data of current authenticated user in 'req.user'
app.use(flash());   //calling flash
app.use(customMware.setFlash);   //using custom middleware to set the flash to locals

app.use(express.static('assets'));    //accesing static files from assets folder
app.use(express.urlencoded({extended: true}));  //using parser to read form data

app.use('/',require('./routes/index'));   //redirecting all the routes starting with '/' to the routes folder

app.listen(port,function(err){            //binding and listen on port 8000
    if(err){console.log('Error in running server');return;}
    console.log("Express server is up and running on port",port);
    return;
});



