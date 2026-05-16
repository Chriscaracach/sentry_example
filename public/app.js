const SENTRY_DSN = "https://e98b4e112484db52c7424038d16bf001@o4511401575186432.ingest.us.sentry.io/4511401596289025";

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: "development",
  integrations: [Sentry.browserTracingIntegration()],
});

// ── Language ──────────────────────────────────────────────────────────────

let lang = "en";

function t(en, es) {
  return lang === "es" ? es : en;
}

// ── Slide definitions ─────────────────────────────────────────────────────
// Each slide has `en` and `es` objects for translated content.
// `code` is shared (code stays in English).
// `actions[].fn` is shared; `actions[].label` is per-language.

const slides = [
  {
    type: "speaker",
    en: { eyebrow: "About the speaker" },
    es: { eyebrow: "Sobre el ponente" },
  },
  {
    type: "intro",
    en: {
      title: "Observability\nfor the Modern Web",
      description:
        "In production, things break silently. Users leave without a word. Sentry gives you full visibility into what's breaking, who was affected, and what led up to it — on both the frontend and backend.",
      chips: ["Automatic error capture", "Full user & request context", "Frontend + backend"],
    },
    es: {
      title: "Observabilidad\npara la Web Moderna",
      description:
        "En producción, las cosas fallan en silencio. Los usuarios se van sin decir una palabra. Sentry te da visibilidad completa sobre qué está fallando, quién fue afectado y qué lo causó — en el frontend y en el backend.",
      chips: ["Captura automática de errores", "Contexto completo del usuario", "Frontend + backend"],
    },
  },
  {
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
    en: {
      concept: "Sentry.init()",
      title: "Setup",
      description: "One init call on each end. That's all it takes for Sentry to start watching.",
      points: [
        "Backend: init + one error handler middleware registered after all routes",
        "Frontend: init + browserTracingIntegration for automatic fetch tracing",
        "Both can share one Sentry project or use separate ones",
      ],
    },
    es: {
      concept: "Sentry.init()",
      title: "Configuración",
      description: "Una sola llamada init en cada extremo. Con eso, Sentry empieza a observar.",
      points: [
        "Backend: init + un middleware de errores registrado después de todas las rutas",
        "Frontend: init + browserTracingIntegration para rastreo automático de fetch",
        "Ambos pueden compartir un proyecto de Sentry o usar proyectos separados",
      ],
    },
  },
  {
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
    en: {
      concept: "Automatic capture",
      title: "Unhandled Errors",
      description: "Anything you don't catch is captured automatically. No extra code needed.",
      points: [
        "Backend: Sentry's Express middleware intercepts the thrown exception",
        "Frontend: global window.onerror and unhandledrejection handlers",
        "Full stack trace, request headers, and environment in the dashboard",
      ],
      actions: [
        { label: "Throw frontend error", fn: "throwUnhandledError", danger: true },
        { label: "Crash the server",     fn: "triggerServerCrash",  danger: true },
      ],
    },
    es: {
      concept: "Captura automática",
      title: "Errores No Controlados",
      description: "Todo lo que no capturás se captura automáticamente. Sin código adicional.",
      points: [
        "Backend: el middleware de Sentry intercepta la excepción lanzada",
        "Frontend: manejadores globales de window.onerror y unhandledrejection",
        "Stack trace completo, headers de la request y entorno en el dashboard",
      ],
      actions: [
        { label: "Lanzar error en el frontend", fn: "throwUnhandledError", danger: true },
        { label: "Crashear el servidor",         fn: "triggerServerCrash",  danger: true },
      ],
    },
  },
  {
    code: `try {
  JSON.parse("not valid json {{");
} catch (err) {
  Sentry.captureException(err, {
    tags: { endpoint: "/api/handled-error" },
    extra: { hint: "Caught and reported manually" },
  });
  res.status(422).json({ error: "Bad input" });
}`,
    en: {
      concept: "Sentry.captureException()",
      title: "Handled Errors",
      description: "Catch an error, but still want to know it happened? Report it manually and attach context.",
      points: [
        "Tags let you filter and group events in the dashboard",
        "Extra data appears alongside the stack trace for debugging",
        "The server still returns a clean response to the client",
      ],
      actions: [
        { label: "Frontend handled error", fn: "triggerHandledError" },
        { label: "Server handled error",   fn: "triggerServerHandledError" },
      ],
    },
    es: {
      concept: "Sentry.captureException()",
      title: "Errores Controlados",
      description: "¿Capturaste un error pero igual querés rastrearlo? Repórtalo manualmente y adjuntá contexto.",
      points: [
        "Las tags permiten filtrar y agrupar eventos en el dashboard",
        "Los datos extra aparecen junto al stack trace para facilitar el debug",
        "El servidor sigue devolviendo una respuesta limpia al cliente",
      ],
      actions: [
        { label: "Error controlado (frontend)", fn: "triggerHandledError" },
        { label: "Error controlado (servidor)", fn: "triggerServerHandledError" },
      ],
    },
  },
  {
    code: `// Call this after the user logs in
Sentry.setUser({
  username: "alice",
  email: "alice@example.com",
});

// From now on, every error Sentry
// captures will include Alice's info.`,
    en: {
      concept: "Sentry.setUser()",
      title: "User Context",
      description: "Attach identity to every event. Know exactly who was affected and how often.",
      points: [
        "Call it once after login — applied to all subsequent events automatically",
        "Filter and search events by user in the dashboard",
        "Essential for support, impact analysis, and SLA tracking",
      ],
      actions: [
        { label: "Set user & trigger error", fn: "setUserAndError" },
      ],
    },
    es: {
      concept: "Sentry.setUser()",
      title: "Contexto de Usuario",
      description: "Adjuntá identidad a cada evento. Sabé exactamente quién fue afectado y con qué frecuencia.",
      points: [
        "Llamalo una vez después del login — se aplica a todos los eventos siguientes",
        "Filtrá y buscá eventos por usuario en el dashboard",
        "Esencial para soporte, análisis de impacto y seguimiento de SLAs",
      ],
      actions: [
        { label: "Establecer usuario y lanzar error", fn: "setUserAndError" },
      ],
    },
  },
  {
    code: `Sentry.addBreadcrumb({
  category: "ui",
  message: "User clicked submit",
  level: "info",
});

// When the next error fires, the
// breadcrumb trail will appear in
// the Sentry event timeline.`,
    en: {
      concept: "Sentry.addBreadcrumb()",
      title: "Breadcrumbs",
      description: "Every Sentry event includes a timeline of what happened before it. Fetch calls and console logs are captured automatically — you can add manual ones too.",
      points: [
        "Automatic: fetch requests, console logs, navigation changes",
        "Manual: annotate key user actions with addBreadcrumb()",
        "Turns 'something broke' into 'here's exactly what the user did'",
      ],
      actions: [
        { label: "Step 1 — Add breadcrumb & fetch", fn: "addBreadcrumbAndFetch" },
        { label: "Step 2 — Trigger error",          fn: "throwUnhandledError", danger: true },
      ],
    },
    es: {
      concept: "Sentry.addBreadcrumb()",
      title: "Breadcrumbs",
      description: "Cada evento de Sentry incluye una línea de tiempo de lo que ocurrió antes. Las llamadas fetch y los logs se capturan automáticamente; también podés agregar los tuyos.",
      points: [
        "Automático: requests fetch, console.log, cambios de navegación",
        "Manual: anotá acciones clave con addBreadcrumb()",
        "Convierte 'algo se rompió' en 'esto es exactamente lo que hizo el usuario'",
      ],
      actions: [
        { label: "Paso 1 — Agregar breadcrumb y hacer fetch", fn: "addBreadcrumbAndFetch" },
        { label: "Paso 2 — Lanzar error",                    fn: "throwUnhandledError", danger: true },
      ],
    },
  },
  {
    code: `await Sentry.startSpan(
  { name: "db-query", op: "db.query" },
  async () => {

    // This takes ~1500ms.
    // Sentry records it as a named span
    // inside the current transaction.
    await slowDatabaseQuery();

  }
);`,
    en: {
      concept: "Sentry.startSpan()",
      title: "Performance Monitoring",
      description: "Go beyond errors. Wrap slow operations in a span — they appear as a waterfall in the Performance tab.",
      points: [
        "Spans are grouped into transactions for a full request trace",
        "Works across frontend and backend (distributed tracing)",
        "Compatible with OpenTelemetry",
      ],
      actions: [
        { label: "Call slow endpoint (~1500ms)", fn: "triggerSlowEndpoint" },
      ],
    },
    es: {
      concept: "Sentry.startSpan()",
      title: "Monitoreo de Performance",
      description: "Más allá de los errores. Envolvé operaciones lentas en un span — aparecen como un waterfall en la pestaña de Performance.",
      points: [
        "Los spans se agrupan en transacciones para una traza completa de la request",
        "Funciona en frontend y backend (rastreo distribuido)",
        "Compatible con OpenTelemetry",
      ],
      actions: [
        { label: "Llamar al endpoint lento (~1500ms)", fn: "triggerSlowEndpoint" },
      ],
    },
  },
];

// ── State & navigation ────────────────────────────────────────────────────

let current = 0;

const slideArea    = document.getElementById("slide-area");
const counterEl    = document.getElementById("counter");
const progressFill = document.getElementById("progress-fill");
const prevBtn      = document.getElementById("prev");
const nextBtn      = document.getElementById("next");
const langEnBtn    = document.getElementById("lang-en");
const langEsBtn    = document.getElementById("lang-es");

function navigate(dir) {
  current = Math.max(0, Math.min(slides.length - 1, current + dir));
  render();
}

function setLang(l) {
  lang = l;
  langEnBtn.classList.toggle("active", l === "en");
  langEsBtn.classList.toggle("active", l === "es");
  render();
}

prevBtn.addEventListener("click", () => navigate(-1));
nextBtn.addEventListener("click", () => navigate(1));
langEnBtn.addEventListener("click", () => setLang("en"));
langEsBtn.addEventListener("click", () => setLang("es"));

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowDown") navigate(1);
  if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   navigate(-1);
});

// ── Render ────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Merges shared fields with the current language's fields
function localize(raw) {
  return { ...raw, ...raw[lang] };
}

function render() {
  const slide = localize(slides[current]);

  counterEl.textContent    = `${current + 1} / ${slides.length}`;
  progressFill.style.width = `${((current + 1) / slides.length) * 100}%`;
  prevBtn.disabled         = current === 0;
  nextBtn.disabled         = current === slides.length - 1;

  if (slide.type === "speaker") {
    slideArea.innerHTML = `
      <div class="slide centered">
        <div class="speaker-card">
          <img src="/assets/chris.jpeg" class="speaker-photo" alt="Speaker photo" />
          <div class="speaker-info">
            <p class="speaker-eyebrow">${slide.eyebrow}</p>
            <h1 class="speaker-name ph">[Your Name]</h1>
            <p class="speaker-role ph">[Your Role / Title]</p>
            <p class="speaker-company ph">[Your Company]</p>
            <div class="speaker-divider"></div>
            <p class="speaker-bio ph">[A short bio or tagline that says something about you]</p>
            <p class="speaker-handle ph">@[yourhandle]</p>
          </div>
        </div>
      </div>`;
    return;
  }

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
                <span class="log-ts">ready</span><span class="log-info">${t("Click a button to run the live demo.", "Hacé clic en un botón para ejecutar el demo.")}</span>
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
  log(t("Throwing unhandled error — check your Sentry dashboard...", "Lanzando error no controlado — revisá el dashboard de Sentry..."), "warn");
  setTimeout(() => { throw new Error("Unhandled frontend exception (demo)"); }, 0);
}

async function triggerServerCrash() {
  Sentry.addBreadcrumb({ category: "demo", message: "Calling /api/crash", level: "error" });
  log(t("Calling /api/crash...", "Llamando a /api/crash..."), "info");
  const res  = await fetch("/api/crash");
  const body = await res.json();
  log(t(`Server responded ${res.status}: "${body.error}" — check Sentry`, `El servidor respondió ${res.status}: "${body.error}" — revisá Sentry`), "err");
}

function triggerHandledError() {
  try {
    void (undefined).property;
  } catch (err) {
    Sentry.captureException(err, {
      tags: { demo: "handled-error" },
      extra: { hint: "Caught manually via captureException" },
    });
    log(t(`Caught & reported to Sentry: ${err.message}`, `Capturado y reportado a Sentry: ${err.message}`), "warn");
  }
}

async function triggerServerHandledError() {
  const res  = await fetch("/api/handled-error");
  const body = await res.json();
  log(t(`Server caught it (${res.status}): "${body.error}" — check Sentry`, `El servidor lo capturó (${res.status}): "${body.error}" — revisá Sentry`), "warn");
}

function setUserAndError() {
  Sentry.setUser({ username: "alice", email: "alice@example.com" });
  log(t("User set: alice — triggering error in 300ms...", "Usuario establecido: alice — lanzando error en 300ms..."), "info");
  setTimeout(() => {
    log(t("Error fired — open Sentry and look for alice in the event", "Error lanzado — abrí Sentry y buscá a alice en el evento"), "warn");
    throw new Error("Error attributed to alice (demo)");
  }, 300);
}

async function addBreadcrumbAndFetch() {
  Sentry.addBreadcrumb({ category: "ui", message: "User clicked the fetch button", level: "info" });
  log(t("Manual breadcrumb added. Fetching users...", "Breadcrumb manual agregado. Buscando usuarios..."), "info");
  const res   = await fetch("/api/users");
  const users = await res.json();
  log(t(
    `Fetched ${users.length} users. Now click Step 2 — the error will carry this breadcrumb trail.`,
    `Se obtuvieron ${users.length} usuarios. Ahora hacé clic en el Paso 2 — el error llevará este breadcrumb.`
  ), "ok");
}

async function triggerSlowEndpoint() {
  log(t("Starting span and calling /api/slow...", "Iniciando span y llamando a /api/slow..."), "info");
  const start = Date.now();
  await Sentry.startSpan({ name: "frontend-slow-request", op: "http.client" }, async () => {
    const res = await fetch("/api/slow");
    await res.json();
    log(t(
      `Completed in ${Date.now() - start}ms — check the Sentry Performance tab`,
      `Completado en ${Date.now() - start}ms — revisá la pestaña Performance de Sentry`
    ), "ok");
  });
}

// ── Init ──────────────────────────────────────────────────────────────────
setLang("en");
