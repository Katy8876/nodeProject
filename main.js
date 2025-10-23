const express = require("express");
const session = require("express-session");
const mongoStore = require("connect-mongo");

const authRouter = require("./routers/authRouter")
const trackRouter = require("./routers/trackRouter")
const moviesRouter = require("./routers/moviesRouter")
const usersRouter = require("./routers/usersRouter")

require("dotenv").config()
const app = express();
require("./configs/connectDB")();

app.use(express.json());
app.use(require("cors")());
//set the session

app.use(session({
    secret: "SHH_SECTER_COOKIE_KEY",
    resave: false,
    saveUninitialized: false,
    name: "myCookie",
    store: mongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        collectionName: "sessions",
        ttl: 60 * 60 //regular seconds!!!
    }),
    cookie: {
        //maxAge: 1000 * 60 * 30 //set to 30 min
        maxAge:   1000 * 60 * 30 //set to 30 min
    },
    rolling: true
}));

app.get("/", (req, res) => {
    res.send("Server is Online!")
});

app.use("/api/auth", authRouter)    //post 
app.use("/api/track", trackRouter)   //get
app.use("/api/trackUser", usersRouter)
app.use("/api/trackMovie", moviesRouter)



app.listen(process.env.PORT, () => {
    console.log("Server is runing...PORT :" ,process.env.PORT)
});