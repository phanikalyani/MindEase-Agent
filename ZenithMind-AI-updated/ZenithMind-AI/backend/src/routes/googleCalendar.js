import { Router } from "express";
import { getUpcomingEvents, findFreeSlots, scheduleWellnessBreak } from "../services/googleCalendar.js";

const r = Router();

// For compatibility, endpoints accept descopeUserId in body or query
function extractDescopeId(req) {
  return req.body?.descopeUserId || req.query?.descopeUserId || req.headers['x-descope-userid'];
}

r.get("/events", async (req, res) => {
  const descopeUserId = extractDescopeId(req);
  if (!descopeUserId) return res.status(400).json({ error: "descopeUserId required" });
  try {
    const events = await getUpcomingEvents(descopeUserId, 7);
    res.json(events);
  } catch (e) {
    res.status(500).json({ error: e.message || e.toString() });
  }
});

r.get("/free-slots", async (req, res) => {
  const descopeUserId = extractDescopeId(req);
  if (!descopeUserId) return res.status(400).json({ error: "descopeUserId required" });
  try {
    const slots = await findFreeSlots(descopeUserId, Number(req.query.duration) || 30);
    res.json(slots);
  } catch (e) {
    res.status(500).json({ error: e.message || e.toString() });
  }
});

r.post("/schedule", async (req, res) => {
  const descopeUserId = extractDescopeId(req);
  const { slot } = req.body;
  if (!descopeUserId || !slot) return res.status(400).json({ error: "descopeUserId and slot required" });
  try {
    const created = await scheduleWellnessBreak(descopeUserId, slot, Number(req.body.duration) || 30);
    res.json(created);
  } catch (e) {
    res.status(500).json({ error: e.message || e.toString() });
  }
});

export default r;
