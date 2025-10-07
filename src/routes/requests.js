const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

//send connection Request
requestRouter.post("/sendConnectionRequest",userAuth,async (req,res) => {
    const user = req.user;
    //Sending a connection Request
    console.log("Sending a connection Request!!");

    // res.send("Connection Request Sent !!!");
    res.send(user.firstName + " sent the connection request!!");
})


module.exports = requestRouter;