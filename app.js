// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");
const moment = require('moment');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

let conversationId = 'G0164SF7RFD'; // #bot-testing

async function publishMessage(id, text) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await app.client.chat.postMessage({
      // The token you used to initialize your app
      token: process.env.SLACK_BOT_TOKEN,
      channel: id,
      text: text
      // You could also use a blocks[] array to send richer content
    });

    // Print result, which includes information about the message (like TS)
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
}

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
  
  let now = moment()
  if (now.minutes() == 0) {
    publishMessage(conversationId, `It is currently ${now.format('hh:mm')}` )
  }
  // publishMessage(conversationId, "Hello world :tada:");
  
})();
