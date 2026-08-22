# Akash Raj Patel — research portfolio

A research-first interactive résumé built with Next.js App Router, TypeScript, server-rendered MDX, and a standalone Node production target.

The homepage is a continuous, section-navigated résumé with desktop scrollspy navigation, an accessible mobile swipe drawer, URL-addressable entry previews, and an unchanged downloadable PDF résumé.

## Local development

```bash
npm install
npm run dev -- --hostname 127.0.0.1 --port 4173
```

Open `http://127.0.0.1:4173`.

## Quality checks

```bash
npm run lint
npm test
npm run build
npm run test:e2e
```

Writing templates in `content/writing/` begin with an underscore and are drafts. Drafts are excluded from public indexes, routes, RSS, sitemap, and production metadata.

## Production

The build uses `output: "standalone"`. Run `.next/standalone/server.js` on `127.0.0.1:3003` and place Caddy in front on `127.0.0.1:8083`. See `DEPLOYMENT.md` for build, health, restart, logs, and rollback procedures.
