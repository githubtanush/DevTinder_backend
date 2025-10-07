const express = require('express');
const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validation"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const user = require("../models/user");
// authRouter.get('/')

// app.use() is same as router.use() there is almost no difference 
//Signup API
authRouter.post("/signup",async (req,res) =>{
    
    // console.log(req.body);
    //Creating a new user instance of the user model
    // const user = new User({
    //     firstName:"Tanush",
    //     lastName:"Arora",
    //     emailId:"tanush935@gmail.com",
    //     password:"tanush@123",
    // });
    // const user = new User(req.body);

    try{
        //Validation of data
        validateSignUpData(req);

        const {firstName, lastName , emailId } = req.body;
        //Encrypt the password
        const { password } = req.body;
        //very famous npm package for hashing the password called bcrypt
        const passwordHash = await bcrypt.hash(password,10);
        console.log(passwordHash);

        //Creating a new user instance of the user model
        // const user = new User(req.body);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash
        });

        await user.save();
        res.send("User Added Successfully");
    }catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
});

//Login API
authRouter.post("/login" ,async (req,res) =>{
    try{
        const {emailId ,password} = req.body;
        const users = await User.findOne({emailId:emailId});
        if(!users) throw new Error("Invalid Credentials!!");
        //bcrypt.compare(plainpassword,passwordhash)
        // const isPasswordValid = bcrypt.compare("Joker$123","$2b$10$Ltc/7LwMhxSHsShPS4Jh9OmNfLdPLgEorB5yqrKhO.FLi2.TM5sD.")
        // const isPasswordValid = await bcrypt.compare(password,users.password);
        const isPasswordValid = await users.validatePassword(password);
        if(isPasswordValid){
            // //JWT token
            //No problem with this code but create this method near to userschema 
            //to attached it with userschema 
            // const token = await jwt.sign({_id: users._id},"Tanush@123",{
            //     expiresIn : "1h",
            // });
            // console.log(token);

            //Add the token to cookie and send the response back to the user
            // res.cookie("token","82349824284294jdhfsjhffsifjs");
            // res.cookie(token);
            const token = await users.getJWT();
            res.cookie("token", token, {
            httpOnly: true,
            sameSite: "Lax",
            expires: new Date(Date.now() + 8 * 360000),
            });
            res.send("Login Successfull!!!");
        }
        else throw new Error("Invalid Credentials!!");

    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
})

authRouter.post("/logout",async (req,res) =>{
    //and one more thing in this there is no need to write in 
    //try catch block as we log out the cookie is expired means profile api will not work
    try{
        res.cookie("token",null,{
            expires: new Date(Date.now())
        })
        .send("User Logged out successfully");
    }catch(err){
        res.status(400).send("ERROR : "+ err.message);
    }
})

module.exports = authRouter;