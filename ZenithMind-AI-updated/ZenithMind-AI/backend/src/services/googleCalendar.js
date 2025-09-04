import { google } from "googleapis";
import { getProviderAccessToken } from "./descope.js";
import { log, err } from "../utils/logger.js";

/**
 * Get an authorized Google Calendar client for a user (descopeUserId).
 * We expect callers to pass { descopeUserId }.
 */
async function getGoogleClient(descopeUserId) {
  const tokenResp = await getProviderAccessToken({ descopeUserId, provider: "google" });
  const accessToken = tokenResp.accessToken;
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.calendar({ version: "v3", auth: oauth2Client });
}

/**
 * Fetch upcoming events for next N days (default 7)
 */
export async function getUpcomingEvents(descopeUserId, days = 7) {
  try {
    const calendar = await getGoogleClient(descopeUserId);
    const now = new Date();
    const then = new Date();
    then.setDate(now.getDate() + days);
    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin: now.toISOString(),
      timeMax: then.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });
    return res.data.items || [];
  } catch (e) {
    err("getUpcomingEvents error:", e.message || e);
    throw e;
  }
}

/**
 * Find free slots for today between workStart/workEnd hours (defaults 9-18) that fit durationMinutes
 */
export async function findFreeSlots(descopeUserId, durationMinutes = 30, workStartHour = 9, workEndHour = 18) {
  const events = await getUpcomingEvents(descopeUserId, 1); // fetch today's events
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(workStartHour, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(workEndHour, 0, 0, 0);

  let freeSlots = [];
  let last = startOfDay;

  // sort events by start time
  const evs = (events || []).slice().map(e => {
    return {
      start: new Date(e.start?.dateTime || e.start?.date),
      end: new Date(e.end?.dateTime || e.end?.date)
    };
  }).sort((a,b)=> a.start - b.start);

  for (const e of evs) {
    if (e.start > last) {
      const diff = (e.start - last) / (1000*60);
      if (diff >= durationMinutes) {
        freeSlots.push({ start: new Date(last), end: new Date(e.start) });
      }
    }
    if (e.end > last) last = e.end;
  }

  // end of day slot
  if (endOfDay > last) {
    const diff = (endOfDay - last) / (1000*60);
    if (diff >= durationMinutes) freeSlots.push({ start: new Date(last), end: new Date(endOfDay) });
  }
  return freeSlots;
}

/**
 * Schedule a wellness break in the user's calendar in the provided slot (object with start/end as ISO strings or Date)
 */
export async function scheduleWellnessBreak(descopeUserId, slot, durationMinutes = 30) {
  const calendar = await getGoogleClient(descopeUserId);
  const start = new Date(slot.start);
  const end = slot.end ? new Date(slot.end) : new Date(start.getTime() + durationMinutes*60000);

  const event = {
    summary: "ZenithMind Wellness Break 🧘",
    description: "Take a short mindful break. Scheduled by ZenithMind AI.",
    start: { dateTime: start.toISOString(), timeZone: "Asia/Kolkata" },
    end: { dateTime: end.toISOString(), timeZone: "Asia/Kolkata" }
  };

  const res = await calendar.events.insert({ calendarId: "primary", requestBody: event });
  log("Scheduled wellness event:", res.data.id);
  return res.data;
}
