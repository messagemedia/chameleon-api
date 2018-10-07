require('dotenv').config()
const Recipient = require('../Model/Recipient');

class MessageTemplateController {

  initialMessage(line, recipient1, recipient2, message, expiry) {
    return {
       "content":message,
       "source_number":line,
       "destination_number":recipient1.number,
       "metadata": {
         "recipient":recipient2.number,
         "line":line,
         "name":recipient1.name,
         "recipient_name":recipient2.name,
         "expiry":expiry,
         "type":"initial"
       },
      "callback_url":process.env.CALLBACK_URL,
      "delivery_report":false
    }
  }

  endedMessage(line, sender, expiry) {
     return {
      "content":"This conversation has already ended. Your reply was not sent.",
      "source_number":line,
      "destination_number":sender,
      "metadata": {}
    }
  }

  replyMessage(reply, line, sender, recipient, expiry) {
    return {
          "content":"["+sender.name+"] "+reply,
          "source_number":line,
          "destination_number":recipient.number,
          "metadata": {
            "line":line,
            "name":sender.name,
            "recipient":recipient.number,
            "recipient_name":recipient.name,
            "expiry":expiry,
            "type":"reply"
          },
          "callback_url":process.env.CALLBACK_URL,
          "delivery_report":false
        }
  }



}

module.exports = MessageTemplateController;
