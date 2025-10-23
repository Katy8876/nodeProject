const mongoose = require("mongoose");


const SessionLogSchema = new mongoose.Schema({
    //"userId": { type: mongoose.Types.ObjectId, ref: "User" },
    "userId":{ type: Number, ref: "User" },
    "username": { type: mongoose.Types.ObjectId, ref: "User" },
    "route": { type: String },
    "method": { type: String },
    "timeStamp": { 
                  type: String, 
                  default: () => new Date().toLocaleString("he-IL", 
                            { timeZone: "Asia/Jerusalem" })
       }
}, {
    versionKey: false
});

const SessionLogModel = mongoose.model("sessionLog", SessionLogSchema, "sessions");

module.exports = SessionLogModel;

