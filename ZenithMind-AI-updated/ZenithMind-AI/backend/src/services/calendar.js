import { google } from 'googleapis';
import { log } from '../utils/logger.js';

/**
 * Create an OAuth2 client with a bearer token.
 * We do not store refresh tokens locally; we request a new accessToken from Descope when needed.
 */
export function oauthClientFromToken(accessToken) {
  const oAuth2Client = new google.auth.OAuth2();
  oAuth2Client.setCredentials({ access_token: accessToken });
  return oAuth2Client;
}

export async function listTodaysEvents(accessToken) {
  const auth = oauthClientFromToken(accessToken);
  const calendar = google.calendar({ version: 'v3', auth });

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: startOfDay.toISOString(),
    timeMax: endOfDay.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });

  return res.data.items || [];
}

export async function insertEvent(accessToken, { title, start, end }) {
  const auth = oauthClientFromToken(accessToken);
  const calendar = google.calendar({ version: 'v3', auth });
  const event = {
    summary: title,
    start: { dateTime: new Date(start).toISOString() },
    end: { dateTime: new Date(end).toISOString() },
  };
  const res = await calendar.events.insert({ calendarId: 'primary', requestBody: event });
  log('Created event:', res.data.id);
  return res.data;
}
