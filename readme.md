# AI x Commerce Hackathon — Starter Repo

Build an AI-native commerce tool in 4 hours. Everything hard is already done.

## Quick Start

```bash
# 1. Fork this repo, then clone your fork
git clone https://github.com/YOUR_USERNAME/hackathon-starter.git
cd hackathon-starter

# 2. Set your credentials (from your printed card)
cp .env.example .env
# Edit .env — paste your SHOPIFY_ACCESS_TOKEN and SHOPIFY_STORE_URL

# 3. Install everything
npm run setup

# 4. Start both frontend + backend
npm run dev

# 5. Open http://localhost:3000
# You should see a working dashboard with live data
```

## What You Get

- **Working dashboard** with KPIs, charts, product table, and live order feed
- **Real Shopify store** with 50 products, customers, and orders
- **Live data** — new orders arrive every 30-120 seconds via the simulator
- **Full API access** — read/write products, orders, customers, inventory, storefront
- **Pre-built components** — charts (pure SVG), tables, cards, modals, badges
- **Claude Code ready** — CLAUDE.md has everything Claude needs to build features from natural language

## Your Store

| What | Where |
|------|-------|
| Dashboard | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| Health Check | http://localhost:8000/health |
| Store Admin | https://YOUR-STORE.myshopify.com/admin |
| Storefront | https://YOUR-STORE.myshopify.com |

Credentials are on your printed card.

## Build Something

Open Claude Code in this repo and try:

> "Create a page that predicts when each product will go out of stock based on sales velocity"

> "Build a customer segmentation view using RFM analysis with a donut chart"

> "Add a live anomaly detector that flags unusual order patterns"

See `CLAUDE.md` for the full API reference, component library, and more example prompts.
See `docs/IDEAS.md` for 10 build ideas with difficulty ratings.

## Project Structure

```
frontend/           <- You work here
  pages/            <- Add new pages (auto-routed)
  components/       <- Charts, tables, cards, layout
  hooks/            <- Data fetching hooks
  lib/              <- API client, types, utilities
  styles/           <- Tailwind dark theme

backend/            <- FastAPI + SQLite (runs locally, don't need to modify)
  app/              <- API endpoints, Shopify sync, order simulator

docs/               <- API reference + build ideas
CLAUDE.md           <- The brain — Claude Code reads this
SETUP.md            <- Detailed setup instructions
```

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS (dark theme)
- **Backend**: FastAPI, SQLite, async Python
- **Store**: Shopify Dev Store with full API access
- **Real-time**: Server-Sent Events for live order updates

## Useful Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start frontend + backend |
| `npm run setup` | Install all dependencies |
| `npm run sync` | Force re-sync from Shopify |
| `npm run reset` | Wipe local DB and re-sync fresh |

---

Built for the AI x Commerce Hackathon — Growzilla x Forest City.
