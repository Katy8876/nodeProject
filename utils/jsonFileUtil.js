const jfile = require("jsonfile");
const authBl = require("../bl`s/authBl");

const sessionLogModel = require("../models/SessionLogModel");
const UserModel = require("../models/UsersModel");

//CRUD -> CREATE , READ , UPDATE , DELETE

const usersPath = "C:/Users/Katy/OneDrive - lyey0943/שולחן העבודה/Fullstack Ashdod/NODEJSPROJECT/users.json";
class SessionLog {
    constructor(_id, userId, route, method, timeStamp, fileId, userActivitiesNum) {
        this._id = _id;
        this.userId = userId;
        this.route = route;
        this.method = method;
        this.timeStamp = timeStamp;
        this.fileId = fileId;
        this.userActivitiesNum = userActivitiesNum;
    }
}
const saveData = async (newUser,req,res,next) => {
    let newSessionLog = new SessionLog( 
            _id=newUser._id,            
            userId=newUser.userId,
            route=newUser.route,
            method=newUser.method,
            timeStamp=newUser.timeStamp,
            fileId=newUser.fileId,
            userActivitiesNum=newUser.userActivitiesNum
    );
    let data = await getData();
    
    if(data.length> 0 ){      
       newSessionLog.fileId = data[data.length - 1].fileId + 1;
       const user= await UserModel.findOne(
            { userId: newSessionLog.userId });
       newUserActivitiesNum = user.userActivitiesNum+1;
       if (newUserActivitiesNum > 10) {
              console.log( "User has more than 10 activities, logged out!");
              return "User has more than 10 activities, logged out!";
            }
       // less then 10 activities 
       else{
            currentUserActivities=data.filter(x => x.userId == newSessionLog.userId);
            todayActivities=currentUserActivities.filter(x => x.timeStamp.includes(new Date().getDate()));

            if (todayActivities.length > 1) { // Checks whether a day has passed between the user's last two actions.
                let nextToLastActivityTime = todayActivities[todayActivities.length - 2].timeStamp;
                let lastActivityTime = todayActivities[todayActivities.length - 1].timeStamp;
                function parseCustomDate(str) {
                    // struct like ::: "16.8.2025, 20:39:24"
                    const [datePart, timePart] = str.split(', ');
                    const [day, month, year] = datePart.split('.').map(Number);
                    const [hour, minute, second] = timePart.split(':').map(Number);
                    return new Date(year, month - 1, day, hour, minute, second);
                  }

                let date1 = parseCustomDate(nextToLastActivityTime);
                let date2 = parseCustomDate(lastActivityTime);
                let diffMs = date2 - date1; // milliseconds
                let diffMinutes = diffMs / (1000 * 60); // minutes
                let diffHours = diffMinutes / 60; // hours
                let diffDays = diffMs / (1000 * 60 * 60 * 24); // days
                if (diffDays >= 1) {
                    // If more than a day has passed, reset the user's activity count
                   console.log("You had only ", newUserActivitiesNum, " activities in the last 24 hours");
                   console.log("today you will have : ", newUserActivitiesNum + 10 ,"  activities");
                   newUserActivitiesNum=newUserActivitiesNum-10;
                 }
             }   //end if currentUserActivities.length > 2

            await UserModel.updateOne(
             { userId: newSessionLog.userId }, // filter
             { $set: { userActivitiesNum:   newUserActivitiesNum}} // update
             );
            data.push(newSessionLog);
            try{
                    await jfile.writeFile(usersPath, data);
                    return "New activity Saved!";
            }catch(error){
                    return  "can't write to the file !"+error.message;
            }
       }
    }
      // first save to user data 
    else{
       newSessionLog.fileId = 1;
       await UserModel.updateOne(
            { userId: newSessionLog.userId }, // filter
            { $set: { userActivitiesNum: 1  }} // update
        );
        data=[newSessionLog]
        try{
            await jfile.writeFile(usersPath, data);
            return "First activity Saved!";
         }catch(error){
             return  "can't write to the file !"+error.message;
          }
     }
}

const getData = async () => {
    let data = await jfile.readFile(usersPath);
    return data
}

const getUserTime=async() => {
    let data = await jfile.readFile(usersPath);
    let time=data.map(x => x.timeStamp);
    
    let first = new Date(time[0]);
    let last = new Date(time[time.length - 1]);

    // הפרש במילישניות
    let diffMs = last - first;

    // הפרש בדקות
    let diffMinutes = diffMs / (1000 * 60);

    if (data.length <= 10) {
        console.log("you have less then 10 Activities in the last 24 hours")
        console.log("you have  ",data.length,"  activities in the last 24 hours")
    }else{
        console.log("you have more then 10 Activities in the last 24 hours")
        console.log("you have  ",data.length,"  activities in the last 24 hours")
        console.log("the system will log you out ")
        let userData ={
            "username":"u1",
            "password": "111"
        } 
    }
    console.log("jFile DATA ",time);
    timeLength=(time[time.length-1])-(time[0]);
    console.log("jFile DATA length ",timeLength);
    return time
}


const getDataById = async (id) => {
    let data = await jfile.readFile(usersPath);
    if(data.length>0){
        let user = data.filter(x => x.userId == id)    
        if (user) {
            return user;
        } else {
            return "Sorry the user was not found! please check the provided ID :-)"
        }
     }else{
            return "Sorry there are no activities for this User :-)"
     }
}


const getLastUser = async () => {
    let data = await jfile.readFile(usersPath);
    let user = data.find(x => x.id == data.length);
    if (user) {
        return user;
    } else {
        return "Sorry the Last User was not found  :-)"
    }
}

module.exports = {
    getData,
    getDataById,
    saveData,
    getLastUser,
    getUserTime
}