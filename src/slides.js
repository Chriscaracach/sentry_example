export const slides = [
  {
    type: 'speaker',
    en: { eyebrow: 'About the speaker' },
    es: { eyebrow: 'Sobre el ponente' },
  },
  {
    type: 'intro',
    en: {
      title: 'Observability\nfor the Modern Web',
      description:
        'In production, things break silently. Users leave without a word. Sentry gives you full visibility into what\'s breaking, who was affected, and what led up to it.',
      chips: ['Automatic error capture', 'Full user & request context', 'Frontend + backend'],
    },
    es: {
      title: 'Observabilidad\npara la Web Moderna',
      description:
        'En producción, las cosas fallan en silencio. Los usuarios se van sin decir una palabra. Sentry te da visibilidad completa sobre qué está fallando, quién fue afectado y qué lo causó.',
      chips: ['Captura automática de errores', 'Contexto completo del usuario', 'Frontend + backend'],
    },
  },
  {
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
    actions: [],
    en: {
      concept: 'Sentry.init()',
      title: 'Setup',
      description: 'One init call. That\'s all it takes for Sentry to start watching.',
      points: [
        'init() configures the DSN, sample rate, and integrations',
        'browserTracingIntegration traces fetch calls and navigation automatically',
        'ErrorBoundary catches render errors and reports them to Sentry',
      ],
    },
    es: {
      concept: 'Sentry.init()',
      title: 'Configuración',
      description: 'Una sola llamada init. Con eso, Sentry empieza a observar.',
      points: [
        'init() configura el DSN, el sample rate y las integraciones',
        'browserTracingIntegration rastrea fetch y navegación automáticamente',
        'ErrorBoundary captura errores de render y los reporta a Sentry',
      ],
    },
  },
  {
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
    en: {
      concept: 'Automatic capture',
      title: 'Unhandled Errors',
      description: 'Anything you don\'t catch is captured automatically. No extra code needed.',
      points: [
        'window.onerror catches synchronous unhandled exceptions',
        'window.onunhandledrejection catches async ones',
        'Full stack trace, browser info, and user context in the dashboard',
      ],
      actions: [
        { label: 'Throw frontend error', fn: 'throwUnhandledError', danger: true },
        { label: 'Unhandled rejection', fn: 'triggerUnhandledRejection', danger: true },
      ],
    },
    es: {
      concept: 'Captura automática',
      title: 'Errores No Controlados',
      description: 'Todo lo que no capturás se captura automáticamente. Sin código adicional.',
      points: [
        'window.onerror captura excepciones síncronas no controladas',
        'window.onunhandledrejection captura las asíncronas',
        'Stack trace completo, info del browser y contexto del usuario en el dashboard',
      ],
      actions: [
        { label: 'Lanzar error en el frontend', fn: 'throwUnhandledError', danger: true },
        { label: 'Rechazo de promesa no controlado', fn: 'triggerUnhandledRejection', danger: true },
      ],
    },
  },
  {
    code: `try {
  JSON.parse("not valid json {{");
} catch (err) {
  Sentry.captureException(err, {
    tags: { area: "data-processing" },
    extra: { hint: "Caught manually" },
  });
}`,
    en: {
      concept: 'Sentry.captureException()',
      title: 'Handled Errors',
      description: 'Catch an error but still want to know it happened? Report it manually and attach context.',
      points: [
        'Tags let you filter and group events in the dashboard',
        'Extra data appears alongside the stack trace for debugging',
        'You control when and what to report',
      ],
      actions: [
        { label: 'Frontend handled error', fn: 'triggerHandledError' },
        { label: 'Simulated server error', fn: 'triggerServerHandledError' },
      ],
    },
    es: {
      concept: 'Sentry.captureException()',
      title: 'Errores Controlados',
      description: '¿Capturaste un error pero igual querés rastrearlo? Repórtalo manualmente y adjuntá contexto.',
      points: [
        'Las tags permiten filtrar y agrupar eventos en el dashboard',
        'Los datos extra aparecen junto al stack trace para facilitar el debug',
        'Vos decidís cuándo y qué reportar',
      ],
      actions: [
        { label: 'Error controlado (frontend)', fn: 'triggerHandledError' },
        { label: 'Error controlado (simulado)', fn: 'triggerServerHandledError' },
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
      concept: 'Sentry.setUser()',
      title: 'User Context',
      description: 'Attach identity to every event. Know exactly who was affected and how often.',
      points: [
        'Call it once after login — applied to all subsequent events automatically',
        'Filter and search events by user in the dashboard',
        'Essential for support, impact analysis, and SLA tracking',
      ],
      actions: [
        { label: 'Set user & trigger error', fn: 'setUserAndError' },
      ],
    },
    es: {
      concept: 'Sentry.setUser()',
      title: 'Contexto de Usuario',
      description: 'Adjuntá identidad a cada evento. Sabé exactamente quién fue afectado y con qué frecuencia.',
      points: [
        'Llamalo una vez después del login — se aplica a todos los eventos siguientes',
        'Filtrá y buscá eventos por usuario en el dashboard',
        'Esencial para soporte, análisis de impacto y seguimiento de SLAs',
      ],
      actions: [
        { label: 'Establecer usuario y lanzar error', fn: 'setUserAndError' },
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
// breadcrumb trail appears in the
// Sentry event timeline.`,
    en: {
      concept: 'Sentry.addBreadcrumb()',
      title: 'Breadcrumbs',
      description: 'Every event includes a timeline of what happened before it. Fetch calls and console logs are captured automatically.',
      points: [
        'Automatic: fetch requests, console logs, navigation changes',
        'Manual: annotate key actions with addBreadcrumb()',
        'Turns "something broke" into "here\'s exactly what the user did"',
      ],
      actions: [
        { label: 'Step 1 — Add breadcrumb & fetch', fn: 'addBreadcrumbAndFetch' },
        { label: 'Step 2 — Trigger error', fn: 'throwUnhandledError', danger: true },
      ],
    },
    es: {
      concept: 'Sentry.addBreadcrumb()',
      title: 'Breadcrumbs',
      description: 'Cada evento incluye una línea de tiempo de lo que ocurrió antes. Las llamadas fetch y los logs se capturan automáticamente.',
      points: [
        'Automático: requests fetch, console.log, cambios de navegación',
        'Manual: anotá acciones clave con addBreadcrumb()',
        'Convierte "algo se rompió" en "esto es exactamente lo que hizo el usuario"',
      ],
      actions: [
        { label: 'Paso 1 — Agregar breadcrumb y hacer fetch', fn: 'addBreadcrumbAndFetch' },
        { label: 'Paso 2 — Lanzar error', fn: 'throwUnhandledError', danger: true },
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
      concept: 'Sentry.startSpan()',
      title: 'Performance Monitoring',
      description: 'Go beyond errors. Wrap slow operations in a span — they appear as a waterfall in the Performance tab.',
      points: [
        'Spans are grouped into transactions for a full request trace',
        'Works across frontend and backend (distributed tracing)',
        'Compatible with OpenTelemetry',
      ],
      actions: [
        { label: 'Run slow operation (~1500ms)', fn: 'triggerSlowOperation' },
      ],
    },
    es: {
      concept: 'Sentry.startSpan()',
      title: 'Monitoreo de Performance',
      description: 'Más allá de los errores. Envolvé operaciones lentas en un span — aparecen como un waterfall en la pestaña de Performance.',
      points: [
        'Los spans se agrupan en transacciones para una traza completa',
        'Funciona en frontend y backend (rastreo distribuido)',
        'Compatible con OpenTelemetry',
      ],
      actions: [
        { label: 'Ejecutar operación lenta (~1500ms)', fn: 'triggerSlowOperation' },
      ],
    },
  },
];
