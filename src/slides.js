export const slides = [
  {
    type: "title",
    title: "Sentry",
  },
  {
    type: "speaker",
    eyebrow: "Sobre mí",
  },
  {
    type: "companies",
    eyebrow: "",
    images: [
      "/assets/tiny.png",
      "/assets/tiny2.png",
      "/assets/cit.png",
      "/assets/cit2.png",
    ],
  },
  {
    type: "fullimage",
    image: "/assets/meme.png",
  },
  {
    type: "fullimage",
    image: "/assets/sentry.png",
  },
  {
    concept: "Sentry.init()",
    title: "Configuración",
    description: "Una sola llamada init. Con eso, Sentry empieza a observar.",
    points: [
      "init() configura el DSN(Data Source Name), el sample rate y las integraciones",
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
    concept: "Alertas",
    title: "Alertas",
    description:
      "Sentry te avisa antes de que el usuario lo note. Configurá reglas para recibir notificaciones cuando algo sale mal.",
    points: [
      "Alertas por tasa de errores: si el 5% de las requests fallan en 10 min, te avisa",
      "Alertas de performance: si el p95 de latencia supera 2s, se dispara",
      "Canales: Slack, email, PagerDuty, webhooks y más",
      "También podés configurar alertas por ausencia de eventos — si algo deja de pasar",
    ],
    actions: [],
    code: `// El nivel de severidad influye en las alertas

Sentry.captureMessage(
  "Stock crítico en inventario",
  "warning" // info | warning | error | fatal
);

// Las alertas se configuran en el dashboard:
// → Si error_rate > 5% en 10 min → Slack
// → Si p95 latency > 2000ms → PagerDuty
// → Nuevo error en producción → Email`,
  },

  {
    type: "fullimage",
    image: "/assets/slack1.jpeg",
  },
  {
    type: "fullimage",
    image: "/assets/slack2.jpeg",
  },
  {
    type: "fullimage",
    image: "/assets/slack3.jpeg",
  },
  {
    type: "fullimage",
    image: "/assets/message.jpeg",
  },

  {
    type: "thanks",
    subtitle: "¿Preguntas?",
    handle: "",
  },
];
