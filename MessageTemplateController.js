require('dotenv').config()
const Recipient = require('./Model/Recipient');

class MessageTemplateController {

  initialMessage(line, recipient1, recipient2, message, end_time) {
    const message_obj = {
       "content":message,
       "source_number":line,
       "destination_number":recipient1.number,
       "metadata": {
         "recipient":recipient2.number,
         "line":line,
         "name":recipient1.name,
         "recipient_name":recipient2.name,
         "end_time":end_time,
         "type":"initial"
       },
      "callback_url":process.env.CALLBACK_URL
    }
    return message_obj
  }

  endedMessage(line, sender, end_time) {
    const message_obj = {
      "content":"This conversation has already ended. Your reply was not sent.",
      "source_number":line,
      "destination_number":sender,
      "metadata": {}
    }
    return message_obj
  }



}

module.exports = MessageTemplateController;
