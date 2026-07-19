# NearbyConnect

Discover. Connect. Support Local Businesses.

NearbyConnect helps people in villages and small towns find verified local
businesses — grocery stores, medical shops, restaurants, and more — and
connect with them directly by call, WhatsApp, or directions. It is **not**
an e-commerce platform: there's no cart, no inventory, no online checkout.

This repo has two parts:

```
nearbyconnect/
├── frontend/   React 19 + Vite + Tailwind CSS (what people see and use)
└── backend/    Node.js + Express + MongoDB API (data and auth)
```

---

## 1. Frontend (ready to run right now)

The frontend is fully built and works on its own with realistic mock data —
you can explore every screen without setting up a database first.

```bash
cd frontend
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

**Pages included:** Home, Explore (search + filters), Business Details
(call / WhatsApp / directions / reviews / community updates), Login,
Customer Registration, Register-a-Shop benefits page, multi-step Shop
Registration, Customer Dashboard (favorites / reviews / profile), Shop
Owner Dashboard (profile, gallery, offers, community updates, reviews,
analytics, settings), and a hidden Admin panel at `/admin/login`
(pending approvals, users, categories, reports).

Design notes: warm paper background, deep-teal primary color, marigold
accent, and a hand-stamp "Verified" badge as the signature visual — built
to feel trustworthy and be easy to read for first-time smartphone users,
with big tap targets and plain language throughout.

To connect it to the real backend instead of mock data, see
`frontend/src/data/mockData.js` — swap the imports in each page for
`axios` calls to the endpoints below once your backend is deployed.

## 2. Backend (scaffolded, needs your credentials)

The backend is a complete Express + MongoDB API matching the schema and
routes in the requirements doc. It won't run until you provide:

1. A MongoDB Atlas connection string
2. A JWT secret
3. Cloudinary credentials (for image uploads)

```bash
cd backend
cp .env.example .env      # then fill in your real values
npm install
npm run dev
```

Health check: `GET http://localhost:5000/api/health`

**Endpoints included:** everything listed in section 25 of the spec —
auth (register customer/owner, login), shops (CRUD + search/filter),
reviews, community updates, favorites, categories, image upload, and the
admin approve/reject flow.

## 3. Deploying

- **Frontend →** Vercel (`vercel.com`) — import the `frontend` folder,
  build command `npm run build`, output directory `dist`.
- **Backend →** Render (`render.com`) — import the `backend` folder,
  start command `npm start`, add the environment variables from `.env.example`.
- **Database →** MongoDB Atlas — create a free cluster, add your Render
  server's IP (or `0.0.0.0/0` for simplicity) to the network access list.

## What to do next

1. Run the frontend and click through every page with mock data.
2. Set up a free MongoDB Atlas cluster and Cloudinary account.
3. Fill in `backend/.env` and start the backend.
4. Replace mock data calls in the frontend with real `axios` requests.
5. Deploy frontend to Vercel and backend to Render.
