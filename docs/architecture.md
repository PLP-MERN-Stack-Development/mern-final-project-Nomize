# Architecture Overview — Cognition Quest Lab

Cognition Quest Lab is a full-stack application built with a modern serverless architecture.
The frontend is powered by React + TypeScript, while backend logic and database operations run on Supabase (Postgres + Edge Functions + Auth + Realtime).

---

## 1. High-Level Architecture


React Frontend (Vercel)

│

│  HTTPS requests

▼

Supabase Edge Functions  ←→  Supabase Database (Postgres)

│

│  Auth tokens / JWT

▼

Supabase Auth (User Sessions)


**Key points:**

- No traditional Express server is required
- Edge Functions act as secure backend endpoints
- Supabase Postgres handles all persistent data
- Realtime features available via channels (optional)
- Paystack webhooks pass through serverless backend functions

---

## 2. Frontend Architecture (React)

The frontend is a Vite + React + TypeScript project with:

- React Router for page navigation
- Tailwind + shadcn/ui for styling
- Context API for global state
- Supabase client for:
  - authentication (sign-up, login, session handling)
  - retrieving user data
  - calling Edge Functions

**Frontend responsibilities:**

- Render cognitive training UI
- Send API requests to Edge Functions
- Manage user state and session
- Trigger payments and premium access flow
- Display insights returned by backend

---

## 3. Backend Architecture (Supabase)

Supabase provides:

### ✔ Authentication

Handles:

- Sign up
- Login
- Password reset
- Session token generation
- Secure access to protected resources

### ✔ Database (Postgres)

Stores:

- users
- cognitive exercises
- attempts
- payment history
- insights

Tables are protected with **Row Level Security (RLS)** ensuring users can only access their own data.

### ✔ Edge Functions (Serverless API)

Two key backend endpoints:

#### 1. `/generate-insights`

- Processes user scores or responses
- Generates personalized cognitive insights
- May write to Postgres
- Requires auth token

#### 2. `/paystack-webhook`

- Validates Paystack payments
- Marks user as premium in database
- Called only by Paystack servers

### ✔ Realtime

Supabase can broadcast DB changes in real time (not heavily used yet, but compatible with future gamification features).

---

## 4. Deployment Architecture

### Frontend (Vercel)

- Auto-deploy on push to `main`
- Environment variables managed through Vercel dashboard

### Backend (Supabase Cloud)

- Edge Functions deployed via Lovable.dev → Supabase
- Database & Auth managed automatically
- No server maintenance required

---

## 5. Security Model

- Supabase Auth issues JWT tokens
- Tokens are passed to Edge Functions for verification
- Sensitive operations (payment validation, admin logic) run in serverless functions
- No secrets are exposed to the frontend
- Paystack webhook endpoint is protected on the server side

---

## 6. Why Supabase Instead of a Traditional MERN Backend?

Although the course referenced MongoDB and Express, Supabase provides:

- Postgres relational power
- Built-in auth
- Built-in realtime
- Built-in secure serverless functions
- Better integration with modern frontend frameworks
- Only one unified cloud dashboard (Auth + DB + API)

This makes it a strong full-stack architecture for cognitive learning tools.

---

## 7. Future Scalability

The system can easily scale by:

- Adding more Edge Functions for analytics or insights
- Introducing gamification (leaderboards, streaks, rewards)
- Using Supabase Realtime for collaborative tools
- Adding admin dashboards
- Migrating premium payments to live mode

---

## 8. Architecture Diagram (Simple ASCII)


[Browser / React App]

|

|  1. User interacts / submits data

v

[Supabase Auth] --- issues JWT ---> stored in browser

|

| 2. Authenticated Request (Bearer token)

v

[Supabase Edge Functions]

|              |

| 3. DB Query  | 4. Process Payment Webhooks

v              v

[Supabase Postgres]   [Paystack → Webhook Function]

<pre class="overflow-visible!" data-start="4495" data-end="4692"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"></div></div></pre>


---
Cognition Quest Lab uses a fully serverless architecture designed for low maintenance, strong security, and high scalability — ideal for a cognitive development and wellness platform.
---
