const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
require("./utils/connectdb");

require("./strategies/JwtStrategy");
require("./strategies/LocalStrategy");
require("./authenticate");

const userRouter = require("./routes/userRoute");
const movieRouter = require("./routes/movieRoute");

const app = express();

app.use(bodyParser.urlencoded( {extended: true} ));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

const whitelist = process.env.WHITELISTED_DOMAINS ? process.env.WHITELISTED_DOMAINS.split(','): [];

const corsOptions = {
    origin: function (origin,callback) {
        if(!origin || whitelist.indexOf(origin) !== 1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },

    credentials: true,
}

app.use(cors(corsOptions));

app.use(passport.initialize());

//routes
app.use("/users", userRouter);
app.use("/movies", movieRouter);

app.get('/', (req,res)=> {
    res.send({status: "success"});
});


//start server at port 8081
const server = app.listen(process.env.PORT || 8081 , ()=> {
    const port = server.address().port

    console.log("App started at port: ",port);
});


