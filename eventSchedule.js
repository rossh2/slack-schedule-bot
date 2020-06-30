/**
 * All times should be in EST.
 * The URL doesn't actually need to be a URL,
 * it can be any string (such as a list of URLs).
 *
 * Note that while it's possible to delete scheduled messages,
 * this isn't implemented in this app.
 * So treat this schedule as if there is
 * NO WAY TO UNDO A SCHEDULED MESSAGE.
 * Make sure all the details are correct before deploying the app!
 *
 * If you really need to delete a scheduled message, check the log for the
 * `scheduled_message_id` and then follow instructions at
 * https://api.slack.com/messaging/scheduling
*/

const moment = require('moment');
const timezone = 'America/New_York'

const eventSchedule = [
  {
    start: moment.tz('2020-06-30T11:30', timezone),
    end: moment.tz('2020-06-30T12:00', timezone),
    name: 'Themed coffee break: Ethics',
    url: 'https://spatial.chat/s/WeSSLLI-ESSLLI/',
    info: 'Browse papers at http://www.ethicsinnlp.org/workshop/ for ideas.',
  },
  {
    start: moment.tz('2020-06-30T14:00', timezone),
    end: moment.tz('2020-06-30T15:00', timezone),
    name: 'Coffee break',
    url: 'https://spatial.chat/s/WeSSLLI-ESSLLI/',
  },
  {
    start: moment.tz('2020-06-30T16:00', timezone),
    end: moment.tz('2020-06-30T16:30', timezone),
    name: 'Themed coffee break: Pets',
    url: 'https://spatial.chat/s/WeSSLLI-ESSLLI/',
    info: 'Show off your pet in your video! Or tell us about your pet in Slack.',
  },
]

module.exports = eventSchedule