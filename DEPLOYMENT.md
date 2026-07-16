# Deployment guide

## 1. Serve the site with Caddy

Append the contents of this repository's `Caddyfile` to `/etc/caddy/Caddyfile`, then validate and reload:

```bash
sudo caddy fmt --overwrite /etc/caddy/Caddyfile
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
curl -I http://127.0.0.1:8083
```

## 2. Add the Cloudflare Tunnel ingress

In `/home/akash/.cloudflared/config.yml`, add this entry immediately before the final `http_status:404` rule:

```yaml
  - hostname: akash.tw
    service: http://127.0.0.1:8083
```

Validate and restart the tunnel:

```bash
cloudflared tunnel ingress validate
sudo systemctl restart cloudflared
sudo systemctl status cloudflared --no-pager
```

## 3. Move DNS to Cloudflare

The domain must use the nameservers assigned by the Cloudflare zone. Change the nameservers at the domain registrar, then wait for Cloudflare to mark the zone active.

Once active, route the hostname to the existing tunnel:

```bash
cloudflared tunnel route dns 89937102-5243-4007-92f7-b8feb90d8966 akash.tw
```

Cloudflare creates the proxied DNS record. Remove any conflicting root `A`, `AAAA`, or `CNAME` records first.

## 4. Verify publicly

```bash
curl -I https://akash.tw
```

Confirm the response is `200`, then test the desktop and mobile layouts in a browser.
