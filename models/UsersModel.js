const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    "username": {
        type: String,
        require: true,
        unique: true
    },
    "password": {
        type: String,
        require: true,
    },
    "firstname": {
        type: String,
        require: true,
     },
    "lastname": {
        type: String,
        require: true,
    },
    "age": {
        type: Number,
        require: true,
    },
    "email": {
        type: String,
        require: true,
        unique : true
    },
    "userId": {
        type: Number,    
    },
    "userActivitiesNum": {
        type: Number,
        default: 0
    },

}, {
    versionKey: false
});

const UserModel = mongoose.model("user", UserSchema, "users");

module.exports = UserModel;