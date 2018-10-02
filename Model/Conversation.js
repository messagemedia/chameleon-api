const uuidv4 = require('uuid/v4');

class Conversation {

  constructor(recipients, expiry) {
    this.recipients = recipients
    this.expiry = expiry
  }

  generateID() {
    this.id = uuidv4
  }
}
