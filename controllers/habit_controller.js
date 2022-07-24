
const Habit = require('../models/habit');
const User = require('../models/user');

//conroller to create new habit
module.exports.create = function(req,res){
    if(req.user){
        Habit.create({content: req.body.habit},function(err,newHabit){
            if(err){
                console.log("Error in creating new habit",err);
                return;
            }
            User.findById(req.user.id,function(err,user){
                if(err){
                    console.log('Error in finding the user',err);
                    return;
                }
                user.habits.push(newHabit);
                user.save();
            });
            req.flash('success','Habit Created Successfully');
            return res.redirect('back');
        });
    }
}

//controller to make the status of the day as finished
module.exports.done = function(req,res){
    if(req.user){
        let habitId = req.query.habitId;
        let date = req.query.date;

        Habit.findById(habitId,function(err,habit){
            if(err){
                console.log('Error in finding habit in done status',err);
                return;
            }
            habit.currentStatus.push({date: date,state:'finished'});
            habit.save();
            req.flash('success','Habit Finished');
            return res.redirect('back');
        });
    }
}

//controller to make the status of the day as not finished
module.exports.undone = function(req,res){
    if(req.user){
        let habitId = req.query.habitId;
        let date = req.query.date;

        Habit.findById(habitId,function(err,habit){
            if(err){
                console.log('error in finding habit in undone status',err);
                return;
            }
            habit.currentStatus.push({date: date, state:'unfinished'});
            habit.save();
            req.flash('success','Habit not Finished');
            return res.redirect('back');
        });
    }
}

//controller to delete the habit
module.exports.delete = function(req,res){
    if(req.user){
        User.findById(req.user._id,function(err,user){
            if(err){
                console.log("error in finding the user in deleting habit",err);
                return;
            }
            let habitIndex = user.habits.indexOf(req.query.habitId);
            user.habits.splice(habitIndex, 1);
            user.save();

            Habit.findByIdAndDelete(req.query.habitId,function(err){
                if(err){
                    console.log("error in deleting the habit",err);
                    return;
                }
            });
            req.flash('success','Habit Deleted Successfully');
            return res.redirect('back');
        });
    }
}

//controller to add the habit as a favourite
module.exports.addFavourite = function(req,res){
    if(req.user){
        Habit.findById(req.query.habitId,function(err,habit){
            if(err){
                console.log('Error in finding habit in adding favourites',err);
                return;
            }

            habit.favourite = true;
            habit.save();
            req.flash('success','Habit added as Favourite');
            return res.redirect('back');
        });
    }
}

//controller to remove the habit from favourite
module.exports.removeFavourite = function(req,res){
    if(req.user){
        Habit.findById(req.query.habitId,function(err,habit){
            if(err){
                console.log('Error in finding habit in adding favourites',err);
                return;
            }
            habit.favourite = false;
            habit.save();
            req.flash('success','Habit Removed from Favourite');
            return res.redirect('back');
        });
    }
}