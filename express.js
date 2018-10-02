require('dotenv').config()
const express = require('express')
const crypto = require('crypto')
const bodyParser = require('body-parser')
const NumberController = require('./Controller/NumberController');
const TemplateController = require('./Controller/MessageTemplateController');
const Recipient = require('./Model/Recipient');
const sdk = require('messagemedia-messages-sdk');

const messages_controller = sdk.MessagesController;
const templates = new TemplateController();
const number_controller = new NumberController();

// MessageMedia Messages SDK Configuration
sdk.Configuration.basicAuthUserName = process.env.MM_API_API_KEY; // Your API Key
sdk.Configuration.basicAuthPassword = process.env.MM_API_SECRET_KEY; // Your Secret Key


const port = process.env.PORT
const app = express()
var router = express.Router()
app.use(bodyParser.json())


app.post('/chameleon', (req, res) => {
  res.send(req.body)
  const conversations = req.body.conversations

  conversations.forEach((conversation) => {
    const recipients = conversation.recipients
    const recipient1 = new Recipient(recipients[0].name, recipients[0].number)
    const recipient2 = new Recipient(recipients[1].name, recipients[1].number)

    number_controller.getAvailableLineForNumbers([recipient1.number, recipient2.number], (numbers) => {
        const number = numbers[0]
        if(typeof number != 'undefined') {
          const line = number

          const initialMessage01 = templates.initialMessage(line, recipient1, recipient2, recipients[0].initial_message, conversation.expiry)
          const initialMessage02 = templates.initialMessage(line, recipient2, recipient1, recipients[1].initial_message, conversation.expiry)
          const messages = [initialMessage01, initialMessage02]

          const body = new sdk.SendMessagesRequest({messages:messages})

          messages_controller.createSendMessages(body, function(error, response, context) {
            console.log(response);
          });
        }
    })



  })
})



//Enterprise Webhooks
if(process.env.USE_ENTERPRISE_WEBHOOKS){
  router.use('/incoming', function(req, res, next) {
    var publicKey = '-----BEGIN PUBLIC KEY-----\n'+
    process.env.ENTERPRISE_WEBHOOKS_KEY+'\n'+
    '-----END PUBLIC KEY-----';

    const body = JSON.stringify(req.body);
    const signature = req.header('X-Messagemedia-Signature');
    const digest = req.header('X-Messagemedia-Digest-Type');
    const date = req.header('Date');

    var verifier = crypto.createVerify(digest);
    verifier.update("POST /incoming HTTP/1.1" + date + body);
    const verified = verifier.verify(publicKey, signature, "base64");

    if(verified){
      next()
    } else {
      res.status(403)
    }
  });
  app.use('/', router)
}

app.post('/incoming', (req, res) => {
  res.send('success')


  if(typeof req.body.content != 'undefined') {
    const conversation_ended = req.body.metadata.end_time < Date.now()

    if(!conversation_ended) {
      const line = req.body.destination_number

      const sender_name = req.body.metadata.name
      const sender_number = req.body.source_number
      const sender = new Recipient(sender_name, sender_number)

      const recipient_name = req.body.metadata.recipient_name
      const recipient_number = req.body.metadata.recipient
      const recipient = new Recipient(recipient_name, recipient_number)

      const reply = req.body.content
      const end_time = req.body.metadata.end_time

      const body = new sdk.SendMessagesRequest(
        {"messages":[templates.replyMessage(reply, line, sender, recipient, end_time)]}
      );

      messages_controller.createSendMessages(body, function(error, response, context) {
        console.log(response);
      });

    } else {
      const body = new sdk.SendMessagesRequest({
        "messages":[templates.endedMessage(req.body.metadata.line, req.body.source_number)]
      });

      messages_controller.createSendMessages(body, function(error, response, context) {
        console.log("Conversation has already ended. Sending already-ended conversation message.")
      });

    }

  }


})

app.listen(port, () => console.log(`Chameleon listening on port ${port}!`))
