# MessageMedia Chameleon SMS 

MessageMedia Chameleon SMS allows you to have masked communication between two parties using metadata. You will need to set up atleast one dedicated number for your account in order to get this application working as expected. To do so, you can send an email to MessageMedia's support team (support@messagemedia.com).

## 📕 Prerequisites
1. [Node](https://nodejs.org/en/download/)
2. [ngrok](https://ngrok.com/)

## 🎬 Get Started
1. Start ngrok - you can do this opening up the command line and running the command `ngrok http 3000`
![img](http://i68.tinypic.com/2na8ln8.jpg)
2. A successful execution will show you a screen similar to the one below
![img](http://i64.tinypic.com/fwbih.jpg)
3. Clone this repository
4. Open the .env file and update the environmental variables:
MM_API_API_KEY=[API Key from MessageMedia]
MM_API_SECRET_KEY=[API Secret Key from MessageMedia]
PORT=[Any, we recommend port 3000]
CALLBACK_URL=[ngrok url]/incoming
NUMBERS=[dedicated numbers, separated by comma.]

Your ngrok url will show up on the command line after you run `ngrok http 3000`. You can choose any one of the 'Forwarding URLs'. This is what it typically looks like - http://f34bba6f.ngrok.io

5. Fire up the command line from the root of this cloned repository and run `npm install` 
6. Run `npm start` from the same location to start the express server
7. You should see the following on your command line - `Chameleon is running on 3000!`
8. TBC

## 😕 Need help?
Please contact developer support at developers@messagemedia.com or check out the developer portal at [developers.messagemedia.com](https://developers.messagemedia.com/)

## 📃 License
Apache License. See the [LICENSE](LICENSE) file.
