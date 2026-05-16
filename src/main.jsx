import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App.jsx';
import './App.css';

Sentry.init({
  dsn: 'https://e98b4e112484db52c7424038d16bf001@o4511401575186432.ingest.us.sentry.io/4511401596289025',
  tracesSampleRate: 1.0,
  environment: 'development',
  integrations: [Sentry.browserTracingIntegration()],
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<p>Something went wrong</p>}>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);
