require('dotenv').config()
const request = require('request');
const querystring = require('querystring');
const moment = require('moment');

class NumberController {

  async getNumberForRecipients(number1, number2, callback) {
    const numbers = this.getNumbers()

    for (const number of numbers) {
      this.getRecipientsFor(number, (numbers) => {
        if(!numbers.includes(number1) && !numbers.includes(number2)) {
          callback(number)
        }
      })
    }

  }

  getRecipientsFor(number, callback) {
    const dateFormat = 'YYYY-MM-DDThh:mm:ss'
    const start_date = moment().subtract(1, "days").format(dateFormat)
    const end_date = moment().add(1, "days").format(dateFormat)

    const mm_url = "https://"+process.env.MM_API_API_KEY+":"+process.env.MM_API_SECRET_KEY+
    "@api.messagemedia.com/v1/reporting/sent_messages/detail?" +
    "metadata_key=type"+
    "&metadata_value=initial"+
    "&start_date="+start_date+
    "&end_date="+end_date+
    "&source_address="+querystring.escape(number)

    request({
        url: mm_url,
        method: "GET"
    }, (error, response, body) => {
        const messages = JSON.parse(response.body).data
        const arr = [];
        messages.forEach((message) => {
          const conversation_ended = message.metadata.end_time < Date.now() ? true : false
          if(!conversation_ended) {
            arr.push(message.destination_address)
            // console.log("Ongoing Conversation: ", message)
            console.log("Conversation Ends in: "+message.metadata.end_date-Date.now())
          }
        })
        callback(arr)
    });
  }


  getNumbers() {
    return process.env.NUMBERS.split(',')
  }


}

module.exports = NumberController;
