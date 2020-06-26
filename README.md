Simple Slack Schedule Bot
=================

[Bolt](https://slack.dev/bolt) is our framework that lets you build JavaScript-based Slack apps in a flash.

This project is based on the simple Bolt app template. Read the [Getting Started with Bolt](https://api.slack.com/start/building/bolt) guide for a more in-depth tutorial.

- `app.js` contains the primary Bolt app. It imports the Bolt package (`@slack/bolt`) and starts the Bolt app's server. It's where you'll add your app's listeners.
- `.env` is where you'll put your Slack app's authorization token and signing secret.
- `eventSchedule.js` is where you configure the static event schedule as a JSON object. This gets read by `app.js`

