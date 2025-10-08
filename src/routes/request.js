const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require('../models/connectionRequest');
const { connect } = require('mongoose');
const User = require("../models/user")

//send connection Request
// requestRouter.post("/sendConnectionRequest",userAuth,async (req,res) => {
//     const user = req.user;
//     //Sending a connection Request
//     console.log("Sending a connection Request!!");

//     // res.send("Connection Request Sent !!!");
//     res.send(user.firstName + " sent the connection request!!");
// })
requestRouter.post("/request/send/:status/:toUserId",userAuth, async (req,res) =>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["interested","ignored"];
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({message : "Invalid status type : " + status});
        }

        //if user is not available then why send the request
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({ message : "user not found" });
        }
        
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId},
            ],
        });
        if(existingConnectionRequest){
            return res
                .status(400)
                .send({message : "Connection Request Already Exists!!!"});
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();

        res.json({
            message : "Connection Request sent succesfully!",
            data,
        });
         
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
    // res.send(user.firstName + " sent the connection request!!!");

})

// requestRouter.post("/request/review/accepted/:requestId" ,userAuth, (req,res) =>{
    
// })
// requestRouter.post("/request/review/rejected/:requestId" ,userAuth, (req,res) =>{
    
// })

module.exports = requestRouter;