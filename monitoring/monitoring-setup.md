# Monitoring & Error Tracking — Cognition Quest Lab

This document explains how the system is monitored in production across both the frontend and backend.

---

## 1. Frontend Monitoring (Vercel)

**Tools Used:**

- Vercel Deployment Logs
- Vercel Analytics (optional)
- Browser Console / Network Inspector for runtime errors

**What is monitored:**

- Build failures
- Runtime errors during page load
- API call failures (visible in browser console)
- Slow server responses

**How to access:**
Vercel Dashboard → Projects → cognition-quest-lab → Deployments → “View Logs”

---

## 2. Backend Monitoring (Supabase Edge Functions)

**Tools Used:**

- Supabase Logs
- Supabase Function Logs
- API error responses

**What is monitored:**

- Execution errors inside Edge Functions
- Failed webhook requests
- Database errors or rejected writes
- Authentication failures
- Rate limits or permission issues (RLS)

**How to access:**
Supabase Dashboard → Project → Logs → Functions / API / Database

---

## 3. Payment Monitoring (Paystack Test Mode)

**Tools Used:**

- Paystack Dashboard → Transaction Logs
- paystack-webhook function logs
- Supabase `payments` table

**Monitored Items:**

- Successful test payments
- Failed payments
- Webhook events
- Premium account activation

---

## 4. CI/CD Monitoring (GitHub Actions)

**Tools Used:**

- GitHub Actions workflows:
  - `frontend-ci.yml`
  - `supabase-ci.yml`
  - `frontend-cd.yml`

**What is monitored:**

- Build success/failure
- Test suite success/failure
- Dependency installation issues
- Node version conflicts

**How to access:**
GitHub Repo → Actions → Select workflow → View logs

---

## 5. Suggested Future Improvements

- Integrate **Sentry** for automatic error tracking
- Add uptime monitoring through UptimeRobot or Vercel Observability
- Implement logging inside Edge Functions for analytics
- Add audit logs for user activity

---

This monitoring setup ensures your application is easy to maintain, debug, and scale in production.
