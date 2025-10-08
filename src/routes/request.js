const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require('../models/connectionRequest');
const { connect } = require('mongoose');
const User = require("../models/user");
const connectionRequestModel = require('../models/connectionRequest');

// POST API MEANS USER CAN ENTER SOME DATA IN THE DATABASE MEANS I WILL VERIFY EACH AND EVERYTHING IN 
//THE DATABASE BECAUSE HACKER CAN DO ANYTHING IN THE POST API
// GET API MEANS USER CAN FETCHING SOME INFORMATION ON THE DATABASE MEANS GET API WE WILL ENSURE THAT 
//WE WILL SENDING THE DATA WHICH IS CORRECT FOR USER

//SO BECAUSE THE DATA IS VERY IMPORTANT AS DATA IS THE OIL AND DATA LEAK IS VERY DANGEROUS 
//THAT'S WHY WE ALWAYS ENSURE WHAT IS SENDING BACK TO USER IN GET APIs
//THAT'S WHY ALSO WE ENSURE WHAT IS WRITING USING POST APIs

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
            // message : "Connection Request sent succesfully!",
            message: req.user.firstName +" is " + status + " in " + toUser.firstName,
            data,
        });
         
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
    // res.send(user.firstName + " sent the connection request!!!");

})

requestRouter.post("/request/review/:status/:requestId" , userAuth ,async (req,res) =>{
    //ms dhoni => Elon 
    //is elon loggedIn => toUserId
    //status = interested
    //requestId should be valid 
    try{
        const loggedInUser = req.user;
        const { status, requestId } = req.params;
        //validate the status 
        const allowedStatus = ["accepted","rejected"];

        if(!allowedStatus.includes(status)){
           return res.status(400).json({message : "Status not allowed!!!" });
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            toUserId : loggedInUser._id,
            status : "interested",
        });

    if(!connectionRequest){
        return res
            .status(404)
            .json({message : "connection request not found"});
    }

    connectionRequest.status = status;
        
    const data = await connectionRequest.save();

    res.json({message : "Connection Request " + status, data});
    }catch(err){
        res.send("ERROR : " + err.message);
    }
})


module.exports = requestRouter;