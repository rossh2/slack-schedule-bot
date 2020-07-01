// Require the Bolt package (github.com/slackapi/bolt)
import {App} from "@slack/bolt"
import * as moment from 'moment-timezone'
import {eventSchedule, Event} from "./eventSchedule"

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

const announcementChannelId = 'G0164SF7RFD'; // #bot-testing
const directMessageChannelId = 'D01638S4N9K' // direct messages to bot

async function publishMessage(id: string, text: string, timestamp: number): Promise<void> {
  try {
    let result;
    if (timestamp) {
      let options = {
        channel: id,
        text: text,
        post_at: timestamp.toString()
        // You could also use a blocks[] array to send richer content
      }
      result = await app.client.chat.scheduleMessage(options)
    } else {
      let options = {
        channel: id,
        text: text,
        // You could also use a blocks[] array to send richer content
      }
      result = await app.client.chat.postMessage(options);
    }

    // Print result, which includes information about the message (like TS)
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

async function listScheduledMessages(): Promise<Array<any>> {
  try {
    const result = await app.client.chat.scheduledMessages.list();

    // @ts-ignore
    return result.scheduled_messages
  } catch (error) {
    console.error(error);
  }
}

async function deleteScheduledMessage(channel: string, id: string): Promise<void> {
  try {
    const result = await app.client.chat.deleteScheduledMessage({
      channel: channel,
      scheduled_message_id: id
    });

    // Print result
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

async function setupSchedule(events: Array<Event>) {
  console.log('Setting up schedule...')
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
      await publishMessage(announcementChannelId, message, timestamp)
    }
  }
}

function getCurrentAndNextEvents(events: Array<Event>) {
  let currentEvents = []
  let nextEvents = [];
  const now = moment()
  for (const event of events) {
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

function formatEvents(events: Array<Event>) {
  let message = ''
  const prefix = events.length === 1 ? '' : '- '
  for (const event of events) {
    message = message + `${prefix}*${event.name}* `
      + `from ${event.start.format('h:mma')} to ${event.end.format('h:mma z')} at ${event.url}`
    if ('info' in event) {
      message = message + `\n${event.info}`
    }
    message = message + '\n'
  }

  return message
}

async function deletePreviouslyScheduled(): Promise<void> {
  let scheduled = await listScheduledMessages();

  if (scheduled.length > 0) {
    console.log(`Deleting ${scheduled.length} previously scheduled messages:`)
    console.log(scheduled)
  }
  for (const message of scheduled) {
    await deleteScheduledMessage(message.channel_id, message.id)
  }
}

function assembleCurrentNextEventsMessage(): string {
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
  return reply;
}

app.event('app_mention', ({say}) => {
  let reply = assembleCurrentNextEventsMessage();

  console.log('Replying to app mention:\n' + reply)
  say(reply);
});

app.message(async ({message, say}) => {
  if (message.channel === directMessageChannelId) {
    let reply = assembleCurrentNextEventsMessage();

    console.log('Replying to direct message:\n' + reply)
    say(reply);
  }
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');

  await deletePreviouslyScheduled()

  await setupSchedule(eventSchedule)

})();
