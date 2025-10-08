const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);

//GET user by email
app.get("/user",async (req,res) =>{
    const userEmail = req.body.emailId;
    try{
        const users = await User.find({emailId : userEmail}).exec();
        if(users.length === 0){
            res.status(404).send("User not found");
        }else{
            console.log(userEmail );
            res.send(users);
        }
    }catch(err){
        res.status(400).send("Something went wrong");
    }
})

//get all the users from the database
app.get("/feed",async (req,res) =>{
    try{
        const users = await User.find({});
        res.send(users);
    } catch(err){
        res.status(400).send("Something went wrong");
    }
});

//delete user from the database
app.delete("/user",async (req,res) =>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("user deleted successfully");
    }catch(err){
        res.status(400).send("Something went wrong");
    }
});

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