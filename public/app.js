// Fetch the DSN from the server so it doesn't have to be hardcoded in the HTML
fetch("/config")
  .then((r) => r.json())
  .then(({ sentryDsn }) => {
    Sentry.init({
      dsn: sentryDsn,
      tracesSampleRate: 1.0,
      environment: "development",
      // Capture breadcrumbs for fetch calls and console output automatically
      integrations: [Sentry.browserTracingIntegration()],
    });
    log("Sentry initialized", "info");
  })
  .catch(() => log("Could not load Sentry DSN from /config", "err"));

// --- Logging UI ---

function log(message, type = "ok") {
  const container = document.getElementById("log");
  const ts = new Date().toLocaleTimeString();
  const entry = document.createElement("div");
  entry.className = "entry";
  entry.innerHTML = `<span class="ts">${ts}</span><span class="${type}">${message}</span>`;
  container.prepend(entry);
}

// --- Demo actions ---

function setUser() {
  const name = document.getElementById("username").value.trim() || "anonymous";
  Sentry.setUser({ username: name, email: `${name}@example.com` });
  log(`User context set: ${name}`, "info");
}

async function fetchUsers() {
  Sentry.addBreadcrumb({ category: "ui", message: "User clicked Fetch Users", level: "info" });
  try {
    const res = await fetch("/api/users");
    const users = await res.json();
    log(`Fetched ${users.length} users: ${users.map((u) => u.name).join(", ")}`, "ok");
  } catch (err) {
    Sentry.captureException(err);
    log(`Fetch failed: ${err.message}`, "err");
  }
}

function triggerUnhandledError() {
  Sentry.addBreadcrumb({ category: "ui", message: "User triggered unhandled error", level: "warning" });
  log("Throwing unhandled error...", "warn");
  // setTimeout pushes this outside the current call stack so it becomes a true unhandled exception
  setTimeout(() => {
    throw new Error("Unhandled frontend exception (demo)");
  }, 0);
}

function triggerHandledError() {
  try {
    // Deliberately access a property on undefined
    const obj = undefined;
    const _ = obj.property;
  } catch (err) {
    Sentry.captureException(err, {
      tags: { demo: "handled-error" },
      extra: { hint: "This was caught manually and reported via captureException" },
    });
    log(`Caught and reported: ${err.message}`, "warn");
  }
}

async function triggerServerCrash() {
  Sentry.addBreadcrumb({ category: "api", message: "Calling /api/crash", level: "error" });
  try {
    const res = await fetch("/api/crash");
    const body = await res.json();
    log(`Server response: ${JSON.stringify(body)}`, "err");
  } catch (err) {
    Sentry.captureException(err);
    log(`Network error: ${err.message}`, "err");
  }
}

async function triggerServerHandledError() {
  const res = await fetch("/api/handled-error");
  const body = await res.json();
  log(`Server handled error — status ${res.status}: ${body.error}`, "warn");
}

async function triggerSlowEndpoint() {
  log("Calling slow endpoint...", "info");
  const start = Date.now();
  await Sentry.startSpan({ name: "frontend-slow-request", op: "http.client" }, async () => {
    const res = await fetch("/api/slow");
    const body = await res.json();
    const elapsed = Date.now() - start;
    log(`Slow response received in ${elapsed}ms: ${body.message}`, "ok");
  });
}

function captureCustomMessage() {
  const msg = `Custom frontend message at ${new Date().toISOString()}`;
  Sentry.captureMessage(msg, "info");
  log(`Sent to Sentry: "${msg}"`, "info");
}
