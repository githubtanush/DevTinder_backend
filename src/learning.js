//Starting point of your application 
//main core js file 
//In this file we will initialize our app 
// we will initialize our js code
//we are creating backend for devTinder
console.log("Starting a new Project!!!")
//for creating backend we need to create a server so that we listen to the user
//when u are listening then you starting the listening from user
//we will be using the famous express server from listening the server
//let's create our first server
//when we install express server something magical is happening 
//firstly node modules created and package lock.json is created 

//when we import some package then it's imported the code from internet and then it put it inside the 
//node modules

//dependency comes when i installing the express because it tells any package which your project depend on 
//project can't run without this dependency
//and all this dependencies are download in the node modules folder
//express is ok but what are all of this others folder where did this code come from
//just like our package.json in our project and it's dependency is express
//just like similar express modules also have some dependency and also have some package.json 
//package.json insider express you will find the dependencies of express . This is what the beauty of open src
//so when i installing express into my project so all the dependency of the express should also be there 
//so all this dependency also be installed
//so you understand when i download any module then there dependency should alsobe installed 
//and also if there dependency of dependencies is also installed 
//if my project is using 10-20 dependencies then 100 of dependencies is installed and if their dependency of dependency is 
//exist then they also should be download


//package.json is like the index file of the folder 
//in package.json ^ this sign called caret and what if they remove it ?
//why version are always in 4.19.2 or 1.0.0 why not 1/2/3?
//version of package
//express = "4.19.2" all of this three things represent different things 
//in this 2 represents patch 19 represents minor and 4 represents major
//whenever a project is started starting from 1.0.0
// 1.0.1  - patch(small change, bug fix)
// 1.1.1 - minor change means any version which is at same major version cannot break existing repo
// and it is safe 
// 2.1.1 - major version is changing when it is breaking the existing repositories so that everyone is say that you can do
//update very carefully
//in the dependency unlike ^ (caret) we also use ~ (tilda)
//when u do a ^4.x.x our project is automatically download any patch or minor change then they automatically be updated 
//Generally we using this ^ so that our project automatically update any patch or minor change
//by using this ~ is homework what happened?
//packagelock.json 
//difference between package.json and packagelock.json?
//To lock the version we use package lock.json 
//so in the package.json this automatically updates the version according to the current updation 
//on the other hand in package lock.json this stores the exact version in which my project is running on 
//and package.json is just telling you the nomenclature that at what version project is running

//shall we create our own server now ?
const express = require('express'); // we imported the express folder
const app = express(); //now this app is creating a new web server 

//now handling the code
//what is special in these route handler so that other route handler become ignore
//why this code overrides every other route handler what is so special in this code
//This is the special case
//anything which happened after / basically it is a wild card anything that matches after 
//the slash the route handler will manage it 
//This / route handler will manage anything 
// app.use("/",(req,res) => {
//     res.send("Namaste Tanush!!!")
// });

//now if anything /test after /hello then all managed by test
//not like that if u give /test123 will not handle 
//but if u write /test/123 will manage by route /test itself

//in the app.get method now the api call should only match to the get function
//but this route will only handle get call to /user
// .USE handle all the api calls 
// app.use("/user",(req,res) =>{
//     res.send("HAHAHAHAHA");
// })

//Advanced routing techniques
//req /user /user/1
//suppose if we put ? in front of b that means b is optional
//and if there is + instead of ? it means we write any character anytime in between
//plus means you can write anything in between will work
// if we write a(bc)?d means bc is optional 
//search on this and find the answer
// app.get("/ab\\?c",(req,res)=>{
//     res.send("Hanji!! mil gya sb kuch !!");
// })
// app.get("/.*fly$/",(req,res)=>{
//     res.send("Hanji!! mil gya sb kuch !!");
// })
app.get("/user/:userId/:name/:password",(req,res) =>{
    // console.log(req.query); 
    console.log(req.params);
    res.send({firstname : "Tanush", lastname : "Arora"});
}) 
//This route will only connect to the post call
app.post("/user",(req,res) =>{
    console.log("Save data to the database");
    res.send("Database successfully connected to the database");
})
app.delete("/user",(req,res)=>{
    res.send("Deleted Successfully!!!");
})

//This will match all the http method api calls to /test
app.use("/test",(req,res) => {
    res.send("Hello from the server!!!Namaste server jii")
});
app.use("/hello",(req,res) => {
    res.send("Hello from the server!!!Namaste server jiii")
});
app.use("/getSecretData",(req,res) => {
    res.send("Hello from the server!!!")
});
//NOTE:- the order is very very important which route handler you write first first that will handle then bottom one 
//then last one if u write /hello then it go first /hello then /test then / 
//so the order of writing the route is very important 

// app.use("/",(req,res) => {
//     res.send("Namaste Tanush!!!")
// });
//if we remove this / wildcard then it give in the browser cannot GET/ 
//browser is the worst way to test your APIs/to test your route/to test your backend code
//there is a software which is called postman a lot of companies is used this to test their route handler
//this postman application will generally used for API testing 

//now when i create the web server i listen the request 
app.listen(7777,() => {
    console.log("Server is successfully listening on port 7777.....")
}); //app is listening on that server we have create the server now over 
//there we also have a callback function 

//so again and again opening and closing the server it is very frustating so we install nodemon
// npm install -g nodemon or npm i -g nodemon where -g means global
//nodemon is very helpful as it is refresh the server by themselves