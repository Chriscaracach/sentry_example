import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import * as Sentry from '@sentry/react';
import { fetchUsers, simulateCrash, simulateHandledError, simulateSlowOperation } from '../api.js';

export default function DemoSlide({ slide, lang }) {
  const [entries, setEntries] = useState([]);

  const log = (message, type = 'ok') => {
    setEntries((prev) => [...prev, { message, type, ts: new Date().toLocaleTimeString() }]);
  };

  const t = (en, es) => (lang === 'es' ? es : en);

  function throwUnhandledError() {
    Sentry.addBreadcrumb({ category: 'demo', message: 'Throwing unhandled error', level: 'warning' });
    log(t('Throwing — check Sentry dashboard...', 'Lanzando — revisá el dashboard de Sentry...'), 'warn');
    setTimeout(() => { throw new Error('Unhandled frontend exception (demo)'); }, 0);
  }

  async function triggerUnhandledRejection() {
    log(t('Triggering unhandled rejection...', 'Generando rechazo de promesa no controlado...'), 'warn');
    await simulateCrash(); // not caught → unhandledrejection → Sentry
  }

  function triggerHandledError() {
    try {
      void undefined.property;
    } catch (err) {
      Sentry.captureException(err, {
        tags: { demo: 'handled-error' },
        extra: { hint: 'Caught manually via captureException' },
      });
      log(t(`Caught & reported: ${err.message}`, `Capturado y reportado: ${err.message}`), 'warn');
    }
  }

  async function triggerServerHandledError() {
    try {
      await simulateHandledError();
    } catch (err) {
      Sentry.captureException(err, {
        tags: { area: 'data-processing' },
        extra: { hint: 'Caught manually' },
      });
      log(t(`Caught & reported: ${err.message}`, `Capturado y reportado: ${err.message}`), 'warn');
    }
  }

  function setUserAndError() {
    Sentry.setUser({ username: 'alice', email: 'alice@example.com' });
    log(t('User set: alice — throwing in 300ms...', 'Usuario: alice — lanzando en 300ms...'), 'info');
    setTimeout(() => {
      log(t('Error fired — find alice in the Sentry event', 'Error lanzado — buscá a alice en el evento'), 'warn');
      throw new Error('Error attributed to alice (demo)');
    }, 300);
  }

  async function addBreadcrumbAndFetch() {
    Sentry.addBreadcrumb({ category: 'ui', message: 'User clicked the fetch button', level: 'info' });
    log(t('Breadcrumb added. Fetching users...', 'Breadcrumb agregado. Buscando usuarios...'), 'info');
    const users = await fetchUsers();
    log(t(
      `Fetched ${users.length} users. Click Step 2 — the error will carry this trail.`,
      `${users.length} usuarios obtenidos. Hacé clic en el Paso 2 — el error llevará este breadcrumb.`
    ), 'ok');
  }

  async function triggerSlowOperation() {
    log(t('Starting span...', 'Iniciando span...'), 'info');
    const start = Date.now();
    await Sentry.startSpan({ name: 'slow-operation', op: 'function' }, async () => {
      await simulateSlowOperation();
      log(t(
        `Done in ${Date.now() - start}ms — check the Performance tab in Sentry`,
        `Listo en ${Date.now() - start}ms — revisá la pestaña Performance en Sentry`
      ), 'ok');
    });
  }

  const actionMap = {
    throwUnhandledError,
    triggerUnhandledRejection,
    triggerHandledError,
    triggerServerHandledError,
    setUserAndError,
    addBreadcrumbAndFetch,
    triggerSlowOperation,
  };

  return (
    <div className="slide">
      <div className="slide-body">
        <div className="slide-left">
          {slide.concept && <span className="concept-tag">{slide.concept}</span>}
          <h2>{slide.title}</h2>
          <p className="description">{slide.description}</p>
          <ul className="points">
            {(slide.points || []).map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
        <div className="slide-right">
          {slide.code && (
            <div className="code-block">
              <SyntaxHighlighter
                language="javascript"
                style={vscDarkPlus}
                customStyle={{ margin: 0, borderRadius: '8px', fontSize: '0.82rem', lineHeight: '1.55' }}
              >
                {slide.code}
              </SyntaxHighlighter>
            </div>
          )}
          {slide.actions?.length > 0 && (
            <div className="demo-area">
              <div className="actions">
                {slide.actions.map((action) => (
                  <button
                    key={action.label}
                    className={action.danger ? 'danger' : ''}
                    onClick={() => actionMap[action.fn]?.()}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
              <div className="log">
                {entries.length === 0
                  ? <span className="log-placeholder">{t('Click a button to run the live demo.', 'Hacé clic en un botón para ejecutar el demo.')}</span>
                  : entries.map((e, i) => (
                    <div key={i} className="log-entry">
                      <span className="log-ts">{e.ts}</span>
                      <span className={`log-${e.type}`}>{e.message}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
