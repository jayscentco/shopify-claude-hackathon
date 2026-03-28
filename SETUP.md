# Setup Guide

Get running in under 5 minutes. No Shopify experience required.

## Prerequisites
- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **Python 3.10+** — [python.org](https://python.org)
  - **Windows users**: When installing Python, check "Add Python to PATH". Use `python` instead of `python3` in commands below.
  - **Mac/Linux**: Python 3 is usually pre-installed. If not: `brew install python` (Mac) or `sudo apt install python3` (Linux).
- **pip** (Python package manager) — comes with Python. If missing: `python -m ensurepip`

## Steps

### 1. Copy environment file
```bash
cp .env.example .env
```

### 2. Add your credentials
Open `.env` and paste your team credentials from your printed card:
```
SHOPIFY_ACCESS_TOKEN=shpss_xxxxxxxxxxxxxxxxxxxxxx
SHOPIFY_STORE_URL=gzh-XX.myshopify.com
```

**Important**:
- `SHOPIFY_ACCESS_TOKEN` starts with `shpss_` — copy the full string from your card
- `SHOPIFY_STORE_URL` is just the domain, e.g. `gzh-07.myshopify.com` (no `https://`, no trailing slash)

### 3. Install dependencies
```bash
npm run setup
```
This runs preflight checks (Node + Python versions) then installs both frontend and backend dependencies.

**If this fails:**
- "python3 not found" on Windows → Make sure Python is in your PATH. Try closing and reopening your terminal.
- "pip not found" → Run `python -m ensurepip --upgrade`
- "concurrently not found" → Run `npm install` in the root directory first

### 4. Start the app
```bash
npm run dev
```
This starts both services:
- **Backend API** at http://localhost:8000
- **Frontend dashboard** at http://localhost:3000

On first start, the backend automatically syncs your store's products, orders, and customers into a local SQLite database. This takes ~30 seconds. Watch the terminal for progress.

### 5. Verify everything works
```bash
# In a new terminal tab:
curl http://localhost:8000/health
```
You should see: `"status": "ok"`, `"shopify": "connected"`, and `"products_synced": 50`.

Then open http://localhost:3000 — you should see a working dashboard with real data.

## What's Running

| Service | URL | What it does |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Next.js dashboard — **this is what you build** |
| Backend API | http://localhost:8000 | FastAPI — fetches & caches Shopify data locally |
| API Docs | http://localhost:8000/docs | Auto-generated Swagger docs (browse all endpoints) |
| Health Check | http://localhost:8000/health | Verify Shopify connection + DB status |

## Team Setup (Important!)

If your team has multiple people:

1. **Everyone** forks/clones the repo and sets up their own `.env`
2. **Only ONE person** runs with `SIMULATOR_ENABLED=true` (the default). This creates fake orders every 60-180 seconds.
3. **Everyone else** sets `SIMULATOR_ENABLED=false` in their `.env` to avoid duplicate simulated orders.
4. Each person runs their own frontend + backend locally — you all have the same Shopify store but independent local databases.

## Useful Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start both frontend + backend |
| `npm run setup` | Install all dependencies |
| `npm run sync` | Force re-sync data from Shopify |
| `npm run reset` | Wipe local database and re-sync fresh |

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Module not found" | Run `npm run setup` again |
| Backend won't start | Check Python: `python --version` (Windows) or `python3 --version` (Mac/Linux) |
| No data on dashboard | Wait 30s for initial sync. Check terminal for errors. Run `curl localhost:8000/health` |
| "Invalid API key" | Double-check `SHOPIFY_ACCESS_TOKEN` in `.env` — it should start with `shpss_` |
| Dashboard shows "demo data" | Backend isn't reachable. Make sure `npm run dev` started both servers (look for "API" and "WEB" in terminal) |
| Port 3000/8000 in use | Kill the process: `npx kill-port 3000` or `npx kill-port 8000` |
| Everything broken | Run `npm run reset` to wipe and re-sync |

## Next Steps
1. Read `CLAUDE.md` — it has the full API reference, component library, and example prompts
2. Read `docs/IDEAS.md` — 10 build ideas with difficulty ratings
3. Open Claude Code in this directory and start building!
