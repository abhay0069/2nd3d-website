/**
 * Boot watchdog — the counterpart to `components/ErrorBoundary`.
 *
 * 1.0.0 black-screened after first paint: a broken gsap module graph threw
 * before React ever mounted, so no error boundary could render. The watchdog
 * covers exactly that window:
 *
 *   1. if `#root` is still empty `BOOT_TIMEOUT` after the module runs, or an
 *      uncaught error / rejected promise escapes during the boot window,
 *      trigger one automatic reload;
 *   2. a `sessionStorage` flag guarantees exactly one auto-reload per tab
 *      session, so a persistently broken build can never enter a reload loop;
 *   3. if the root is *still* empty after that one attempt, paint a static
 *      fallback straight into the document — visitors get an explanation and
 *      a reload button instead of a black screen.
 */

const FLAG = 'obscura:watchdog:attempted';
const BOOT_WINDOW_MS = 15_000;
const BOOT_TIMEOUT_MS = 6_000;

const alreadyAttempted = (): boolean => {
  try {
    return sessionStorage.getItem(FLAG) === '1';
  } catch {
    return true; // storage unavailable — stay conservative, never loop
  }
};

const markAttempted = (): void => {
  try {
    sessionStorage.setItem(FLAG, '1');
  } catch {
    /* storage unavailable — fall through, reload still happens once */
  }
};

/** Static, dependency-free fallback: no bundle, no stylesheets, no React. */
const paintFallback = (): void => {
  const root = document.getElementById('root');
  if (!root || root.childElementCount > 0) return;

  root.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.setAttribute('role', 'alert');
  wrap.style.cssText = [
    'position:fixed',
    'inset:0',
    'display:flex',
    'flex-direction:column',
    'align-items:center',
    'justify-content:center',
    'gap:1.25rem',
    'padding:2rem',
    'background:#0b0b0c',
    'color:#f2efe9',
    'text-align:center',
    "font-family:'Space Grotesk','Helvetica Neue',sans-serif",
  ].join(';');

  const label = document.createElement('p');
  label.textContent = 'Signal lost';
  label.style.cssText =
    'margin:0;font-size:0.68rem;letter-spacing:0.32em;text-transform:uppercase;color:#ff4a1f';

  const title = document.createElement('h1');
  title.textContent = 'The experience could not initialize.';
  title.style.cssText = 'margin:0;font-size:clamp(1.6rem,5vw,3rem);font-weight:500;line-height:1.1';

  const body = document.createElement('p');
  body.textContent =
    'The reload attempt did not bring the studio back. Try once more — if it keeps failing, come back in a moment.';
  body.style.cssText = 'margin:0;max-width:34rem;font-size:0.95rem;line-height:1.6;color:#c9c5bd';

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'RELOAD';
  button.style.cssText = [
    'margin-top:0.5rem',
    'padding:0.9rem 1.6rem',
    'background:#ff4a1f',
    'color:#0b0b0c',
    'border:none',
    'border-radius:4px',
    'font-size:0.7rem',
    'letter-spacing:0.28em',
    'text-transform:uppercase',
    'cursor:pointer',
  ].join(';');
  button.addEventListener('click', () => window.location.reload());

  wrap.append(label, title, body, button);
  root.append(wrap);
};

/** One recovery attempt: reload once per tab session, else degrade visibly. */
const recover = (): void => {
  if (alreadyAttempted()) {
    paintFallback();
    return;
  }
  markAttempted();
  window.location.reload();
};

/** Start the watchdog — call once, before React renders. */
export function startWatchdog(): void {
  const bootStart = performance.now();
  const withinBootWindow = (): boolean => performance.now() - bootStart < BOOT_WINDOW_MS;

  // Uncaught runtime errors (async callbacks, ticker work) during boot.
  const onEscape = (event: Event): void => {
    if (!withinBootWindow()) return;
    console.error('[OBSCURA] boot-window failure:', event);
    if (alreadyAttempted()) return; // second strike: never loop, let the boundary speak
    recover();
  };
  window.addEventListener('error', onEscape);
  window.addEventListener('unhandledrejection', onEscape);

  // Boot stall: first paint happened but React never populated the root.
  window.setTimeout(() => {
    const root = document.getElementById('root');
    if (root && root.childElementCount === 0) recover();
  }, BOOT_TIMEOUT_MS);
}
