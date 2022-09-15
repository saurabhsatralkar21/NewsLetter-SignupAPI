const mailchimp = require("@mailchimp/mailchimp_marketing");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

//Make use of body-parser to get the data from the form into this js file
app.use(bodyParser.urlencoded({extended:true}));

//Import the external css file from the public folder
app.use(express.static("public"));

//Listen on port 3000 for the server running
//Changed the port to process.env.PORT so that Heroku can assign a port for us
app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running");
});

//Send the signup.html file to the client browser
app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

//Setting up mailchimp

mailchimp.setConfig({
  apiKey: "0c721ff6f6f29355be9be5d2d1fdefbd-us8",
  server: "us8"
});

app.post("/",function(req, res){
  const firstName = req.body.FirstName;
  const lastName = req.body.LastName;
  const email = req.body.EmailAddress;

  const listID = "263f74041c"; // Add mailchimp list id here

  //Create an object with the user data
    const subscribingUser = {
      firstName: firstName,
      lastName: lastName,
      email: email
    };

    //Upload the data to the server
    async function run(){
      const response = await mailchimp.lists.addListMember(listID,{
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      });

      //If everything is alreight, add contact to the list
      res.sendFile(__dirname + "/success.html");
      console.log("Contact added successfully. The contact id is "+ response.id);

    }

    //run the function to catch the errors if anonymou
    run().catch(e => res.sendFile(__dirname+"/failure.html"));


});

app.post("/failure",function(req, res){
  res.redirect("/");
});

//API Key
//0c721ff6f6f29355be9be5d2d1fdefbd-us8

// List ID
// 263f74041c
