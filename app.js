// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");
const moment = require('moment');
const schedule = require('node-schedule');
const eventSchedule = require('./eventSchedule.js')

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

function setupSchedule(events) {
  const timezone = 'America/New_York'
  
  for (const dateString in events) {
    let dateAsMoment = moment.tz(dateString, timezone)
    let fiveMinutesBefore = dateAsMoment.clone().subtract(5, 'minutes')
    let scheduleDate = fiveMinutesBefore.toDate()
    let message = `*${events[dateString].name}* is starting at ` + // * for bold
        `${dateAsMoment.format('h:mma z')}. ` + 
        `Go to ${events[dateString].url} to join in.` // no markdown needed for URL
    if ('info' in events[dateString]) {
      message = message + ` ${events[dateString].info}`
    }
    schedule.scheduleJob(scheduleDate, function(){
      publishMessage(conversationId, message)
    });
  }
}

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
  
  console.log(eventSchedule)
  setupSchedule(eventSchedule)
  
})();