const express = require("express");
const connectDB = require("./config/database");
const app = express();
const {adminAuth, userAuth} = require("./middlewares/auth");
app.use('/admin',adminAuth);
app.post("/user/login", (req,res) =>{
    res.send("User logged in successfully!!!");
});
app.get("/user/data",userAuth,(req,res)=>{//check user is authenticated or not
    res.send("User data sent");
})
app.get("/admin/getAllData",(req,res) =>{
    res.send("User Data sent");
})
app.get("/admin/deleteUser",(req,res) =>{
    res.send("Deleted a User!!!");
})
app.get("/getUserData",(req,res) =>{
    try{
        //logic of DB call and getuserData
        throw new Error("dgjhfwu");
        res.send("user Data sent");
    } catch(err){
        res.status(500).send("Some error contact support team!!!");
    }
})
connectDB()
    .then(()=>{
        console.log("Database connection established ...");
    app.listen(3000,()=>{
    console.log("Server is successfully running on port 3000 .....");
    });
    })
    .catch((err) =>{
        console.error("Database cannot connected!!!!");
    })