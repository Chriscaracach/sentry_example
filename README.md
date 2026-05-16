# Sentry Example App

A minimal web app demonstrating Sentry integration for both a Node.js backend (Express) and a vanilla JS frontend.

## Stack

- **Backend**: Node.js + Express
- **Frontend**: Vanilla JS (no framework)
- **Runtime**: Bun
- **Error tracking**: Sentry

## Project Structure

```
├── server.js          # Express server with Sentry instrumentation
├── public/
│   ├── index.html     # UI
│   └── app.js         # Frontend logic + Sentry browser SDK
├── .env.example       # Environment variable template
└── package.json
```

## Setup

1. Clone the repo and install dependencies:

```bash
bun install
```

2. Copy `.env.example` to `.env` and fill in your Sentry DSN(s):

```bash
cp .env.example .env
```

```env
SENTRY_DSN_BACKEND=https://<key>@<org>.ingest.sentry.io/<project>
SENTRY_DSN_FRONTEND=https://<key>@<org>.ingest.sentry.io/<project>
PORT=3000
```

> You can use the same DSN for both frontend and backend, or separate projects.

3. Start the server:

```bash
bun run start
```

4. Open [http://localhost:3000](http://localhost:3000).

## What's being tracked

### Frontend

| Action | Sentry event |
|---|---|
| Set User | `Sentry.setUser()` — attaches user context to all subsequent events |
| Fetch Users | Breadcrumb recorded on each request |
| Unhandled JS Error | Caught automatically by Sentry's global handler |
| Handled JS Error | `Sentry.captureException()` called manually inside a try/catch |
| Custom Message | `Sentry.captureMessage()` sent directly |
| Slow Endpoint | Wrapped in `Sentry.startSpan()` — visible in Performance |

### Backend

| Endpoint | Sentry event |
|---|---|
| `GET /api/crash` | Unhandled exception caught by `Sentry.setupExpressErrorHandler()` |
| `GET /api/handled-error` | Exception caught internally, reported via `Sentry.captureException()` |
| `GET /api/slow` | Traced with `Sentry.startSpan()` wrapping a slow DB query simulation |
| `POST /api/track` | Custom message via `Sentry.captureMessage()` |
