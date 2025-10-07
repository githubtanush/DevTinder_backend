const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation"); 
const bcrypt = require("bcrypt");
const user = require("./models/user");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());
//Signup API
app.post("/signup",async (req,res) =>{
    
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
app.post("/login" ,async (req,res) =>{
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

//Profile API
app.get("/profile",userAuth, async (req, res) => {
  try {
    //now after attaching middleware we will do some redundant things in this 
    //we will comment this things
    // const { token } = req.cookies; 

    // if (!token) throw new Error("Invalid Credentials");

    // const decodedmessage = jwt.verify(token, "Tanush@123");
    // const { _id } = decodedmessage;
    // console.log("Logged in user is:", _id);

    // const user = await User.findById(_id);
    const user = req.user;
    // if (!user) throw new Error("User does not exist");

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//send connection Request
app.post("/sendConnectionRequest",userAuth,async (req,res) => {
    const user = req.user;
    //Sending a connection Request
    console.log("Sending a connection Request!!");

    // res.send("Connection Request Sent !!!");
    res.send(user.firstName + " sent the connection request!!");
})


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

//update data of the user
app.patch("/user/:userId", async (req,res) =>{
    // const userId = req.body.userId;
    //write ? with params as it is good practice if my code fails then this 
    //link does not fail
    const userId = req.params?.userId;
    const data = req.body;

    
    try{
        const ALLOWED_UPDATES = [
            "firstName",
            "lastName",
            "skills",
            "age"
        ];
        // const users = await User.findByIdAndUpdate({_id : userId},data,{
        //     returnDocument : "before"
        // });
        // console.log(users);
        const isUpdateAllowed = Object.keys(data).every((k) =>
        ALLOWED_UPDATES.includes(k)
        );

    if(!isUpdateAllowed){
       throw new Error("Update not allowed");
    }
    if(data?.skills.length > 30) 
        throw new Error("Too much load");

    const users = await User.findByIdAndUpdate({_id : userId},data,{
            runValidators: true,
            returnDocument: "after"
    }
    );
        res.send("User Updated successfully");
    }catch(err){
        res.status(400).send("Update failed : "+ err.message);
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