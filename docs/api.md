

# 📝 `docs/api.md`

```md
# API Documentation — Cognition Quest Lab

This application uses Supabase Edge Functions as its backend. All server-side logic runs through secure functions deployed in the Supabase cloud.

Base URL:
```

[https://qhbroauusanobomvcehr.supabase.co/functions/v1/](https://qhbroauusanobomvcehr.supabase.co/functions/v1/)

```

---

## 1. POST /generate-insights

### Purpose
Generates cognitive insights or summaries based on user activity, quiz results or reflective input.

### Endpoint
```

POST [https://qhbroauusanobomvcehr.supabase.co/functions/v1/generate-insights](https://qhbroauusanobomvcehr.supabase.co/functions/v1/generate-insights)

```

### Authentication
Requires Supabase JWT from the frontend client.

### Request Example
```json
{
  "userId": "uuid-of-user",
  "activity": "memory_exercise",
  "score": 42
}
```

### Response Example

```json
{
  "insight": "Your focus is improving. Keep practicing memory recall exercises.",
  "recommendation": "Try the 'Pattern Recall' exercise next."
}
```

---

## 2. POST /paystack-webhook

### Purpose

Handles Paystack payment verification on the server side.

This endpoint updates the user’s premium status after Paystack confirms the payment.

### Endpoint

```
POST https://qhbroauusanobomvcehr.supabase.co/functions/v1/paystack-webhook
```

### Auth

No client JWT — this function listens for **Paystack server webhook requests** only.

### Request (from Paystack)

```json
{
  "event": "charge.success",
  "data": {
    "reference": "paystack-reference-string",
    "status": "success",
    "amount": 5000
  }
}
```

### Response (Example)

```json
{
  "message": "Premium access granted"
}
```

---

## Notes

* Edge Functions run isolated on the server, ensuring security for sensitive operations such as payment validation and insight generation.
* RLS (Row Level Security) protects Postgres tables.
* Supabase Auth manages user accounts, sessions and JWT tokens.

```

---

# ✅ 5. Add backend URL to README

Update your README with this:

```md
### Backend (Supabase Edge Functions)
The backend is implemented using Supabase Edge Functions and deployed through Lovable.dev’s connected cloud.

Base URL:
https://qhbroauusanobomvcehr.supabase.co/functions/v1/

Endpoints:
- POST /generate-insights
- POST /paystack-webhook

See docs/api.md for request/response examples.
```
