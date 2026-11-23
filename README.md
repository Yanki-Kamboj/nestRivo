# NEST RIVO

## Overview
NEST RIVO is a full‑stack vacation‑rental marketplace built with **React + Vite** on the frontend and **Node / Express** + **MongoDB** on the backend. It supports guest‑host messaging, bookings, reviews, an admin dashboard, analytics, and a public storefront with static pages.

## One account for guests and hosts
Each person registers once and keeps one MongoDB user ID. All accounts retain guest capabilities; completing host onboarding adds host capabilities and a host profile to that same account. The dashboard switcher changes views without signing out. Properties reference their host user ID, and bookings store guest and host user IDs separately. The API enforces ownership and permissions, rejects self-bookings, and keeps admin assignment server-controlled. Host listings become visible to guests as soon as they are published.

For databases with existing accounts, run the idempotent capability migration from the `server` directory:
```bash
npm run migrate:capabilities
```

## Stack
- **Frontend:** React 18, Vite, TailwindCSS, React‑Router, TanStack Query, Framer Motion, Vitest + React Testing Library
- **Backend:** Node.js, Express, Mongoose, JWT authentication, Socket.IO, Supertest, Jest
- **Database:** MongoDB Atlas (or local MongoDB for development)
- **File storage:** Local uploads for development; durable object storage is needed for production
- **Payments:** Razorpay (Stripe stub can be swapped)
- **Hosting:** Client – Netlify (SPA redirect). Server – Render (or Railway) with health‑check endpoint.

## Screenshots
*(Add screenshots of the homepage, property listings, booking flow, admin panel, messaging UI, etc.)*

## Folder Structure
```
NEST_RIVO/
│   README.md                     # *This file*
│   netlify.toml                  # Netlify SPA config
│   render.yaml                   # Render service config
│   .eslintrc.json
│   .prettierrc
│
├─ client/                         # React app
│   ├─ src/
│   ├─ public/
│   └─ vite.config.ts
│
├─ server/                         # Express API
│   ├─ models/                     # Mongoose schemas
│   ├─ controllers/                # Route handlers
│   ├─ routes/                     # Express routers
│   ├─ middleware/                 # Auth, error handling, socket auth
│   ├─ seed/seed.js                # Database seed script
│   └─ .env.example                # Server env template
│
└─ docs/
    ├─ PROGRESS.md                # Phase‑by‑phase log
    └─ FINAL_REPORT.md            # Final implementation report
```

## Installation
```bash
# Clone the repository
git clone <repo‑url>
cd NEST_RIVO

# Install root dev tools (ESLint, Prettier)
npm install

# Install client dependencies
cd client && npm install && cd ..

# Install server dependencies
cd server && npm install && cd ..
```

## Environment Setup
Create `.env` files for both client and server based on the examples provided:
- `client/.env.example`
- `server/.env.example`

### Required server variables
```
MONGODB_URI=your‑mongodb‑atlas‑connection‑string
JWT_SECRET=your‑secret‑key
CLIENT_URL=https://your‑client‑domain.netlify.app
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
CONTACT_RECEIVER=support@nest‑rivo.com
SEED_DEFAULT_PASSWORD=Password123!
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

### Required client variables
```
VITE_API_URL=http://localhost:5000/api   # or your production API URL
```

## MongoDB Atlas
Create a free Atlas cluster, add a DB user, whitelist IPs, and use the connection string in `MONGODB_URI`.

## Listing photo uploads
Hosts can add up to five JPG, PNG, or WebP photos from a phone or computer when creating a listing. During local development, image files are stored under the ignored `uploads/` directory and served by the API. Cloudinary or another durable object-storage integration is not configured yet; add one before deploying to an ephemeral server filesystem.

## Razorpay / Stripe
Provide `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (or Stripe equivalents) for payment processing.

## Seeding the Database
```bash
# Load demo data (admin, hosts, guests, properties, etc.)
npm run seed
# To clear seeded data
npm run seed:destroy
```
Demo‑account credentials are listed in the **Demo Accounts** section below.

## Running Locally
```bash
# Start backend
cd server && npm run dev

# Start frontend
cd client && npm run dev
```
Client runs on `http://localhost:5173` and proxies API requests to `http://localhost:5000`.

## Testing
```bash
# Lint & format check
npm run lint

# Backend tests
cd server && npm test

# Frontend tests
cd client && npm test
```
All tests pass (see `docs/FINAL_REPORT.md` for exact numbers).

## Building for Production
```bash
# Client build
cd client && npm run build

# Server start (already compiled, just run)
cd server && npm start
```

## Deployment
### Client – Netlify
1. Connect the repository in Netlify.
2. Build command: `npm run build` (run inside the `client` folder).
3. Publish directory: `client/dist`.
4. Netlify reads `netlify.toml` for SPA redirect (`/* → /index.html`).

### Server – Render (or Railway)
1. Add a **Web Service** pointing to the `server` directory.
2. Build command: `npm install && npm run lint`.
3. Start command: `npm start` (runs `node server.js`).
4. Health‑check endpoint: `GET /api/health` returns `{status:"ok"}`.
5. Set all environment variables in the Render dashboard (same as `.env.example`).
6. Configure CORS to allow the Netlify domain (`origin: https://your‑site.netlify.app`).
7. Enable **Always Use HTTPS**.

## Demo Accounts
| Role  | Email               | Password |
|-------|---------------------|----------|
| Host  | host1@example.com   | `SEED_DEFAULT_PASSWORD` |
| Host  | host2@example.com   | `SEED_DEFAULT_PASSWORD` |
| Host  | host3@example.com   | `SEED_DEFAULT_PASSWORD` |
| Guest | guest1@example.com  | `SEED_DEFAULT_PASSWORD` |
| Guest | guest2@example.com  | `SEED_DEFAULT_PASSWORD` |
| Guest | guest3@example.com  | `SEED_DEFAULT_PASSWORD` |
| Guest | guest4@example.com  | `SEED_DEFAULT_PASSWORD` |
| Guest | guest5@example.com  | `SEED_DEFAULT_PASSWORD` |

There is no default admin account in a fresh local database. Create the first admin from the project directory in PowerShell:
```powershell
$env:ADMIN_EMAIL = Read-Host "Admin email"
$env:ADMIN_NAME = Read-Host "Admin name (only needed for a new account)"
$securePassword = Read-Host "Current account password or new admin password" -AsSecureString
$passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
try {
  $env:ADMIN_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPointer)
  npm run admin:create --prefix server
} finally {
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer)
  Remove-Item Env:ADMIN_EMAIL, Env:ADMIN_NAME, Env:ADMIN_PASSWORD -ErrorAction SilentlyContinue
}
```
If `ADMIN_EMAIL` belongs to an existing account, enter that account's current password to promote it while retaining its guest/host access. Otherwise, a new admin account is created and requires a 12-character minimum password. This local command only works when no admin already exists; ordinary registration cannot grant admin privileges.

## Known Limitations
- Payment integration uses Razorpay sandbox; production keys required.
- Email is a development-only console preview; production email delivery is not configured.
- Listing photos are uploaded locally during development; configure durable object storage before deploying to an ephemeral filesystem.
- Some admin analytics rely on real transaction data.
- Accessibility testing was limited to manual checks; further audits recommended.

---
*Happy coding!*