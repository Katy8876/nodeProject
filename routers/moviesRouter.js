const router = require("express").Router();
const verifyToken = require("../utils/verifyToken");
const sessionLogModel = require("../models/SessionLogModel");

const movieBl = require("../bl`s/movieBl");
const jFileUtil=require("../utils/jsonFileUtil")

//middleware
router.use(verifyToken, async (req, res, next) => {
    try {
        await sessionLogModel.create({
            userId: req.session.user.userId,
            username:req.session.user.username,
            route: req.originalUrl,
            method: req.method
        });
        const sessionLogs = await sessionLogModel.find({ userId: req.session.user.userId });
        let flag="";
        try{
             flag = await jFileUtil.saveData(sessionLogs[sessionLogs.length-1])
        }catch(error){
            res.send("json FAIL "+error.message)
        }
        if (flag=="User has more than 10 activities, logged out!")
            {
               res.send("User logged out due to excess activity")
             }
        else{
             next();
        }
    } catch (error) {
        res.send(error.message)
    }
})     
router.get("/movies", async (req, res) => {
    let response= await movieBl.getAllMovies();
    res.send(response);
});

router.get("/movies/:id", async (req, res) => {
    let{id}=req.params
    let response=await movieBl.getMoviesForUser(id)
    res.send(response)
});

router.post("/movie", async (req, res) => {
    let movieData = req.body;
    let response = await movieBl.movieCreate(movieData,req);
    res.send(response);
});

router.put("/movie/:id", async (req, res) => {
    //id = movieId
    let{id}=req.params
    const movieData=req.body;
    let response=await movieBl.updateMovieById(id,movieData)
    res.send(response)
});

router.delete("/movie/:id",async(req,res)=>{
    let{id}=req.params
    let response=await movieBl.deleteMovie(id)
    res.send(response)
}) 

module.exports = router;