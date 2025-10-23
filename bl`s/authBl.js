const UserModel = require("../models/UsersModel");
const sessionLogModel = require("../models/SessionLogModel");
const jFileUtil=require("../utils/jsonFileUtil")

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/*{
    "username":"u1",
    "password": "111",
    "firstname": "f1",
    "lastname":"l1",
    "age":"11",
    "email": "katy.cherninsky.1@gmail.com"
}                                               */
const register = async (userData) => {
    try {
        let user = await UserModel.findOne(            
            { username: userData.username }); 
        if (user) return "user already exist!"
        try {
             let allUsers = await UserModel.find();
             if (allUsers.length == 0){
                    userData.userId=1;
             }else{
                    userData.userId=allUsers[allUsers.length - 1].userId + 1;
             }
            userData.password = await bcrypt.hash(userData.password, 10);
            try {
                userData.userActivitiesNum=0;
                let newUserDocument = new UserModel(userData);
                await newUserDocument.save();
                return "User Created!"
            } catch (error) {
                return "error register 1 " + error.message
            }
        } catch (error) {
            return "error register 2 " + error.message
        }
    } catch (error) {
        return "error register 3 " + error.message
    }
}
/*{
    "username":"u1",
    "password": "111"
}                      */
const login = async (userData) => {
    let { username, password } = userData;
   
    if (!username || !password) return "missing credentials!"

    try {
        let user = await UserModel.findOne({ username });
        if (user==null) {
            return "User Not Found!";
        }
        let passVer = await bcrypt.compare(password, user.password);
        if (!passVer) return "Invalid Password!";

        // Check user activity -: if user has  10 activities => check if the day has changed
        if (user.userActivitiesNum==10) {
                let data = await jFileUtil.getData();
                let currentUserActivities=data.filter(x => x.userId == user.userId);         
  
                let lastActivityTime = currentUserActivities[currentUserActivities.length - 1].timeStamp;

                function parseCustomDate(str) {
                    // struct like ::: "16.8.2025, 20:39:24"
                    const [datePart, timePart] = str.split(', ');
                    const [day, month, year] = datePart.split('.').map(Number);
                    const [hour, minute, second] = timePart.split(':').map(Number);
                    return day;
                  }
                
                const now = new Date();                           // Date object
                const formattedNow = now.toLocaleString();        //readable "string"

                let rightNow = parseCustomDate(formattedNow);
                let date2 = parseCustomDate(lastActivityTime);

                let diffDays = rightNow - date2; // day

                if (diffDays <1) {
                    // Not a day has passed - user cannot log in
                    return "You have exceeded the number of actions for this day. User is blocked!";
                   }
                else{
                    await UserModel.updateOne(
                        { username: user.username }, // filter
                        { $set: { userActivitiesNum: 0  }} // update
                    );
                    await sessionLogModel.deleteMany({ userId: user.userId });
                    console.log("User can log in");
                }               
        }
        try {            
            return {
                token: jwt.sign(
                    {
                        username
                    },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "2h"
                    }
                ),
                //userId: user._id
                userId: user.userId              
              }
        } catch (error) {
            return error.message
           }
     } catch (error) {
            return error.message
       }
}

module.exports = {
    register,
     login   
}
