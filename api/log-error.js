// Vercel Function (Web Standard fetch handler). Deployed automatically by
// Vercel from the /api directory alongside the static Vite build - no extra
// config needed.
//
// The frontend POSTs crash details here whenever it hits an uncaught error.
// Unlike a plain text log line, every report is normalized into a
// structured error event and kept in memory for this function instance, so
// a monitoring integration can GET this same endpoint and read the current
// error/crash state programmatically instead of having to parse log text.
// (This is a small in-memory store, not a database - it resets on cold
// start. That's the right tradeoff for a project this size; a real service
// would back it with persistent storage.)
const CONSOLE_BY_LEVEL = {
  WARNING: 'warn',
  ERROR: 'error',
  FATAL: 'error',
};

const MAX_EVENTS = 20;

let events = [];
let crashed = false;

function componentFromStack(componentStack) {
  const firstLine = (componentStack ?? '').trim().split('\n')[0] ?? '';
  const match = firstLine.match(/in\s+(\S+)/);
  return match ? match[1] : 'unknown-component';
}

function componentFor(source, componentStack) {
  if (source === 'react-error-boundary') return componentFromStack(componentStack);
  if (source === 'window.onerror') return 'window';
  if (source === 'unhandledrejection') return 'promise';
  return 'unknown';
}

function actionFor(source) {
  if (source === 'react-error-boundary') return 'render';
  if (source === 'window.onerror') return 'script';
  if (source === 'unhandledrejection') return 'async';
  return 'unknown';
}

function currentState() {
  const lastEvent = events[0] ?? null;
  return {
    crashed,
    status: lastEvent?.status ?? 'OK',
    lastEvent,
    events,
  };
}

export default {
  async fetch(request) {
    const authHeader = request.headers.get('Authorization');
    const expectedSecret = process.env.CRASH_REPORT_SECRET;

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (request.method === 'GET') {
      return new Response(JSON.stringify(currentState()), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let payload = {};
    try {
      payload = await request.json();
    } catch {
      payload = {};
    }

    const {
      source = 'unknown',
      level = 'ERROR',
      message = 'Unknown error',
      stack = '',
      componentStack = '',
      url = '',
      userAgent = '',
      timestamp = new Date().toISOString(),
    } = payload;

    const event = {
      errorId: crypto.randomUUID(),
      type: source,
      status: level,
      timestamp,
      component: componentFor(source, componentStack),
      action: actionFor(source),
      message,
      details: { stack, componentStack, url, userAgent },
      crashed: level === 'FATAL',
    };

    if (level === 'FATAL') {
      crashed = true;
    }

    events = [event, ...events].slice(0, MAX_EVENTS);

    console[CONSOLE_BY_LEVEL[level] ?? 'error']('[client-crash]', JSON.stringify(event));

    return new Response(JSON.stringify({ ok: true, errorId: event.errorId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
