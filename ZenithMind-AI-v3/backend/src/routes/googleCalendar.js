import express from 'express';
import { fetchEvents, findFreeSlots, scheduleEvent } from '../services/googleCalendar.js';

const router = express.Router();

router.get('/events', fetchEvents);
router.get('/free-slots', findFreeSlots);
router.post('/schedule', scheduleEvent);

export default router;