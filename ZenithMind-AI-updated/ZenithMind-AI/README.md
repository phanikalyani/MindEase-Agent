# ZenithMind AI – Intelligent Wellness & Productivity Scheduler

**Unique, customized title:** ZenithMind AI

An AI-powered agent that schedules wellness & focus breaks on Google Calendar using **Descope Outbound Apps** for secure auth — no hardcoded tokens.

## Quick Start

### Prereqs
- Node 18+
- PNPM or NPM
- PostgreSQL 14+ (or use Docker)
- Descope project with an **Outbound App** configured for Google (Calendar scope).
- (Optional) Vite for dev server (bundled in frontend).

### 1) Environment
Copy and fill envs:

```bash
cp backend/.env.example backend/.env
```

Set:
- `DESCOPE_PROJECT_ID` – your Descope Project ID
- `DESCOPE_MANAGEMENT_KEY` – Descope Management key (from inbound app)
- `OUTBOUND_APP_ID_GOOGLE` – Outbound App ID for Google
- `DATABASE_URL` – Postgres URL, e.g. `postgres://postgres:postgres@localhost:5432/zenithmind`
- `JWT_AUDIENCE` – your expected audience (optional, for session validation)
- `JWT_ISSUER` – your issuer (optional)

### 2) Run DB
```bash
docker compose up -d db
psql "$DATABASE_URL" -f database/schema.sql
```

### 3) Backend
```bash
cd backend
pnpm i || npm i
pnpm dev || npm run dev
```

### 4) Frontend
```bash
cd frontend
pnpm i || npm i
pnpm dev || npm run dev
```

### 5) Connect Accounts
- Open the frontend
- Login via Descope hosted flow
- Click **Connect Google Calendar** (redirects to Descope Outbound App flow)
- Once connected, the agent can suggest & schedule breaks automatically

## Notes
- Tokens are **never stored** in our DB. We store only the **connection reference** and request a fresh access token from Descope at runtime.
- Replace any `TODO:` markers for your Descope tenant specifics.
