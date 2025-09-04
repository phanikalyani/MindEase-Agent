import { Router } from 'express';
import { connectGoogle, suggestToday, scheduleSuggestion } from '../controllers/calendarController.js';
import { upsertUser } from '../controllers/userController.js';
import googleCalendarRoutes from './googleCalendar.js';

const r = Router();

r.get('/health', (req, res) => res.json({ ok: true }));

// Users
r.post('/user/upsert', upsertUser);

// Calendar (existing simple flows)
r.get('/auth/connect/google', connectGoogle);
r.post('/calendar/suggest', suggestToday);
r.post('/calendar/schedule', scheduleSuggestion);

// Google calendar sync routes
r.use('/google', googleCalendarRoutes);

export default r;
