const router = require("express").Router();
const verifyToken = require("../utils/verifyToken");
const sessionLogModel = require("../models/SessionLogModel");

const jFileUtil=require("../utils/jsonFileUtil")
//middleware
router.use(verifyToken, async (req, res, next) => {
     try {
        await sessionLogModel.create({
            userId: Number(req.session.user.userId),
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
        console.log("flag",flag)

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

router.get("/ping", (req, res) => {
    res.send("you got tracked!")
});

router.get("/activity", async (req, res) => {
    const sessionLogs = await sessionLogModel.find({ userId: req.session.user.userId });
    res.send(sessionLogs);
});

module.exports = router;