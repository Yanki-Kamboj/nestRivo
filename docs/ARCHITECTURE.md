# Architecture Overview

## 1. Existing Files and What Works
- `.agent/rules/nestrivo.md` – workspace rules for the project.
- `docs/PROGRESS.md` – progress tracking file (currently only the header).
- No client or server code exists yet.

## 2. Missing / Incomplete Parts
- No `client/` directory (frontend) – needs Vite + React setup.
- No `server/` directory (backend) – needs Express, Mongoose, JWT, etc.
- No `package.json` – project dependencies are not defined.
- No configuration files, models, routes, controllers, middleware, or utilities.
- No documentation such as `docs/NESTRIVO_SPEC.md` (the full spec) yet.

## 3. Proposed Final Folder Structure
```
NEST_RIVO/
├─ .agent/
│   └─ rules/
│       └─ nestrivo.md           # Workspace rules
├─ docs/
│   ├─ NESTRIVO_SPEC.md          # Full project specification (to be added)
│   ├─ PROGRESS.md               # Progress tracking
│   └─ ARCHITECTURE.md           # This document
├─ client/                       # Frontend (React + Vite)
│   ├─ src/
│   │   ├─ components/
│   │   ├─ pages/
│   │   ├─ hooks/
│   │   └─ App.jsx
│   ├─ public/
│   ├─ vite.config.ts
│   └─ package.json
├─ server/                       # Backend (Express)
│   ├─ src/
│   │   ├─ config/
│   │   ├─ controllers/
│   │   ├─ middleware/
│   │   ├─ models/
│   │   ├─ routes/
│   │   ├─ services/
│   │   └─ app.js
│   ├─ .env.example
│   └─ package.json
├─ package.json                 # Root (optional) for workspace scripts
└─ README.md                    # Project overview
```

## 4. Checklist for Upcoming Phases
- **Phase 2:** Set up backend foundation (install dependencies, create `server/app.js`, config, basic middleware, health endpoint).
- **Phase 3:** Implement all Mongoose models.
- **Phase 4:** Set up frontend foundation (Vite, Tailwind, routing, design system components).
- **Phase 5‑6:** Build authentication (backend & frontend).
- **Phase 7‑8:** Property management APIs and host UI wizard.
- **Phase 9‑11:** Search, home page, property details.
- **Phase 12‑13:** Booking engine and payment integration.
- **Phase 14‑16:** Wishlist, reviews, dashboards.
- **Phase 17‑18:** Admin panel and messaging.
- **Phase 19‑22:** Seed data, polishing, testing, deployment.

*All phases will update `docs/PROGRESS.md` accordingly.*

## Host Dashboard Additions (Phase 16)

- **`HostBlockedDate` model** – stores per‑property blocked date ranges and optional price overrides. Integrated into property availability checks.
- **`PlatformSettings` model** – singleton document that holds global settings such as `platformFeePct`. Used by earnings calculations.
- **Analytics aggregation** – monthly revenue (net after platform fee), occupancy rate, average nightly price, property performance. Test payments (`isTest:true`) are excluded.
