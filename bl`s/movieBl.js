const UserModel = require("../models/UsersModel");
const MovieModel = require("../models/MoviesModel");
const SessionsModel = require("../models/SessionLogModel");

const getAllMovies = () => {
    console.log("getAllMovies Function");
    try {
        return MovieModel.find({});
    } catch (error) {
        return "Error reading Data from DB: " 
        + error.message
    }
}
const getMoviesForUser = async(userId) => {
        try {
            let movies = await MovieModel.find({ userId });
            if (movies.length>0) {
                return movies
            } else {
                return "No movies for this user! "
            }
        } catch (error) {
            return "Error reading Data from DB: " + error.message
        }
}
/*  {
    "moviename":"m2",
    "premieredate": "222",
    "director":"d2",
    "movielength":"2000",
    "moviepic":"pic2"
}                                */
const movieCreate = async (movieData,req) => {
     try {
          let allMovies=await getAllMovies()
          if (allMovies.length>0){
            movieData.movieId=allMovies[allMovies.length-1].movieId+1
          }
          else{
             movieData.movieId=1;
          }
          movieData.userId =req.session.user.userId;
          let newMovieDocument = new MovieModel(movieData);
               await newMovieDocument.save();
                return "Movie Created!"
       } catch (error) {
                return error.message
         }
 }

const deleteMovie = async (movieId) => {
    try {
        let allMovies=await getAllMovies();
        let newmovie = allMovies.filter(x => x.movieId == movieId);
        let movie=await MovieModel.findOne({movieId})

        if(newmovie.length>0){
              await MovieModel.findOneAndDelete({movieId})
               return "movie " +movieId+ " deleted!"
        }else{
              return "movie " +movieId+ " Does not exist"

        }       
    } catch (error) {
        return "Cannot delete movie : " + movieId + " " + error.message
    }
}
/*
{
        "moviename": "m44",
        "premieredate": "0221-12-31T21:39:06.000Z",
        "director": "d2555",
        "movielength": "55555",
        "moviepic": "pic5"
    }                                */
const updateMovieById = async (movieId,movieData) => {
    try {
        let allMovies=await getAllMovies();
       let newmovie = allMovies.filter(x => x.movieId == movieId);
        if(newmovie.length==0){
            return "movie " +movieId+ " Does not exist"
        }else{
            await MovieModel.findByIdAndUpdate(newmovie[0]._id,movieData)
            return "movie " +movieId+ " updated"
        }
    } catch (error) {
        return "Cannot update  movie : " + movieId + " " + error.message
    }
}

module.exports = {
    movieCreate,getAllMovies,deleteMovie,updateMovieById,
    getMoviesForUser    
}
