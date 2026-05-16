require("dotenv").config();
const Sentry = require("@sentry/node");
const express = require("express");
const path = require("path");

Sentry.init({
  dsn: process.env.SENTRY_DSN_BACKEND,
  tracesSampleRate: 1.0, // capture 100% of transactions (lower in production)
  environment: "development",
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// --- Normal endpoint ---
app.get("/api/users", (req, res) => {
  Sentry.addBreadcrumb({ category: "api", message: "Fetched user list", level: "info" });
  res.json([
    { id: 1, name: "Alice", role: "admin" },
    { id: 2, name: "Bob", role: "viewer" },
  ]);
});

// --- Unhandled error: Sentry catches it via the error handler middleware ---
app.get("/api/crash", (req, res) => {
  throw new Error("Intentional unhandled server crash");
});

// --- Handled error: we catch it and report manually ---
app.get("/api/handled-error", (req, res) => {
  try {
    const data = JSON.parse("not valid json {{");
  } catch (err) {
    Sentry.captureException(err, {
      tags: { endpoint: "/api/handled-error" },
      extra: { note: "Caught and reported manually" },
    });
    res.status(422).json({ error: "Handled: bad data format", sentryReported: true });
  }
});

// --- Slow endpoint: demonstrates performance monitoring ---
app.get("/api/slow", async (req, res) => {
  await Sentry.startSpan({ name: "slow-database-query", op: "db.query" }, async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
  });
  res.json({ message: "Slow operation complete", duration: "~1500ms" });
});

// --- Custom message/event ---
app.post("/api/track", (req, res) => {
  const { message, level = "info" } = req.body;
  Sentry.captureMessage(message || "Custom event from frontend", level);
  res.json({ tracked: true });
});

// Sentry error handler must be registered after all routes
Sentry.setupExpressErrorHandler(app);

// Fallback error response (after Sentry has captured it)
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message, sentryReported: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Backend Sentry DSN: ${process.env.SENTRY_DSN_BACKEND ? "configured" : "MISSING"}`);
});
