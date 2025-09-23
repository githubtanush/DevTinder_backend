const express = require("express");
const app = express();
app.use("/user",(req,res)=>{
    //Route handler
    // res.send("Route handler 1");
    //if we don't send the response back then we hanging there 
    console.log("handling the route user!!!")
    res.send("Response!!!");
},
//multiple route handlers in single one 
(req,res)=>{
console.log("Handling the route user2!!!")
res.send("2nd Response!!!");
})
app.listen(3000,()=>{
    console.log("Server is successfully running on port 3000 .....");
})