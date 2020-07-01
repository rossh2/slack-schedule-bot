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

import * as moment from 'moment-timezone'
import {Moment} from "moment-timezone";
const timezone = 'America/New_York'

export interface Event {
  start: Moment,
  end: Moment,
  name: string,
  url: string,
  info?: string
}

export const eventSchedule: Array<Event> = [
  {
    start: moment.tz('2020-06-30T11:30', timezone),
    end: moment.tz('2020-06-30T12:00', timezone),
    name: 'Themed coffee break: Ethics',
    url: 'https://spatial.chat/s/WeSSLLI-ESSLLI/',
    info: 'Browse papers at http://www.ethicsinnlp.org/workshop/ for ideas.',
  },
  {
    start: moment.tz('2020-06-30T16:00', timezone),
    end: moment.tz('2020-06-30T16:30', timezone),
    name: 'Themed coffee break: Pets',
    url: 'https://spatial.chat/s/WeSSLLI-ESSLLI/ and https://spatial.chat/s/COSI2020/',
    info: 'Show off your pet in your video! Or tell us about your pet in Slack.',
  },
  {
    start: moment.tz('2020-07-01T15:00', timezone),
    end: moment.tz('2020-07-01T16:20', timezone),
    name: 'NALOMA Workshop',
    url: 'https://typo.uni-konstanz.de/naloma20/',
  },
  {
    start: moment.tz('2020-07-01T16:15', timezone),
    end: moment.tz('2020-07-01T16:30', timezone),
    name: 'Coffee break',
    url: 'https://spatial.chat/s/WeSSLLI-ESSLLI/',
  },
]