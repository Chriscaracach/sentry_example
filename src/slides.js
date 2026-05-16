export const slides = [
  {
    type: "speaker",
    eyebrow: "Sobre mí",
  },
  {
    type: "intro",
    title: "Observabilidad",
    description:
      "En producción, las cosas fallan en silencio. Los usuarios se van sin decir una palabra. Sentry te da visibilidad completa sobre qué está fallando, quién fue afectado y qué lo causó.",
    chips: [
      "Captura automática de errores",
      "Contexto completo del usuario",
      "Frontend + backend",
    ],
  },
  {
    concept: "Sentry.init()",
    title: "Configuración",
    description: "Una sola llamada init. Con eso, Sentry empieza a observar.",
    points: [
      "init() configura el DSN, el sample rate y las integraciones",
      "browserTracingIntegration rastrea fetch y navegación automáticamente",
      "ErrorBoundary captura errores de render y los reporta a Sentry",
    ],
    actions: [],
    code: `// main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_DSN",
  tracesSampleRate: 1.0,
  integrations: [
    Sentry.browserTracingIntegration(),
  ],
});

// Wrap your app for error boundaries:
<Sentry.ErrorBoundary fallback={<p>Error!</p>}>
  <App />
</Sentry.ErrorBoundary>`,
  },
  {
    concept: "Captura automática",
    title: "Errores No Controlados",
    description:
      "Todo lo que no capturás se captura automáticamente. Sin código adicional.",
    points: [
      "window.onerror captura excepciones síncronas no controladas",
      "window.onunhandledrejection captura las asíncronas",
      "Stack trace completo, info del browser y contexto del usuario en el dashboard",
    ],
    actions: [
      {
        label: "Lanzar error en el frontend",
        fn: "throwUnhandledError",
        danger: true,
      },
      {
        label: "Unhandled rejection",
        fn: "triggerUnhandledRejection",
        danger: true,
      },
    ],
    code: `// Unhandled errors are captured automatically

// JS exception:
setTimeout(() => {
  throw new Error("Unhandled error");
}, 0);

// Unhandled promise rejection:
async function load() {
  throw new Error("Failed"); // not caught
}
load(); // Sentry captures this`,
  },
  {
    concept: "Sentry.captureException()",
    title: "Errores Controlados",
    description:
      "¿Capturaste un error pero igual lo querés rastrear? Reportalo manualmente y adjuntá contexto.",
    points: [
      "Las tags permiten filtrar y agrupar eventos en el dashboard",
      "Los datos extra aparecen junto al stack trace para facilitar el debug",
      "Vos decidís cuándo y qué reportar",
    ],
    actions: [
      { label: "Error controlado (frontend)", fn: "triggerHandledError" },
      { label: "Error controlado (simulado)", fn: "triggerServerHandledError" },
    ],
    code: `try {
  JSON.parse("not valid json {{");
} catch (err) {
  Sentry.captureException(err, {
    tags: { area: "data-processing" },
    extra: { hint: "Caught manually" },
  });
}`,
  },
  {
    concept: "Sentry.setUser()",
    title: "Contexto de Usuario",
    description:
      "Adjuntá identidad a cada evento. Sabé exactamente quién fue afectado y con qué frecuencia.",
    points: [
      "Llamalo una vez después del login — se aplica a todos los eventos siguientes",
      "Filtrá y buscá eventos por usuario en el dashboard",
    ],
    actions: [
      { label: "Establecer usuario y lanzar error", fn: "setUserAndError" },
    ],
    code: `// Call this after the user logs in
Sentry.setUser({
  username: "alice",
  email: "alice@example.com",
});

// From now on, every error Sentry
// captures will include Alice's info.`,
  },
  {
    concept: "Sentry.addBreadcrumb()",
    title: "Breadcrumbs",
    description:
      "Cada evento incluye una línea de tiempo de lo que ocurrió antes. Las llamadas fetch y los logs se capturan automáticamente.",
    points: [
      "Automático: requests fetch, console.log, cambios de navegación",
      "Manual: anotá acciones clave con addBreadcrumb()",
      "Convierte 'algo se rompió' en 'esto es exactamente lo que hizo el usuario'",
    ],
    actions: [
      {
        label: "Paso 1 — Agregar breadcrumb y hacer fetch",
        fn: "addBreadcrumbAndFetch",
      },
      {
        label: "Paso 2 — Lanzar error",
        fn: "throwUnhandledError",
        danger: true,
      },
    ],
    code: `Sentry.addBreadcrumb({
  category: "ui",
  message: "User clicked submit",
  level: "info",
});

// When the next error fires, the
// breadcrumb trail appears in the
// Sentry event timeline.`,
  },
  {
    concept: "Sentry.startSpan()",
    title: "Monitoreo de Performance",
    description:
      "Más allá de los errores. Envolvé operaciones lentas en un span — aparecen como un waterfall en la pestaña de Performance.",
    points: [
      "Los spans se agrupan en transacciones para una traza completa",
      "Funciona en frontend y backend (rastreo distribuido)",
    ],
    actions: [
      {
        label: "Ejecutar operación lenta (~1500ms)",
        fn: "triggerSlowOperation",
      },
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
  },
];
