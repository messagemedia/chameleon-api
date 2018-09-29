require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT

const sdk = require('messagemedia-messages-sdk');
const controller = sdk.MessagesController;

const TemplateController = require('./MessageTemplateController');
const Recipient = require('./Model/Recipient');
const templates = new TemplateController()

var bodyParser = require('body-parser')

// Configuration parameters and credentials
sdk.Configuration.basicAuthUserName = process.env.MM_API_API_KEY; // Your API Key
sdk.Configuration.basicAuthPassword = process.env.MM_API_SECRET_KEY; // Your Secret Key


app.use(bodyParser.json())


app.post('/chameleon', (req, res) => {
  res.send(req.body)
  const conversations = req.body.conversations
  const line = "+61436368717"


  conversations.forEach((conversation) => {
    const recipients = conversation.recipients
    const recipient1 = new Recipient(recipients[0].name, recipients[0].number)
    const recipient2 = new Recipient(recipients[1].name, recipients[1].number)

    const initialMessage01 = templates.initialMessage(line, recipient1, recipient2, recipients[0].initial_message, conversation.expiry)
    const initialMessage02 = templates.initialMessage(line, recipient2, recipient1, recipients[1].initial_message, conversation.expiry)
    const messages = [initialMessage01, initialMessage02]
    
    const body = new sdk.SendMessagesRequest({messages:messages})
    console.log(body)
    controller.createSendMessages(body, function(error, response, context) {
      console.log(response);
    });


  })
})






app.post('/incoming', (req, res) => {
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
