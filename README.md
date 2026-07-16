# akash.tw portfolio

A fast, framework-free portfolio for Akash Raj Patel, hosted on a local Caddy instance and exposed through Cloudflare Tunnel.

## Local preview

```bash
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173`.

## Production layout

- Static site root: `/home/akash/akash-portfolio`
- Local Caddy listener: `http://127.0.0.1:8083`
- Public hostname: `https://akash.tw`
- Tunnel origin: `http://127.0.0.1:8083`

The repository's `Caddyfile` is a self-contained site config. Either run it as a separate service or add its site block to the system Caddyfile. See `DEPLOYMENT.md` for exact setup instructions.

## Editing

The site has no build step or dependencies:

- `index.html` — page copy and structure
- `styles.css` — responsive layout and design
- `script.js` — reveal animation and header behavior
- `assets/` — local portrait and favicon

After editing, refresh the page. Changes are served directly from the working tree.
