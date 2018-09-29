require('dotenv').config()
const request = require('request');
const querystring = require('querystring');
const moment = require('moment');

class NumberController {

  async getNumberForRecipients(recipient1, recipient2, callback) {
    const numbers = this.getNumbers()
    const availableNumbers = []

    for (var i = 0; i < numbers.length; i++) {
      const number = numbers[i]
      this.getRecipientsFor(number, (numbers) => {
        console.log("test for number: ",number)
        console.log(numbers)
        if(!numbers.includes('+61413015555')) {
          availableNumbers.push(number)
          callback(number)
          return 0
        }
      })


    }

  }

  getRecipientsFor(number, callback) {
    const dateFormat = 'YYYY-MM-DDThh:mm:ss'
    const start_date = moment().utc().subtract(7, "days").format(dateFormat)
    const end_date = moment().utc().format(dateFormat)

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
          arr.push(message.destination_address)
        })
        callback(arr)
    });
  }


  getNumbers() {
    return process.env.NUMBERS.split(',')
  }


}

module.exports = NumberController;

const test = new NumberController();
console.log(test.getNumbers())

const numbers = test.getNumbers()

test.getNumberForRecipients('+61413015555','+somenumber', (number) => {
  console.log("Available Number: ",number)
})



// TODO: Get messages for last 7 days,
//       check if number can be used by recipients
//       return number to use for recipients
