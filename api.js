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

async function listScheduledMessages() {
  try {
    // Call the chat.scheduledMessages.list method using the built-in WebClient
    const result = await app.client.chat.scheduledMessages.list({
      // The token you used to initialize your app
      token: process.env.SLACK_BOT_TOKEN,
    });

    return result.scheduled_messages
  }
  catch (error) {
    console.error(error);
  }
}

async function deleteScheduledMessage(channel, id) {
  try {
    // Call the chat.deleteScheduledMessage method using the built-in WebClient
    const result = await app.client.chat.deleteScheduledMessage({
      // The token you used to initialize your app
      token: process.env.SLACK_BOT_TOKEN,
      channel: channel,
      scheduled_message_id: id
    });

    // Print result
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
}

module.exports = {
  publishMessage,
  listScheduledMessages,
  deleteScheduledMessage
}