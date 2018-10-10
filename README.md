# MessageMedia Chameleon SMS 

MessageMedia Chameleon SMS allows you to have masked communication between two parties using metadata. You will need to set up atleast one dedicated number for your account in order to get this application working as expected. To do so, you can send an email to MessageMedia's support team (support@messagemedia.com).

## 📕 Prerequisites
1. [Node](https://nodejs.org/en/download/)
2. [ngrok](https://ngrok.com/)
3. [Postman](https://www.getpostman.com/apps)

## 🎬 Get Started
1. Start ngrok - you can do this opening up the command line and running the command `ngrok http 3000`
![img](http://i68.tinypic.com/2na8ln8.jpg)
2. A successful execution will show you a screen similar to the one below
![img](http://i64.tinypic.com/fwbih.jpg)
3. Clone this repository
4. Open the cloned repository and create a .env file
5. Copy and paste the environmental variables below and update them accordingly:<br/>
`MM_API_API_KEY=[API Key from MessageMedia]`<br/>
`MM_API_SECRET_KEY=[API Secret Key from MessageMedia]`<br/>
`PORT=[Any, we recommend port 3000]`<br/>
`CALLBACK_URL=[ngrok url]/incoming`<br/>
`NUMBERS=[dedicated numbers, separated by comma.]`<br/>

Your ngrok url will show up on the command line after you run `ngrok http 3000`. You can choose any one of the 'Forwarding URLs'. This is what it typically looks like - http://f34bba6f.ngrok.io

5. Fire up the command line from the root of this cloned repository and run `npm install` 
6. Run `npm start` from the same location to start the express server
7. You should see the following on your command line - `Chameleon listening on port 3000!`
8. Click on the following link - https://app.getpostman.com/run-collection/b0a6031eed4b6dd45455
9. This will import the request into your Postman application
10. You should see something similar on your app
![img](http://i68.tinypic.com/24ypmr7.jpg)
11. Update your authentication details
12. Update the url with your `[ngrok url]/chameleon`
13. Update the mobile numbers in the request. You can change the names and the expiry time as well.
14. Hit send!

## 😕 Need help?
Please contact developer support at developers@messagemedia.com or check out the developer portal at [developers.messagemedia.com](https://developers.messagemedia.com/)

## 📃 License
Apache License. See the [LICENSE](LICENSE) file.
