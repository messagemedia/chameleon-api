require('dotenv').config()

const lib = require('messagemedia-signingkeys-sdk');

// Configuration parameters and credentials
lib.Configuration.basicAuthUserName = process.env.MM_API_API_KEY; // Your API Key
lib.Configuration.basicAuthPassword = process.env.MM_API_SECRET_KEY; // Your Secret Key

var controller = lib.SignatureKeyManagementController;

var body = new lib.EnableSignatureKeyRequest({
    "key_id": process.env.ENTERPRISE_WEBHOOKS_KEY_ID
});

controller.updateEnableSignatureKey(body, function(error, response, context) {
  console.log(response);
});
