const UserModel = require("../models/UsersModel");
const MovieModel = require("../models/MoviesModel");
const SessionsModel = require("../models/SessionLogModel");

const movieBl = require("../bl`s/movieBl");
const jFileUtil=require("../utils/jsonFileUtil")
const jfile = require("jsonfile");
//const usersPath = "C:/Users/Katy/OneDrive - lyey0943/שולחן העבודה/Fullstack Ashdod/NODEJSPROJECT/users.json";
const usersPath = "./data/users.json";

const getAllUsers = () => {
    try {
        return UserModel.find({});
    } catch (error) {
        return "Error reading Data from DB: "
         + error.message
    }
}

const deleteUser = async (userId) => {
    try {
        let user = await UserModel.findOne({ userId });
        if (user) {
            try {
                let allMovies=await movieBl.getAllMovies();
                if (allMovies.length == 0) {
                    console.log("no movies in DB")
                }else{
                    let filteredMovies = allMovies.filter(x => x.userId != userId);
                    if (filteredMovies.length < allMovies.length) {
                        await MovieModel.deleteMany({userId})
                        console.log("movies of user: " + userId + " deleted!")
                    }
                }    
                const usersActivityJson=await jFileUtil.getData();
                let filteredUsersActivity=usersActivityJson.filter(x => x.userId != userId);
                if (filteredUsersActivity.length < usersActivityJson.length) {
                  
                    await jfile.writeFile(usersPath, filteredUsersActivity);
                    console.log("users activity of user: " + userId + " deleted!")
                }
                try {
                        await UserModel.findOneAndDelete({ userId })
                        console.log("user: " + userId + " deleted!")
                        //return "User " + userId + " deleted!"

                        await SessionsModel.deleteMany({userId});
                        console.log("sessions of user: " + userId + " deleted!")
                        return "User " + userId + " deleted!"
                } catch (error) {
                    return `Error: can not delete user : ${userId}`
                }
            } catch (error) {
                return "Error: can not read data from movies DB: " + error.message
            }
        } else {
            return "User Not Found! can not delete!"
        }
    } catch (error) {
        return error.message
    }
}

module.exports = {
     deleteUser,getAllUsers
}
