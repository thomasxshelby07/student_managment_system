// Sends crash details to our own /api/log-error function so they end up in
// Vercel's Runtime Logs. Best-effort only: if the request fails (for example
// while running `npm run dev` locally, where /api isn't served), we just
// swallow it - reporting a crash should never itself cause a crash.
//
// Every report carries a severity `level` (WARNING / ERROR / FATAL) so the
// monitoring side can tell a noteworthy-but-survivable issue apart from one
// that actually took the whole app down. FATAL reports also flip the app
// into its crashed state (see registerCrashHandler) instead of leaving the
// user looking at a small inline error message as if nothing happened.
let crashHandler = null;

export function registerCrashHandler(fn) {
  crashHandler = fn;
}

function levelFor(source) {
  // Anything the top-level ErrorBoundary had to catch means a whole screen
  // failed to render, and an uncaught window error is by definition unhandled
  // - both leave the app in a broken state. A rejected promise on its own
  // doesn't necessarily break the UI, so it's logged as ERROR, not FATAL.
  if (source === 'react-error-boundary' || source === 'window.onerror') return 'FATAL';
  return 'ERROR';
}

export function reportCrash(details) {
  const level = levelFor(details.source);

  try {
    fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        ...details,
        level,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {});
  } catch {
    // ignore - reporting must never throw
  }

  if (level === 'FATAL') {
    crashHandler?.(details);
  }
}

export function initCrashReporting() {
  window.addEventListener('error', (event) => {
    reportCrash({
      source: 'window.onerror',
      message: event.message,
      stack: event.error?.stack ?? '',
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    reportCrash({
      source: 'unhandledrejection',
      message: event.reason?.message ?? String(event.reason),
      stack: event.reason?.stack ?? '',
    });
  });
}
