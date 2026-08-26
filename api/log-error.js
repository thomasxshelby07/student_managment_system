// Vercel Function (Web Standard fetch handler). Deployed automatically by
// Vercel from the /api directory alongside the static Vite build - no extra
// config needed.
//
// The frontend POSTs crash details here whenever it hits an uncaught error.
// Logging it means it shows up in the Vercel dashboard's Runtime Logs for
// this deployment, even though the crash itself happened in someone else's
// browser. The `level` field (WARNING / ERROR / FATAL) is what a monitoring
// integration would key off of to decide how loudly to alert.
const CONSOLE_BY_LEVEL = {
  WARNING: 'warn',
  ERROR: 'error',
  FATAL: 'error',
};

export default {
  async fetch(request) {
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

    const logFn = CONSOLE_BY_LEVEL[level] ?? 'error';
    console[logFn](
      '[client-crash]',
      JSON.stringify({ level, source, message, url, userAgent, timestamp, stack, componentStack })
    );

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
