# Production deployment

The portfolio runs as a standalone Next.js Node service behind Caddy and the existing Cloudflare Tunnel.

## Automated deployment

The user-level `akash-portfolio-deploy.timer` checks the public `publish-portfolio` branch every two minutes. When the remote SHA differs from the active release marker, `scripts/deploy-if-needed.sh` invokes the guarded production deployment. This pull-based design requires no inbound webhook, deployment credential, or self-hosted GitHub Actions runner.

On the server, `scripts/deploy-production.sh`:

1. fetches `origin/publish-portfolio` and rejects any requested SHA that is not the branch tip;
2. builds the exact commit in an isolated Git worktree;
3. runs unit tests and the production build;
4. assembles a versioned standalone release;
5. starts it on port 3103 and checks health plus the project direct links;
6. switches PM2 only after preflight succeeds;
7. restores the previous release if the production process fails to become healthy; and
8. retains the previous release directory for manual rollback.

Install or refresh the checked-in systemd units with:

```bash
mkdir -p /home/akash/.config/systemd/user
cp ops/systemd/akash-portfolio-deploy.service /home/akash/.config/systemd/user/
cp ops/systemd/akash-portfolio-deploy.timer /home/akash/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now akash-portfolio-deploy.timer
```

Inspect the timer and recent deployments with `systemctl --user status akash-portfolio-deploy.timer` and `journalctl --user -u akash-portfolio-deploy.service -n 200`.

## Manual deployment

To deploy the current tip manually, pass its full SHA to the same guarded script:

```bash
cd /home/akash/akash-portfolio
./scripts/deploy-production.sh "$(git rev-parse origin/publish-portfolio)"
```

## PM2 service

```bash
cd /home/akash/releases/portfolio-YYYYMMDD-HHMMSS
HOSTNAME=127.0.0.1 PORT=3003 NEXT_PUBLIC_SITE_URL=https://akash.tw \
  pm2 start server.js --name akash-portfolio --time
pm2 save
```

Do not use `pm2 restart` to switch versioned release directories: PM2 retains the existing script path and working directory. Use the deployment script, which preflights the new release and updates the PM2 process path safely. Inspect with `pm2 logs akash-portfolio --lines 100` and `pm2 describe akash-portfolio`.

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
