import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { startWatchdog } from './utils/watchdog';
import './styles/global.css';

// Watchdog first: if anything (or nothing) renders, first paint never
// degrades to a black screen without a recovery path.
startWatchdog();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
