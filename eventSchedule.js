/**
 * All times should be in EST.
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
const eventSchedule = {
  '2020-06-26T15:15': {
    'name': 'Coffee break',
    'url': 'https://brandeis.sodexomyway.com/dining-near-me/dunkin-donuts'
  },
  '2020-06-26T15:45': {
    'name': 'Coffee break (part 2)',
    'url': 'https://brandeis.sodexomyway.com/dining-near-me/dunkin-donuts'
  },
  '2020-06-30T11:30': {
    'name': 'Themed coffee break: Ethics',
    'url': 'https://spatial.chat/s/WeSSLLI-ESSLLI/',
    'info': 'Browse papers at http://www.ethicsinnlp.org/workshop/ for ideas.'
  },
  '2020-06-30T14:00': {
    'name': 'Coffee break',
    'url': 'https://spatial.chat/s/WeSSLLI-ESSLLI/'
  },
  '2020-06-30T16:00': {
    'name': 'Themed coffee break: Pets',
    'url': 'https://spatial.chat/s/WeSSLLI-ESSLLI/',
    'info': 'Show off your pet in your video! Or tell us about your pet in Slack.'
  },
}

module.exports = eventSchedule