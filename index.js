//This function is used to handle incoming lambda functions, designed to be used by API Gateway.
const crypto = require('crypto')
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


exports.handler = (event, context, callback) => {
    console.log(event.resource)

    const resource = event.resource
    const body = JSON.parse(event.body)

    switch(resource) {
        case '/chameleon':
            console.log("Handling Chameleon Request")
            const conversations = body.conversations

            conversations.forEach((conversation) => {
              const recipients = conversation.recipients
              const recipient1 = new Recipient(recipients[0].name, recipients[0].number)
              const recipient2 = new Recipient(recipients[1].name, recipients[1].number)
              console.log("Recipients: ",recipient1,recipient2)

              number_controller.getAvailableLineForNumbers([recipient1.number, recipient2.number], (numbers) => {
                  const number = numbers[0]
                  console.log("Line to use: ",number)
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
            break;
        case '/incoming':
            console.log("Handling Incoming Request")
            if(typeof body.content != 'undefined') {
              const conversation_ended = body.metadata.expiry < Date.now()

              if(!conversation_ended) {
                const line = body.destination_number

                const sender_name = body.metadata.name
                const sender_number = body.source_number
                const sender = new Recipient(sender_name, sender_number)

                const recipient_name = body.metadata.recipient_name
                const recipient_number = body.metadata.recipient
                const recipient = new Recipient(recipient_name, recipient_number)

                const reply = body.content
                const expiry = body.metadata.expiry

                const mm_sdk_body = new sdk.SendMessagesRequest(
                  {"messages":[templates.replyMessage(reply, line, sender, recipient, expiry)]}
                );

                messages_controller.createSendMessages(mm_sdk_body, function(error, response, context) {
                  console.log(response);
                });

              } else {
                const mm_sdk_body = new sdk.SendMessagesRequest({
                  "messages":[templates.endedMessage(body.metadata.line, body.source_number)]
                });

                messages_controller.createSendMessages(mm_sdk_body, function(error, response, context) {
                  console.log(response)
                  console.log("Conversation has already ended. Sending already-ended conversation message.")
                });

              }

            }

            break;
        default:
            //This should never be called if configured correctly...
            const response = {
              statusCode: 200,
              body: JSON.stringify({"message":"No Resource"})
            };
            callback(null, response);
            break;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify({"message":"success"})
    };
    callback(null, response);

};
