//declaring the modules that we gonna use
require('dotenv').config();
const express = require("express");
const bodyparser = require("body-parser");
const https = require("https");
const app = express();
//this is to use the local style sheet without this its doesn't appear
app.use(express.static(__dirname+"/public"));
//this is used to use the commands of bodyparser
app.use(bodyparser.urlencoded({extended:true}));


//when you create a server this is the first file that'll be loaded and when the user send some information of 
//request the server give to hum a html that will be sended by the function above
app.get("/", function(req, res){
    res.sendFile(__dirname+("/signup.html"))
})

//this's a part litle dificulty of the code but i'll explain when you login on API of mailchimp or whatever 
//API do you want this API need a form of get that information and this'll be sended by a JSON file that is
//basically what i've writted above but here is in a format of object javascript and when you send this to
//the api basically the javascript by himself to this for you 
app.post("/", function(req, res){
    //here a create the variables that i'll store in my object
    const firstName = req.body.name
    const lastName = req.body.Last
    const email = req.body.Email
    //here i stored the variables into the object
    const data = {
        members:[{
        email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME : firstName,
            LNAME : lastName  }
          }]
        };
    //here is the converter of javascript data in JSON is basically unmount a wardrobe a send with less volume
    const jsonData = JSON.stringify(data);
    //the locale where the emails will be sent in format of object observe that it require a id that is the
    //local where you will store your emails
    const url = process.env.URL
    //the autentication of what i'm doing observer that it has the name of autor and the key used by the API
    const options= {
        method: "POST",
        auth: process.env.AUTH
    }
    //here i send the request to chimpmail website requesting him to store the email that i'll send
    const request = https.request(url, options, function(response){

           
            //this is the data that will come as a response of mail request to mail chimp that i'll come as 
            //a JSON data and is revived by the JSON parse and then console logged 
            response.on("data", function(data){
            //const that i've create to look for errors in the send of data that is diferent of the errors of
            //the website
            const error = JSON.parse(data).error_count;
            console.log(JSON.parse(data));
            //response status code is to see if the website is running well and if it gives a 200 return that
            //mean everything is fine
                if((response.statusCode === 200) && (error === 0)){
                    res.sendFile(__dirname+("/sucess.html"));
                }else{
                    res.sendFile(__dirname+("/failure.html"));
                }          
            }
            )
    })
    //here is where i send my data to the mail chimp
    request.write(jsonData);
    request.end();
});
//this is to when you get a failure response will appear a form in the failure.htlm that will send you back
//to the root of past
app.post("/failure.html", function(req, res) {
    res.redirect("/");
})
app.listen(process.env.PORT || 3000, function(){
    console.log("Working on port 3000");
})

