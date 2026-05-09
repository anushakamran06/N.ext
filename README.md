# N.ext — NUS Opportunity Feed

> You won't miss another opportunity at NUS.

A Chrome extension that aggregates Canvas deadlines, TalentConnect internships, NUS scholarships, Reddit r/NUS posts, and Devpost hackathons into one smart notification feed.

## Structure

```
extension/          Chrome Manifest V3 extension
  manifest.json
  background/       service-worker.js — alarms, backend polling, notifications
  content/          canvas.js, talentconnect.js
  popup/            popup.html/js/css, onboarding.html
  utils/            fingerprint.js, storage.js

backend/            FastAPI Python service
  main.py           /feed + /health endpoints
  cron.py           APScheduler jobs (Reddit, NUS pages, Devpost)
  models.py         SQLAlchemy FeedItem model
  database.py       async engine (PostgreSQL / SQLite fallback)
  scrapers/         reddit.py, nus_scholarships.py, nus_news.py, devpost.py
  Dockerfile

app/                Next.js 14 marketing site
  page.tsx          Landing page
  layout.tsx        Metadata + OpenGraph
  globals.css       Design tokens (dark theme, NUS blue #003D7C)
```

## Extension — quick start

1. Open `chrome://extensions`, enable Developer Mode
2. Click **Load unpacked** → select the `extension/` folder
3. Click the N.ext icon → pick your preset in onboarding

## Backend — local dev

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# API available at http://localhost:8000
# GET /health
# GET /feed?template=internship
```

## Marketing site — local dev

```bash
npm install
npm run dev
# http://localhost:3000
```

## Presets

| Preset | Sources |
|---|---|
| Freshman | Canvas · NUS Announcements · CCA/Hall openings |
| Internship Hunter | TalentConnect · Reddit r/NUS · Devpost hackathons |
| Scholarship Focused | NUS Scholarships page · Reddit r/NUS · Bursary announcements |

## Notification intelligence

- Each item fingerprinted: `djb2(title + source + date)`
- Skip if fingerprint seen before (30-day window)
- "Don't show like this" extracts keywords → suppresses future items matching 2+
- Max 5 notifications per source per day
