# ZenithMind AI

ZenithMind AI is an intelligent agent that integrates with **Descope** and **Google Calendar** to auto-schedule wellness breaks for students and professionals.

## Features
- Google Calendar integration
- Descope Outbound Apps for secure authentication
- AI-driven scheduling engine (coming soon)
- PostgreSQL database

## Setup
1. Install dependencies
2. Configure `.env`
3. Run backend: `npm run dev`
4. Run frontend: `npm run dev`

## API Endpoints
- `GET /api/google/events`
- `GET /api/google/free-slots`
- `POST /api/google/schedule`