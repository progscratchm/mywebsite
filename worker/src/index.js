/**
 * GitHub OAuth broker for Sveltia / Decap CMS on a static host.
 *
 * GitHub Pages can't keep a client secret, so the CMS hands off to this
 * Worker. Two endpoints:
 *
 *   GET /auth      -> redirect to GitHub's consent screen
 *   GET /callback  -> exchange ?code for a token, postMessage it to the opener
 *
 * Secrets (set with `wrangler secret put`):
 *   GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
 * Vars (in wrangler.toml):
 *   ALLOWED_ORIGINS  comma-separated list of sites allowed to receive a token
 */

const COOKIE = 'cms_oauth_state';

function htmlResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: { 'content-type': 'text/html;charset=UTF-8', 'cache-control': 'no-store' },
  });
}

function allowedOrigins(env) {
  return (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** The window.opener handshake both Decap and Sveltia listen for. */
function postMessagePage(status, payload, origin) {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  return htmlResponse(`<!doctype html><meta charset="utf-8"><title>Signing in…</title>
<body><p>Finishing sign-in…</p><script>
(function () {
  var message = ${JSON.stringify(message)};
  var target = ${JSON.stringify(origin)};
  function send(e) {
    if (e && e.data === 'authorizing:github') {
      window.removeEventListener('message', send);
      window.opener.postMessage(message, target);
    }
  }
  window.addEventListener('message', send, false);
  if (window.opener) {
    window.opener.postMessage('authorizing:github', target);
  } else {
    document.body.textContent = 'No opener window — close this tab and try again.';
  }
})();
</script></body>`);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origins = allowedOrigins(env);

    if (url.pathname === '/auth') {
      const siteOrigin = url.searchParams.get('site_id')
        ? `https://${url.searchParams.get('site_id')}`
        : origins[0];

      if (!origins.includes(siteOrigin)) {
        return htmlResponse('<p>That site is not allowed to use this login.</p>', 403);
      }

      // CSRF state, round-tripped through a cookie.
      const state = crypto.randomUUID();
      const target = new URL('https://github.com/login/oauth/authorize');
      target.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      target.searchParams.set('scope', 'repo,user');
      target.searchParams.set('state', `${state}|${siteOrigin}`);

      return new Response(null, {
        status: 302,
        headers: {
          location: target.toString(),
          'set-cookie': `${COOKIE}=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
        },
      });
    }

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      const rawState = url.searchParams.get('state') || '';
      const [state, siteOrigin] = rawState.split('|');

      const cookie = (request.headers.get('cookie') || '')
        .split(';')
        .map((c) => c.trim())
        .find((c) => c.startsWith(`${COOKIE}=`));
      const expected = cookie ? cookie.slice(COOKIE.length + 1) : null;

      if (!code || !state || state !== expected) {
        return htmlResponse('<p>Login failed: the request could not be verified. Try again.</p>', 400);
      }
      if (!origins.includes(siteOrigin)) {
        return htmlResponse('<p>That site is not allowed to use this login.</p>', 403);
      }

      const res = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { accept: 'application/json', 'content-type': 'application/json' },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });
      const data = await res.json();

      if (data.error || !data.access_token) {
        return postMessagePage('error', { message: data.error || 'no_token' }, siteOrigin);
      }
      return postMessagePage('success', { token: data.access_token, provider: 'github' }, siteOrigin);
    }

    return new Response('OAuth broker for Sveltia CMS. Use /auth.', {
      headers: { 'content-type': 'text/plain' },
    });
  },
};
