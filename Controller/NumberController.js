require('dotenv').config()
const request = require('request');
const querystring = require('querystring');
const moment = require('moment');

class NumberController {

  //This will return all the conversations for every number on the account.
  getAllConversations(callback) {
    const dateFormat = 'YYYY-MM-DDThh:mm:ss'
    const start_date = moment().subtract(1, "days").format(dateFormat)
    const end_date = moment().add(1, "days").format(dateFormat)

    const mm_url = "https://"+process.env.MM_API_API_KEY+":"+process.env.MM_API_SECRET_KEY+
    "@api.messagemedia.com/v1/reporting/sent_messages/detail?" +
    "metadata_key=type"+
    "&metadata_value=initial"+
    "&start_date="+start_date+
    "&end_date="+end_date

    const conversations = {}

    request({
      url: mm_url,
      method: "GET"
    }, (error, response, body) => {
      const messages = JSON.parse(response.body).data
      const arr = [];
      messages.forEach((message) => {
        if(typeof conversations[message.source_address] == 'undefined') {
          conversations[message.source_address] = [];
        }

        const conversation = {
          number: message.destination_address,
          end_time: message.metadata.end_time,
          recipient: message.metadata.recipient
        }
        conversations[message.source_address].push(conversation)

      })
      callback(conversations)
    });

  }

  getActiveConversations(callback) {
    const activeConversations = {};
    this.getAllConversations(conversationNumberSet => {
      const numbers = Object.keys(conversationNumberSet)
      for (var number of numbers) {
        const conversations = conversationNumberSet[number]
        const filtered_by_active = conversations.filter(conversation => conversation.end_time > Date.now())
        activeConversations[number] = filtered_by_active
      }
      callback(activeConversations)
    })
  }

  getAvailableLineForNumbers(numbers, callback) {
    var lines = this.getLines()
    this.getActiveConversations(activeConversations => {
      for (var number in activeConversations) {
        for (var conversation of activeConversations[number]) {
          for (var recipient of recipients) {
            if(conversation.recipient == recipient && conversation.end_time > Date.now()) {
              const index = lines.indexOf(number)
              if (index > -1) {
                lines.splice(index, 1)
              }
            }
          }
        }
      }
      callback(lines)
    })
  }


  getLines() {
    return process.env.LINES.split(',')
  }


}

module.exports = NumberController;
