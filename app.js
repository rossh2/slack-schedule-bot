// Require the Bolt package (github.com/slackapi/bolt)
const {App} = require("@slack/bolt");
const moment = require('moment-timezone');
const eventSchedule = require('./eventSchedule.js')

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

const conversationId = 'G0164SF7RFD'; // #bot-testing

async function publishMessage(id, text, timestamp) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    let options = {
      // The token you used to initialize your app
      token: process.env.SLACK_BOT_TOKEN,
      channel: id,
      text: text,
      // You could also use a blocks[] array to send richer content
    }
    let result;
    if (timestamp) {
      options.post_at = timestamp
      result = await app.client.chat.scheduleMessage(options)
    } else {
      result = await app.client.chat.postMessage(options);
    }

    // Print result, which includes information about the message (like TS)
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

async function setupSchedule(events) {
  const now = moment()
  for (const event of events) {
    let fiveMinutesBefore = event.start.clone().subtract(5, 'minutes')
    if (fiveMinutesBefore.isAfter(now)) {
      let message = `*${event.name}* is starting at ` + // * for bold
        `${event.start.format('h:mma z')}. ` +
        `Go to ${event.url} to join in.` // no markdown needed for URL
      if ('info' in event) {
        message = message + `\n${event.info}`
      }

      let timestamp = fiveMinutesBefore.unix()
      await publishMessage(conversationId, message, timestamp)
    }
  }
}

function getCurrentAndNextEvents(events) {
  let currentEvents = []
  let nextEvents = [];
  const now = moment()
  for (let event of events) {
    // Assemble current event(s)
    if (event.start.isSameOrBefore(now, 'minute') && event.end.isSameOrAfter(now, 'minute')) {
      currentEvents.push(event)
    }
    // Assemble next event(s)
    if (event.start.isSame(now, 'day') && event.start.isAfter(now, 'minute')) {
      if (nextEvents.length === 0) {
        nextEvents = [event]
      } else {
        const nextStart = nextEvents[0].start
        if (nextStart.isSame(event.start, 'minute')) {
          // Add concurrent event
          nextEvents.push(event)
        } else if (nextStart.isAfter(event.start, 'minute')) {
          // Found an event which starts sooner
          nextEvents = [event]
        }
      }
    }
  }

  return {
    currentEvents: currentEvents,
    nextEvents: nextEvents
  }
}

function formatEvents(events) {
  let message = ''
  const prefix = events.length === 1 ? '' : '- '
  for (let event of events) {
    message = message + `${prefix}*${event.name}* `
      + `from ${event.start.format('h:mma')} to ${event.end.format('h:mma z')} at ${event.url}`
    if ('info' in event) {
      message = message + `\n${event.info}`
    }
    message = message + '\n'
  }

  return message
}

app.event('app_mention', ({say}) => {
  const {currentEvents, nextEvents} = getCurrentAndNextEvents(eventSchedule)

  let reply = '';

  // Current events
  if (currentEvents.length > 0) {
    reply = reply + (currentEvents.length === 1
      ? 'Currently, there is one event:\n'
      : 'Currently, the following events are happening:\n')
    reply = reply + formatEvents(currentEvents)
  } else {
    reply = reply + 'There are no current events.\n'
  }

  // Next events
  if (nextEvents.length > 0) {
    reply = reply + (nextEvents.length === 1
      ? 'The next event is:\n'
      : 'The next events are:\n')
    reply = reply + formatEvents(nextEvents)
  } else {
    reply = reply + 'There are no more events today.'
  }

  console.log('Replying to user:\n' + reply)
  say(reply);
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');

  await setupSchedule(eventSchedule)

})();
