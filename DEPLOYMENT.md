# Production deployment

The portfolio runs as a standalone Next.js Node service behind Caddy and the existing Cloudflare Tunnel.

## Build a release

Use a versioned release directory so rollback never requires a destructive Git operation.

```bash
cd /home/akash/akash-portfolio
npm ci
npm test
npm run build
cp -a .next/standalone /home/akash/releases/portfolio-YYYYMMDD-HHMMSS
cp -a .next/static /home/akash/releases/portfolio-YYYYMMDD-HHMMSS/.next/static
cp -a public /home/akash/releases/portfolio-YYYYMMDD-HHMMSS/public
```

Set `NEXT_PUBLIC_SITE_URL=https://akash.tw`, `HOSTNAME=127.0.0.1`, and `PORT=3003` for the production process.

## PM2 service

```bash
cd /home/akash/releases/portfolio-YYYYMMDD-HHMMSS
HOSTNAME=127.0.0.1 PORT=3003 NEXT_PUBLIC_SITE_URL=https://akash.tw \
  pm2 start server.js --name akash-portfolio --time
pm2 save
```

For a release update, use `pm2 restart akash-portfolio --update-env`. Inspect with `pm2 logs akash-portfolio --lines 100` and `pm2 describe akash-portfolio`.

## Health and route checks

```bash
curl --fail http://127.0.0.1:3003/health
curl --fail http://127.0.0.1:8083/
curl --fail http://127.0.0.1:8083/research/tag-twin
curl --fail http://127.0.0.1:8083/apps
curl --fail http://127.0.0.1:8083/projects
curl --fail http://127.0.0.1:8083/writing
```

Validate and reload the repository Caddy configuration only after the Node health check succeeds:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

## Rollback

Keep at least two known-good release directories. Restart the PM2 process from the previous directory, verify `/health`, and reload Caddy only if its upstream changed. Do not reset the repository or delete the failed release until logs and artifacts have been inspected.
