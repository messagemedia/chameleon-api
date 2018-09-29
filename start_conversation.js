require('dotenv').config()

const sdk = require('messagemedia-messages-sdk');
const controller = sdk.MessagesController;


// Configuration parameters and credentials
sdk.Configuration.basicAuthUserName = process.env.MM_API_API_KEY; // Your API Key
sdk.Configuration.basicAuthPassword = process.env.MM_API_SECRET_KEY; // Your Secret Key

const end_time = Date.now() + 60000


var body = new sdk.SendMessagesRequest({
   "messages":[
      {
         "content":"Your SkyBNB host, Ibrahim, can be contacted by replying to this number. Please do not share private information using this chat.",
         "destination_number":"+61413015555",
         "metadata": {
           "recipient":"+61413015555",
           "line":"‭+61439843333‬",
           "name":"James",
           "recipient_name":"Ibrahim",
           "end_time":end_time,
           "type":"initial"
         },
        "callback_url":process.env.CALLBACK_URL
      },
      {
         "content":"Your SkyBNB guest, James, can be contacted by replying to this number. Please do not share private information using this chat.",
         "destination_number":"+61413015555",
         "metadata": {
           "recipient":"+61413015555",
           "line":"‭+61439843333‬",
           "name":"Ibrahim",
           "recipient_name":"James",
           "end_time":end_time,
           "type":"initial"
         },
        "callback_url":process.env.CALLBACK_URL
      }
   ]
});
controller.createSendMessages(body, function(error, response, context) {
  console.log(response);
});
