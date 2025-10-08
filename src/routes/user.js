const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require("../models/connectionRequest");

const USER_SAFE_DATA = "firstName lastName age gender photourl about skills";

//Get all the pending connection request for loggedIn user
userRouter.get("/user/requests/received", userAuth , async (req , res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status : "interested",
         }).populate("fromUserId","firstName lastName photoUrl age gender about skills");
        // populate("fromUserId",["firstName","lastName"]);
        // populate("fromUserId") it gives all the information if we don't apply filter
        res.json({
            message : "Data Fetched Successfully",
            data : connectionRequest,
        })
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
})

userRouter.get("/user/connections",userAuth,async (req,res)=>{
        try{
            const loggedInUser = req.user;
            //Tanush => Elon => accepted
            //Elon => Mahendra singh dhoni => accepted
            const connectionRequest = await ConnectionRequest.find({
                $or:[
                    {toUserId : loggedInUser._id,status : "accepted"},
                    {fromUserId : loggedInUser._id,status : "accepted"}
                ]
            })
                .populate("fromUserId",USER_SAFE_DATA)
                .populate("toUserId",USER_SAFE_DATA);

            const data = connectionRequest.map((row) =>{ 
                if(row.fromUserId._id.toString() === loggedInUser._id.toString())
                    return row.toUserId;
                return row.fromUserId;
            });
             
            res.json({data : connectionRequest});
        }catch(err){
            res.status(400).send({message : err.message});
        }
})

module.exports = userRouter;