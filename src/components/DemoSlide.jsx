import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import * as Sentry from '@sentry/react';
import { fetchUsers, simulateCrash, simulateHandledError, simulateSlowOperation } from '../api.js';

export default function DemoSlide({ slide }) {
  const [entries, setEntries] = useState([]);

  const log = (message, type = 'ok') => {
    setEntries((prev) => [...prev, { message, type, ts: new Date().toLocaleTimeString() }]);
  };

  function throwUnhandledError() {
    Sentry.addBreadcrumb({ category: 'demo', message: 'Throwing unhandled error', level: 'warning' });
    log('Lanzando error no controlado — revisá el dashboard de Sentry...', 'warn');
    setTimeout(() => { throw new Error('Unhandled frontend exception (demo)'); }, 0);
  }

  async function triggerUnhandledRejection() {
    log('Generando rechazo de promesa no controlado...', 'warn');
    await simulateCrash();
  }

  function triggerHandledError() {
    try {
      void undefined.property;
    } catch (err) {
      Sentry.captureException(err, {
        tags: { demo: 'handled-error' },
        extra: { hint: 'Caught manually via captureException' },
      });
      log(`Capturado y reportado: ${err.message}`, 'warn');
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
      log(`Capturado y reportado: ${err.message}`, 'warn');
    }
  }

  function setUserAndError() {
    Sentry.setUser({ username: 'alice', email: 'alice@example.com' });
    log('Usuario: alice — lanzando error en 300ms...', 'info');
    setTimeout(() => {
      log('Error lanzado — buscá a alice en el evento de Sentry', 'warn');
      throw new Error('Error attributed to alice (demo)');
    }, 300);
  }

  async function addBreadcrumbAndFetch() {
    Sentry.addBreadcrumb({ category: 'ui', message: 'User clicked the fetch button', level: 'info' });
    log('Breadcrumb agregado. Buscando usuarios...', 'info');
    const users = await fetchUsers();
    log(`${users.length} usuarios obtenidos. Hacé clic en el Paso 2 — el error llevará este breadcrumb.`, 'ok');
  }

  async function triggerSlowOperation() {
    log('Iniciando span...', 'info');
    const start = Date.now();
    await Sentry.startSpan({ name: 'slow-operation', op: 'function' }, async () => {
      await simulateSlowOperation();
      log(`Listo en ${Date.now() - start}ms — revisá la pestaña Performance en Sentry`, 'ok');
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
                customStyle={{ margin: 0, borderRadius: '8px', fontSize: '1.6rem', lineHeight: '1.6' }}
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
                  ? <span className="log-placeholder">Hacé clic en un botón para ejecutar el demo.</span>
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
