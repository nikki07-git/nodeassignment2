const express = require('express');  
const app = express();

// const session=require('express-session')
const jwt=require("./libs/jwt")


app.set("view engine","ejs")

// app.use(session({
//     secret:'secret',
//     resave:'false',
//     saveUninitialized:'false'
// }));

app.use(express.urlencoded({ extended: true }));
require("dotenv").config();

const morgan=require("morgan")
app.use(morgan("combine"))
const helmet=require("helmet")
app.use(helmet())

app.get("/login",(req,res)=>{
    res.render("login");
})
// app.post("/login",(req,res)=>{
//     if(req.body.username=="user1" && req.body.password=="pass"){
//         req.session.username=req.body.username;
//         req.session.loggedin=true;
//         res.status(200).send("Auth seccess")
//     }
//     else
//     {
//         res.status(401).send("Not authorized")
//     }
// });

// function validate_session(req,res,next)
// {
//     if(req.session.loggedin==true)
//     {
//         next()
//     }
//     else
//     return res.status(401).send("Not authorized")
// }

app.get("/gettoken",jwt.create_token)

const BookRoute=require("./routes/BookRoute")
app.use("/books",jwt.verify_token,BookRoute)


app.listen(8000);


