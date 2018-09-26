require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT

const sdk = require('messagemedia-messages-sdk');
const controller = sdk.MessagesController;


// Configuration parameters and credentials
sdk.Configuration.basicAuthUserName = process.env.MM_API_API_KEY; // Your API Key
sdk.Configuration.basicAuthPassword = process.env.MM_API_SECRET_KEY; // Your Secret Key


var bodyParser = require('body-parser')
app.use(bodyParser.json())


app.post('/', (req, res) => {
  console.log(req.body.test)
  res.send('success')


  if(typeof req.body.content != 'undefined') {
    const conversation_ended = req.body.metadata.end_time < Date.now() ? true : false
    console.log("Has the conversation ended? ", conversation_ended)
    console.log("End Time: ", req.body.metadata.end_time)
    console.log("Current Time: ", Date.now())


    var body = ""

    if(!conversation_ended) {
      const replyTo = req.body.source_number
      const lineNumber = req.body.destination_number
      const recipient = req.body.metadata.recipient
      const name = req.body.metadata.name
      const recipient_name = req.body.metadata.recipient_name
      const end_time = req.body.metadata.end_time
      const reply = "["+name+"] "+req.body.content

      body = new sdk.SendMessagesRequest({
        "messages":[
          {
            "content":reply,
            "destination_number":recipient,
            "metadata": {
              "recipient":replyTo,
              "line":lineNumber,
              "name":recipient_name,
              "recipient_name":name,
              "end_time":end_time,
              "type":"reply"
            },
            "callback_url":process.env.CALLBACK_URL
          }
        ]
      });

      console.log("Conversation is still current, sending the reply.")
    } else {
      body = new sdk.SendMessagesRequest({
        "messages":[
          {
            "content":"This conversation has already ended. Sorry :/",
            "destination_number":req.body.source_number,
            "metadata": {
              "end_time":req.body.metadata.end_time
            }
          }
        ]
      });
      console.log("Conversation has ended. Sending error reply.")
    }

    controller.createSendMessages(body, function(error, response, context) {
      console.log(response);
    });
  }


})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
