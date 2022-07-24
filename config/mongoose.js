const mongoose = require('mongoose');
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/habit_tracker_db'); //connect to database

const db = mongoose.connection;  //acquire the connection to check if its successful or not

let URL = "mongodb+srv://habit_tracker_db:HkmOQGnLVjuVC6Sz@cluster0.plarr2v.mongodb.net/habit_tracker_db?retryWrites=true&w=majority"


mongoose.connect(URL,{
    useNewUrlParser: true,
    // useFindAndModify: false,
    useUnifiedTopology: true
  })


db.on('error',console.error.bind(console,"error connecting to db"));  //if error

//db up and running
db.once('open',function(){
    console.log("Succefully connected to mongodb");
});

