require('dotenv').config()
var request = require('request');

class NumberController {

  getNumberForRecipients(recipient1, recipient2) {

  }

  getRecipientsFor(number, callback) {
    const mm_url = "https://"+process.env.MM_API_API_KEY+":"+process.env.MM_API_SECRET_KEY+
    "@api.messagemedia.com/v1/reporting/sent_messages/detail?" +
    "metadata_key=type"+
    "&metadata_value=initial"+
    "&start_date=2018-09-20T13:30:00"+
    "&end_date=2018-09-26T13:30:00"+
    "&source_address=%2B61436368717"
    console.log(mm_url)
    request({
        url: mm_url,
        method: "GET"
    }, function (error, response, body){
        const initialMessages = JSON.parse(response.body).data
        const arr = [];
        for (var i = 0; i < initialMessages.length; i++) {
          const message = initialMessages[i]
          arr.push(message.destination_address)
        }
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
test.getRecipientsFor("+61413015555", (numbers) => {
  console.log(numbers)
})


// TODO: Get messages for last 7 days,
//       check if number can be used by recipients
//       return number to use for recipients
