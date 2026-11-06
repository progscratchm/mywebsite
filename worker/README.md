# CMS login broker

A Cloudflare Worker that lets the editor at `/admin/` sign in with GitHub.
GitHub Pages is static and cannot hold an OAuth client secret; this Worker
holds it instead and hands the CMS a token.

## Deploy

```bash
cd worker
npx wrangler login                     # opens Cloudflare in a browser
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
npx wrangler deploy
```

`wrangler deploy` prints the Worker URL. Put it in `public/admin/config.yml`
as `base_url`, then commit and push.

## The GitHub OAuth app

GitHub → Settings → Developer settings → OAuth Apps → **New OAuth App**

- Application name: anything, e.g. "Maxime's Lab editor"
- Homepage URL: `https://maximecousot.com`
- Authorization callback URL: `https://<worker-url>/callback`

Copy the Client ID, generate a client secret, and feed both to
`wrangler secret put` above.

## Notes

- `ALLOWED_ORIGINS` in `wrangler.toml` restricts which sites can receive a
  token. Keep it tight — anything listed there can obtain repo access.
- The `repo` scope is what lets the CMS commit. It grants access to all the
  account's repositories; GitHub's OAuth apps cannot scope to just one.
