const jwt = require("jsonwebtoken");


module.exports = verifyToken = (req, res, next) => {
    const token1 = req.headers["x-access-token"];
    if (!token1) return res.send("Token not provided!");
    if (req.session.user.token!=token1) return res.send("Token is not valid");
   // if (process.env.TOKEN_KEY==token)
    try {
        jwt.verify(token1, process.env.TOKEN_KEY);
        next() //means to move on with the logic!
    } catch (error) {
        res.send("error with token verification: " + error.message);
    }
}

