# maximecousot.com

Maxime's inventor lab — a static site built with [Astro](https://astro.build),
edited through a visual editor ([Sveltia CMS](https://github.com/sveltia/sveltia-cms)),
hosted free on GitHub Pages.

## Quick start

This machine's system Node is 18.14, which Astro 5 doesn't support. An official
Node 22 build lives in `~/.local/node22` (no system changes were made). Put it
on your PATH first:

```bash
export PATH="$HOME/.local/node22/bin:$PATH"
```

Then:

```bash
npm install
npm run dev     # http://localhost:4321
```

## How Maxime adds a post, invention, app or photo

Two terminals:

```bash
npm run cms
```

```bash
npm run dev
```

Then open **http://localhost:4321/admin/** — a friendly editor with forms for
Notebook posts, Inventions, Apps and the Photo wall. Photos are dragged in and
land in `public/uploads/`. Saving writes markdown files straight into
`src/content/`. Commit and push, and the site redeploys itself.

> Remote editing (from an iPad, no terminal) needs one extra piece — see
> "Editing from anywhere" below.

## Content model

| Folder | What it is | Shows on |
| --- | --- | --- |
| `src/content/posts/` | Notebook posts | `/blog/` |
| `src/content/projects/` | Inventions | `/projects/` |
| `src/content/apps/` | App Store apps | `/apps/` |
| `src/content/photos/` | Photo wall entries | `/photos/` |

Schemas live in `src/content.config.ts`. Every item has `draft: true` available
so Maxime can write something and keep it secret until it's ready.

The three `public/uploads/placeholder-*.svg` files (and the photo entries that
point at them) are stand-ins — delete them once there are real photos.

## Going live on maximecousot.com

The site is live at https://github.com/progscratchm/mywebsite and deploys on every
push to `main`. The domain is still at GoDaddy showing their placeholder page.

**1. Push this repo to GitHub** (e.g. `progscratchm/mywebsite`).

**2. Turn on Pages:** repo → Settings → Pages → Source = **GitHub Actions**.
`.github/workflows/deploy.yml` builds and deploys on every push to `main`.

**3. Point the domain at GitHub.** In GoDaddy's DNS panel for maximecousot.com:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | `progscratchm.github.io.` |

Delete GoDaddy's existing A/CNAME records for `@` and `www` first (those are
what serve the "Be happy!" placeholder). Keep any MX records if email is on
that domain.

**4. Set the custom domain.** With GitHub Actions as the Pages source, the
`public/CNAME` file does *not* set the domain on its own — it must also be set in
the repo: Settings → Pages → Custom domain, enter `maximecousot.com` and
tick **Enforce HTTPS** once the certificate is issued (can take up to an hour).
`public/CNAME` already carries the domain through each build.

DNS propagation usually takes 10–60 minutes.

## Editing from anywhere (optional, do it later)

The local editor needs a terminal. To let Maxime edit from any browser, Sveltia
CMS needs a small GitHub OAuth helper, because GitHub Pages can't run server
code:

1. GitHub → Settings → Developer settings → **New OAuth App**
   (callback URL = your worker URL + `/callback`).
2. Deploy [`sveltia-cms-auth`](https://github.com/sveltia/sveltia-cms-auth) as a
   free Cloudflare Worker, with the client ID/secret as secrets.
3. Uncomment `base_url:` in `public/admin/config.yml` and point it at the worker.

Then `https://maximecousot.com/admin/` works from the iPad, with a GitHub login.

## Notes

- `src/site.ts` holds the site name, tagline and nav.
- Design tokens (colours, fonts, shadows) are at the top of `src/styles/global.css`.
- The contact address `hello@maximecousot.com` is a placeholder — set up the
  mailbox or change it in `src/pages/index.astro` and `src/pages/about.astro`.
- The Kaboom Tower App Store link in `src/content/apps/kaboom-tower.md` is a
  placeholder ID — swap it for the real one.
