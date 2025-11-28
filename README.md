

# 🧠 **Cognition Quest Lab**

### *A Cognitive Training Platform for Mental Clarity, Emotional Awareness & Lifelong Learning*

---

## 🌟 **Overview**

**Cognition Quest Lab** is an interactive learning experience designed to help users strengthen cognitive skills through practical, psychology-backed exercises.

The platform blends cognitive science, emotional intelligence, and modern frontend engineering to support healthier thinking, better focus, and personal growth.

This project was built as the  **final capstone submission for the Power Learn Project Africa Academy** , demonstrating full-stack engineering, UI/UX execution, Supabase backend integration, testing, and CI/CD deployment with Vercel.

---

## 🚀 **Live Demo**

**Frontend (Vercel):**

👉 [https://cognition-quest-lab.vercel.app/](https://cognition-quest-lab.vercel.app/)

**Supabase Edge Functions:**

* Insights Generator →

  `https://qhbroauusanobomvcehr.supabase.co/functions/v1/generate-insights`
* Paystack Webhook →

  `https://qhbroauusanobomvcehr.supabase.co/functions/v1/paystack-webhook`

---

## 🎥 **Video Demonstration**

🎬 **5–10 min Demo Video:**

[https://drive.google.com/file/d/13H35az4xTXwOed2g1PoT9f-GHYpb4KHp/view?usp=drive_link](https://drive.google.com/file/d/13H35az4xTXwOed2g1PoT9f-GHYpb4KHp/view?usp=drive_link)

---

## 📘 **Pitch Deck**

📄 [https://gamma.app/docs/g9wd2smiv33mpmn](https://gamma.app/docs/g9wd2smiv33mpmn)

---

## 🧩 **Key Features**

* 🧠 **Cognitive Skill Exercises**

  Memory, focus, reasoning and emotional insight tools.
* 📚 **Micro-learning Lessons**

  Clear explanations of psychology concepts embedded into the experience.
* 💡 **Guided Mental Clarity Tools**

  Reflection prompts, self-assessment, and cognitive reframing.
* ✨ **Modern UI**

  Beautiful components built with Tailwind + shadcn-ui.
* 🔐 **Supabase Authentication**

  Secure login with persistent sessions.
* ⚙️ **Supabase Edge Functions**

  Used for insights generation and Paystack webhook handling.
* 💳 **Premium Access Flow (Paystack — Test Mode)**

  A simulated payment experience for unlocking premium tools.

---

## 🛠️ **Tech Stack**

### **Frontend**

* React 18
* TypeScript
* Vite
* Tailwind CSS
* shadcn-ui
* React Router
* React Query
* Sonner notifications

### **Backend**

* Supabase (Postgres + Auth)
* Supabase Edge Functions
* Paystack test payment

### **Deployment**

* Vercel (Frontend)
* Supabase Cloud (Backend)

### **Testing**

* Vitest (frontend)
* Node Test Runner (backend)

### **CI/CD**

* GitHub Actions
  * `frontend-ci.yml`
  * `frontend-cd.yml`
  * `supabase-ci.yml`

---

## 📂 **Project Structure**

```
cognition-quest-lab/
│
├── src/
│   ├── components/         # UI Components
│   ├── pages/              # Screens
│   ├── contexts/           # Theme & global contexts
│   ├── lib/                # Utilities
│   └── App.tsx
│
├── supabase/
│   ├── functions/          # Edge Functions
│   └── migrations/
│
├── docs/
│   ├── api.md              # API Documentation
│   └── architecture.md     # Technical Architecture
│
├── monitoring/
│   └── monitoring-setup.md
│
├── screenshots/
│   # → contains all project screenshots
│
├── .github/workflows/
│   ├── frontend-ci.yml
│   ├── frontend-cd.yml
│   └── supabase-ci.yml
│
├── .env.example
├── package.json
├── vite.config.ts
├── vitest.config.ts
└── README.md
```

---

## ⚙️ **Setup Instructions**

### **1. Clone the Repository**

```bash
git clone <your-github-classroom-week8-repo>
cd cognition-quest-lab
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Configure Environment Variables**

Create a `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

VITE_PAYSTACK_PUBLIC_KEY=your_paystack_test_key

VITE_FUNCTION_GENERATE_INSIGHTS=your_function_url
VITE_FUNCTION_PAYSTACK_WEBHOOK=your_webhook_url
```

Or use **Vercel → Project Settings → Environment Variables** for production.

### **4. Run Locally**

```bash
npm run dev
```

Visit:

👉 [http://localhost:](http://localhost:5173/)8080/

---

## 🧪 **Testing**

### **Frontend (Vitest)**

```bash
npm test
```

Uses:

* Vitest
* React Testing Library
* jsdom environment
* Mocked localStorage + matchMedia

### **Backend (Node Test Runner)**

```bash
cd supabase/functions
npm test
```

Simple sanity tests used to validate CI pipeline + function integrity.

---

## 🔄 **CI/CD Workflows**

GitHub Actions automates:

### ✔ `frontend-ci.yml`

* Install dependencies
* Run Vitest
* Build React app

### ✔ `frontend-cd.yml`

* Deploy to Vercel on successful build

### ✔ `supabase-ci.yml`

* Run backend tests
* Validate edge function folders

Screenshots of successful runs are inside `/screenshots`.

---

## 🖼️ **Screenshots**

Located in:

```
screenshots/
```

Includes:

* Homepage
* Tools screen
* Insights generator
* Payment flow
* Supabase dashboard
* GitHub Actions CI passing

---

## 🧠 **Architecture Summary**

Full breakdown in:

📄 `docs/architecture.md`

**High-level flow:**

1. User authenticates via Supabase
2. Access exercises & tools from React SPA
3. Insights tool calls Supabase Edge Function
4. Payments processed through Paystack (test mode)
5. Data stored in Postgres
6. Vercel deploys automatically on push

---

## 📘 **API Documentation**

See:

📄 `docs/api.md`

Covers endpoints, sample requests, and function behavior.

---

## 🔮 **Future Enhancements**

* AI-generated insights
* Gamification (badges, streaks, leaderboard)
* Community hub
* Full Paystack live integration
* Multilingual support
* Mobile app version (React Native)
* Analytics dashboard for admin

---

## 👩‍💻 **Author**

**Uche Nneoma**

PLP Academy — Final Capstone Project

GitHub: [https://github.com/Nomize](https://github.com/Nomize)

Live App: [https://cognition-quest-lab.vercel.app/](https://cognition-quest-lab.vercel.app/)

Video Demo: *(see link above)*

---

## 🎉 **Thank You**

This project embodies my passion for psychology, mental health, and building meaningful digital tools.

Thank you for reviewing this work — I hope Cognition Quest Lab inspires learning, clarity, and growth.
