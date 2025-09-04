import { pool } from '../config/db.js';
import { getProviderAccessToken, buildConnectProviderUrl } from '../services/descope.js';
import { listTodaysEvents, insertEvent } from '../services/calendar.js';
import { suggestBreaksAndFocusBlocks } from '../services/ai.js';

export async function connectGoogle(req, res) {
  const url = buildConnectProviderUrl();
  return res.json({ url });
}

export async function suggestToday(req, res) {
  const { userId, descopeUserId } = req.body;
  if (!userId || !descopeUserId) return res.status(400).json({ error: 'userId and descopeUserId required' });

  const prefs = await getUserPrefs(userId);
  const { accessToken } = await getProviderAccessToken({
    descopeUserId,
    provider: 'google',
    outboundAppId: process.env.OUTBOUND_APP_ID_GOOGLE,
  });

  const events = await listTodaysEvents(accessToken);
  const suggestions = suggestBreaksAndFocusBlocks(events, prefs || {});
  res.json({ eventsCount: events.length, suggestions });
}

export async function scheduleSuggestion(req, res) {
  const { userId, descopeUserId, suggestion } = req.body;
  if (!userId || !descopeUserId || !suggestion) return res.status(400).json({ error: 'missing fields' });

  const { accessToken } = await getProviderAccessToken({
    descopeUserId,
    provider: 'google',
    outboundAppId: process.env.OUTBOUND_APP_ID_GOOGLE,
  });

  const created = await insertEvent(accessToken, {
    title: suggestion.title,
    start: suggestion.start,
    end: suggestion.end,
  });

  await pool.query(
    'INSERT INTO events (user_id, title, start_time, end_time, event_type, ext_event_id) VALUES ($1,$2,$3,$4,$5,$6)',
    [userId, suggestion.title, suggestion.start, suggestion.end, suggestion.type, created.id]
  );

  res.json({ ok: true, created });
}

async function getUserPrefs(userId) {
  const { rows } = await pool.query('SELECT break_freq, focus_blocks FROM preferences WHERE user_id=$1 LIMIT 1', [userId]);
  return rows[0] || { breakFreq: 3, focusBlocks: 50 };
}
