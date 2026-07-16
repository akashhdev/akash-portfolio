# Deployment guide

## Current server state

- The portfolio is live on the local origin at `http://127.0.0.1:8083`.
- The running Caddy configuration includes the portfolio route.
- `/home/akash/.cloudflared/config.yml` includes the `akash.tw` ingress.
- The PM2-managed `langx-cloudflared` connector has been restarted and saved.

## 1. Persist the Caddy configuration

The validated combined configuration is staged at `/tmp/Caddyfile.akash-tw`. Install it before the next server reboot:

```bash
sudo cp /tmp/Caddyfile.akash-tw /etc/caddy/Caddyfile
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
curl -I http://127.0.0.1:8083
```

If the staged file is no longer available, append the repository's `Caddyfile` site block to `/etc/caddy/Caddyfile` instead, then format, validate, and reload it.

## 2. Cloudflare Tunnel ingress

This entry is already installed immediately before the final `http_status:404` rule:

```yaml
  - hostname: akash.tw
    service: http://127.0.0.1:8083
```

To validate or restart it later, use PM2 (the tunnel is not a systemd service on this server):

```bash
cloudflared tunnel ingress validate
pm2 restart langx-cloudflared
pm2 save
pm2 describe langx-cloudflared
```

## 3. Move DNS to Cloudflare

The domain must use the nameservers assigned by the Cloudflare zone. Change the nameservers at the domain registrar, then wait for Cloudflare to mark the zone active.

Once active, route the hostname to the existing tunnel:

```bash
cloudflared tunnel route dns 89937102-5243-4007-92f7-b8feb90d8966 akash.tw
```

Cloudflare creates the proxied DNS record. Remove any conflicting root `A`, `AAAA`, or `CNAME` records first.

## 4. Publish the repository

Authenticate GitHub CLI interactively, then create and push the repository:

```bash
cd /home/akash/akash-portfolio
gh auth login -h github.com -p https -w
gh repo create akash-portfolio --public --source=. --remote=origin --push \
  --description "Personal portfolio for akash.tw"
```

## 5. Verify publicly

```bash
curl -I https://akash.tw
```

Confirm the response is `200`, then test the desktop and mobile layouts in a browser.
