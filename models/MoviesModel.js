const mongoose = require("mongoose");


const MovieSchema = new mongoose.Schema({
    "moviename": {
        type: String,
        require: true,
        unique: true
    },  
    "movieId": {
        type: Number, 
        require: true,
        unique: true
     },
    "premieredate": {
        type: Date,
        require: true,
    },
    "director": {
        type: String,
        require: true,
     },
    "movielength": {
        type: String,
        require: true,
    },
    "moviepic": {
        type: String,
        require: true,
    },
    "userId": {
        type: Number, 
        require: true,
   
    }
}, {
    versionKey: false
});

const MovieModel = mongoose.model("movie", MovieSchema, "movies");

module.exports = MovieModel;