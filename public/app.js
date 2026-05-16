const SENTRY_DSN = "https://e98b4e112484db52c7424038d16bf001@o4511401575186432.ingest.us.sentry.io/4511401596289025";

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: "development",
  integrations: [Sentry.browserTracingIntegration()],
});

// ── Slide definitions ──────────────────────────────────────────────────────

const slides = [
  {
    type: "intro",
    title: "Observability\nfor the Modern Web",
    description:
      "In production, things break silently. Users leave without a word. Sentry gives you full visibility into what's breaking, who was affected, and what led up to it — on both the frontend and backend.",
    chips: ["Automatic error capture", "Full user & request context", "Frontend + backend"],
  },
  {
    concept: "Sentry.init()",
    title: "Setup",
    description: "One init call on each end. That's all it takes for Sentry to start watching.",
    points: [
      "Backend: init + one error handler middleware registered after all routes",
      "Frontend: init + browserTracingIntegration for automatic fetch tracing",
      "Both can share one Sentry project or use separate ones",
    ],
    code: `// server.js
Sentry.init({
  dsn: "YOUR_DSN",
  tracesSampleRate: 1.0,
});

// registered after all routes:
Sentry.setupExpressErrorHandler(app);


// app.js (browser)
Sentry.init({
  dsn: "YOUR_DSN",
  tracesSampleRate: 1.0,
  integrations: [
    Sentry.browserTracingIntegration(),
  ],
});`,
    actions: [],
  },
  {
    concept: "Automatic capture",
    title: "Unhandled Errors",
    description: "Anything you don't catch is captured automatically. No extra code needed.",
    points: [
      "Backend: Sentry's Express middleware intercepts the thrown exception",
      "Frontend: global window.onerror and unhandledrejection handlers",
      "Full stack trace, request headers, and environment in the dashboard",
    ],
    code: `// Backend — just throw, Sentry catches it
app.get("/api/crash", (req, res) => {
  throw new Error("Something went wrong");
});


// Frontend — same story
setTimeout(() => {
  throw new Error("Unhandled frontend error");
}, 0);
// setTimeout escapes the call stack so
// it becomes a true unhandled exception`,
    actions: [
      { label: "Throw frontend error", fn: "throwUnhandledError", danger: true },
      { label: "Crash the server", fn: "triggerServerCrash", danger: true },
    ],
  },
  {
    concept: "Sentry.captureException()",
    title: "Handled Errors",
    description: "Catch an error, but still want to know it happened? Report it manually and attach context.",
    points: [
      "Tags let you filter and group events in the dashboard",
      "Extra data appears alongside the stack trace for debugging",
      "The server still returns a clean response to the client",
    ],
    code: `try {
  JSON.parse("not valid json {{");
} catch (err) {
  Sentry.captureException(err, {
    tags: { endpoint: "/api/handled-error" },
    extra: { hint: "Caught and reported manually" },
  });
  res.status(422).json({ error: "Bad input" });
}`,
    actions: [
      { label: "Frontend handled error", fn: "triggerHandledError" },
      { label: "Server handled error", fn: "triggerServerHandledError" },
    ],
  },
  {
    concept: "Sentry.setUser()",
    title: "User Context",
    description: "Attach identity to every event. Know exactly who was affected and how often.",
    points: [
      "Call it once after login — applied to all subsequent events",
      "Filter and search events by user in the dashboard",
      "Essential for support, impact analysis, and SLA tracking",
    ],
    code: `// Call this after the user logs in
Sentry.setUser({
  username: "alice",
  email: "alice@example.com",
});

// From now on, every error Sentry
// captures will include Alice's info.`,
    actions: [
      { label: "Set user & trigger error", fn: "setUserAndError" },
    ],
  },
  {
    concept: "Sentry.addBreadcrumb()",
    title: "Breadcrumbs",
    description: "Every Sentry event includes a timeline of what happened before it. Fetch calls and console logs are captured automatically — you can add manual ones too.",
    points: [
      "Automatic: fetch requests, console logs, navigation changes",
      "Manual: annotate key user actions with addBreadcrumb()",
      "Turns 'something broke' into 'here's exactly what the user did'",
    ],
    code: `Sentry.addBreadcrumb({
  category: "ui",
  message: "User clicked submit",
  level: "info",
});

// When the next error fires, the
// breadcrumb trail will appear in
// the Sentry event timeline.`,
    actions: [
      { label: "Step 1 — Add breadcrumb & fetch", fn: "addBreadcrumbAndFetch" },
      { label: "Step 2 — Trigger error", fn: "throwUnhandledError", danger: true },
    ],
  },
  {
    concept: "Sentry.startSpan()",
    title: "Performance Monitoring",
    description: "Go beyond errors. Wrap slow operations in a span — they appear as a waterfall in the Performance tab.",
    points: [
      "Spans are grouped into transactions for a full request trace",
      "Works across frontend and backend (distributed tracing)",
      "Compatible with OpenTelemetry",
    ],
    code: `await Sentry.startSpan(
  { name: "db-query", op: "db.query" },
  async () => {

    // This takes ~1500ms.
    // Sentry records it as a named span
    // inside the current transaction.
    await slowDatabaseQuery();

  }
);`,
    actions: [
      { label: "Call slow endpoint (~1500ms)", fn: "triggerSlowEndpoint" },
    ],
  },
];

// ── State & navigation ────────────────────────────────────────────────────

let current = 0;

const slideArea    = document.getElementById("slide-area");
const counterEl    = document.getElementById("counter");
const progressFill = document.getElementById("progress-fill");
const prevBtn      = document.getElementById("prev");
const nextBtn      = document.getElementById("next");

function navigate(dir) {
  current = Math.max(0, Math.min(slides.length - 1, current + dir));
  render();
}

prevBtn.addEventListener("click", () => navigate(-1));
nextBtn.addEventListener("click", () => navigate(1));

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowDown") navigate(1);
  if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   navigate(-1);
});

// ── Render ────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function render() {
  const slide = slides[current];

  counterEl.textContent      = `${current + 1} / ${slides.length}`;
  progressFill.style.width   = `${((current + 1) / slides.length) * 100}%`;
  prevBtn.disabled           = current === 0;
  nextBtn.disabled           = current === slides.length - 1;

  if (slide.type === "intro") {
    slideArea.innerHTML = `
      <div class="slide centered">
        <h1>${slide.title.replace("\n", "<br>")}</h1>
        <p class="intro-description">${slide.description}</p>
        <div class="intro-chips">
          ${slide.chips.map(c => `<div class="intro-chip">${c}</div>`).join("")}
        </div>
      </div>`;
    return;
  }

  const actionsHtml = (slide.actions || []).map(a =>
    `<button class="${a.danger ? "danger" : ""}" onclick="${a.fn}()">${a.label}</button>`
  ).join("");

  slideArea.innerHTML = `
    <div class="slide">
      <div class="slide-body">
        <div class="slide-left">
          ${slide.concept ? `<span class="concept-tag">${slide.concept}</span>` : ""}
          <h2>${slide.title}</h2>
          <p class="description">${slide.description}</p>
          <ul class="points">
            ${(slide.points || []).map(p => `<li>${p}</li>`).join("")}
          </ul>
        </div>
        <div class="slide-right">
          ${slide.code ? `
            <div class="code-block">
              <pre><code class="language-javascript">${escapeHtml(slide.code)}</code></pre>
            </div>` : ""}
          ${actionsHtml ? `
            <div class="demo-area">
              <div class="actions">${actionsHtml}</div>
              <div class="log" id="log">
                <span class="log-ts">ready</span><span class="log-info">Click a button to run the live demo.</span>
              </div>
            </div>` : ""}
        </div>
      </div>
    </div>`;

  document.querySelectorAll("pre code").forEach(el => hljs.highlightElement(el));
}

// ── Log utility ───────────────────────────────────────────────────────────

function log(message, type = "ok") {
  const container = document.getElementById("log");
  if (!container) return;
  // Clear placeholder on first real entry
  if (container.querySelector(".log-info") && container.children.length === 1) {
    container.innerHTML = "";
  }
  const ts = new Date().toLocaleTimeString();
  const entry = document.createElement("div");
  entry.className = "log-entry";
  entry.innerHTML = `<span class="log-ts">${ts}</span><span class="log-${type}">${message}</span>`;
  container.appendChild(entry);
  container.scrollTop = container.scrollHeight;
}

// ── Demo actions ──────────────────────────────────────────────────────────

function throwUnhandledError() {
  Sentry.addBreadcrumb({ category: "demo", message: "Throwing unhandled error", level: "warning" });
  log("Throwing unhandled error — check your Sentry dashboard...", "warn");
  setTimeout(() => { throw new Error("Unhandled frontend exception (demo)"); }, 0);
}

async function triggerServerCrash() {
  Sentry.addBreadcrumb({ category: "demo", message: "Calling /api/crash", level: "error" });
  log("Calling /api/crash...", "info");
  const res  = await fetch("/api/crash");
  const body = await res.json();
  log(`Server responded ${res.status}: "${body.error}" — check Sentry`, "err");
}

function triggerHandledError() {
  try {
    void (undefined).property;
  } catch (err) {
    Sentry.captureException(err, {
      tags: { demo: "handled-error" },
      extra: { hint: "Caught manually via captureException" },
    });
    log(`Caught & reported to Sentry: ${err.message}`, "warn");
  }
}

async function triggerServerHandledError() {
  const res  = await fetch("/api/handled-error");
  const body = await res.json();
  log(`Server caught it (${res.status}): "${body.error}" — check Sentry for the event`, "warn");
}

function setUserAndError() {
  Sentry.setUser({ username: "alice", email: "alice@example.com" });
  log("User set: alice — triggering error in 300ms...", "info");
  setTimeout(() => {
    log("Error fired — open Sentry and look for alice in the event", "warn");
    throw new Error("Error attributed to alice (demo)");
  }, 300);
}

async function addBreadcrumbAndFetch() {
  Sentry.addBreadcrumb({ category: "ui", message: "User clicked the fetch button", level: "info" });
  log("Manual breadcrumb added. Fetching users...", "info");
  const res   = await fetch("/api/users");
  const users = await res.json();
  log(`Fetched ${users.length} users. Now click Step 2 — the error will carry this breadcrumb trail.`, "ok");
}

async function triggerSlowEndpoint() {
  log("Starting span and calling /api/slow...", "info");
  const start = Date.now();
  await Sentry.startSpan({ name: "frontend-slow-request", op: "http.client" }, async () => {
    const res  = await fetch("/api/slow");
    await res.json();
    log(`Completed in ${Date.now() - start}ms — check the Sentry Performance tab`, "ok");
  });
}

// ── Init ──────────────────────────────────────────────────────────────────
render();
