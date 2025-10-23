const router = require("express").Router();
const verifyToken = require("../utils/verifyToken");
const sessionLogModel = require("../models/SessionLogModel");

const usersBl = require("../bl`s/usersBl");

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
        let flag=0;
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

router.get("/users", async (req, res) => {
        try{
            let response= await usersBl.getAllUsers();
            res.send(response);
        }catch(error){
            res.send("Error getting users: " + error.message);
        }
});

router.get("/user/activtyLog/:id", async (req, res) => {
        try{
            let{id}=req.params
            let response= await jFileUtil.getDataById(id);
            console.log("this user have "+(response.length) +" actions in session" )
            res.send(response);
        }
        catch(error){
            res.send("Error getting user activity log: " + error.message);
        }
});

router.get("/user/activtyLog/",async (req, res) => {
        try{
            let response= await jFileUtil.getUserTime();
            res.send(response);
        }catch(error){
            res.send("Error getting users activity log: " + error.message);
        }
});

router.delete("/user/:id",async(req,res)=>{
    try{
        let{id}=req.params
        let response=await usersBl.deleteUser(id)
        res.send(response)
    }catch(error){
        res.send("Error deleting user: " + error.message);
    }
})  

module.exports = router;