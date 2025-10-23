const router = require("express").Router();
const authBl = require("../bl`s/authBl")

router.post("/register", async (req, res) => {
    try{
        let userData = req.body;
        let response = await authBl.register(userData);
        res.send(response)
    }
    catch(error){
        return "error router.post" + error.message
    }    
});
router.post("/login", async (req, res) => {
    let userData = req.body;
    let response = await authBl.login(userData);
    req.session.user = {
        userId: response.userId,
        token:response.token
    }
    if (response.token) {
         res.send(response.token)
    }
    else{
        res.send(response)
    }   
});

module.exports = router;

/*
router.post("/logout", async (req, res) => {   
    let userData = req.body;
    let response = await authBl.logout(userData);
    req.session.user = {
        userId: response.userId,
        token:response.token
    }
    res.send(response.token)
});

router.get("/admin", async (req, res) => {
      let response= await authBl.admin();
      res.send(response.token)
});


*/

