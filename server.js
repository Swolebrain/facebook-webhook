var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var VALIDATION_TOKEN = "thuglife";
//page access token
//EAAKGIvwZCSs8BAA2OvgZBIgGt6snsH2LZAyCec9OA81OZCQampWBvdIKeCirrVfRYOV0k4xoTGwZCkyXRvqDJD4CchxbEuauG9ohyvJSpVAsth5NBbYu9urBkgen8nMOdrv3qOSV6PjcgbKaZB4x6dlEHr5POxZApomYqsJw5lLJwZDZD

app.use(bodyParser.json()); //middleware

app.get("/", function(req,res){
  res.end("This is the home page");
});

app.post('/webhook', function (req, res) {
  var data = req.body;

  if (data.object == 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach(function(pageEntry) {
      var pageID = pageEntry.id;
      var timeOfEvent = pageEntry.time;
      
      // Iterate over each messaging event
      pageEntry.messaging.forEach(function(messagingEvent) {
        if (messagingEvent.message) {
          if ( detectAnger(messagingEvent.message.text)  ){
            console.log("received angry message!!");
            //here we could send an email or sms
          }
        }else{
          console.log("Received some kind of messaging event that wasn't a message");
          console.log(messagingEvent);
        }
      });
    });
    res.sendStatus(200);
  }
});

app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === VALIDATION_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server running");
});


function detectAnger(str){
  str = str.toLowerCase();
  if (str.indexOf("mierda") >= 0 || str.indexOf("fuck") >= 0 ||
      str.indexOf("shit") >=0){
        return true;
  }
  else{
    return false;
  }
}
