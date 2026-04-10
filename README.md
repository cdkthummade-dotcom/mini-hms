# HMS Mini — Patient Registration Portal

A lightweight, low-bandwidth Hospital Management System patient registration demo.

---

## Local Setup (Localhost)

### Prerequisites
- Node.js 20+
- A Supabase PostgreSQL account (free tier)
- An Upstash Redis account (free tier)
- A Cloudinary account (free 25 GB)

### 1. Clone & install

```bash
git clone <your-repo-url>
cd hms-registration

# Install server deps
cd server && npm install && cd ..

# Install client deps
cd client && npm install && cd ..
```

### 2. Configure environment

```bash
cp .env.example server/.env
# Edit server/.env with your credentials
```

Required values:
- `DATABASE_URL` — Supabase connection string (Settings → Database → Connection string → URI)
- `REDIS_URL` — Upstash Redis URL (starts with rediss://)
- `SESSION_SECRET` — any random 64-char string
- `CLOUDINARY_*` — from Cloudinary dashboard

### 3. Run database migrations

```bash
cd server && node scripts/migrate.js
```

### 4. Seed demo data

```bash
cd server && node scripts/seed.js
```

### 5. Start the server

```bash
cd server && npm run dev
# Server runs on http://localhost:5000
```

### 6. Start the client (new terminal)

```bash
cd client && npm run dev
# Client runs on http://localhost:5173
```

### 7. Login

Open http://localhost:5173 and use:

| Username | Password | Role |
|---|---|---|
| receptionist1 | Demo@1234 | Receptionist |
| receptionist2 | Demo@1234 | Receptionist |
| admin | Admin@1234 | Admin |
| superadmin | SuperAdmin@1234 | Super Admin |

---

## Demo Features

- **Patient Registration** — 45-field flat form with auto-fill (employee + pincode)
- **Pre-save Review Screen** — Receipt-style preview before confirming
- **UID Generation** — Format: `DH2026000001` (atomic, no duplicates)
- **Print Receipt** — A4 OPD slip with Code128 barcode
- **Session Timer** — Visible countdown with 15-minute warning
- **MLC Support** — Optional medico-legal case fields
- **Employee Auto-fill** — Fetch by Employee ID (EMP001–EMP005)
- **Pincode Auto-fill** — Calls India Post API, cached in Redis
- **Admin Dashboard** — Today/week/month counts, refreshes on page load
- **Master Management** — 7 masters with soft delete
- **Audit Log** — Full change history (Admin: basic, Super Admin: with IP/device)
- **Soft Delete Only** — Medical compliance, no hard deletes ever

---

## Running Tests

```bash
# Server unit tests
cd server && npm test

# Frontend tests
cd client && npm test

# All server tests
cd server && npx jest --runInBand --forceExit
```

---

## Deployment

### Backend → Render
1. Push to GitHub
2. Connect repo in Render → Web Service
3. Root dir: `server`, Start: `node server.js`
4. Add all env vars from `.env.example`
5. After deploy: `node scripts/migrate.js && node scripts/seed.js` via Render Shell

### Frontend → Vercel
1. Connect repo in Vercel
2. Build: `cd client && npm install && npm run build`
3. Output: `client/dist`
4. Set `VITE_API_BASE_URL` to your Render backend URL

### Keep Server Warm
- Add UptimeRobot monitor to `https://your-backend.onrender.com/api/health`
- Interval: 14 minutes (prevents 50–90s cold starts)

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js 20 + Express |
| Database | PostgreSQL (Supabase) |
| Sessions | Upstash Redis + connect-redis |
| File Storage | Cloudinary |
| Auth | Server-side sessions (NOT JWT) |
| Tests | Jest + Supertest + Vitest |

---

## Architecture Decisions

- **No JWT** — Server sessions = 20-byte cookie vs 500-byte JWT header. Healthcare requires instant revocation.
- **Low bandwidth** — Gzip on all responses, lazy-loaded chunks, Tailwind CSS purged to ~5 KB
- **Soft delete only** — `is_deleted=true`, row never removed. Medical compliance.
- **Atomic UID** — PostgreSQL `INSERT ... ON CONFLICT DO UPDATE` ensures no duplicates under concurrent load.
- **Pincode caching** — External API responses cached 24hrs in Redis to minimize repeated calls.

---

*Built for Demo Hospital — HMS Patient Registration Portal Demo*
