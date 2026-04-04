# KisaanMitra — Backend & API Reference

This document lists every backend surface the app uses: local dev proxy, Supabase (Auth, PostgREST, Edge Functions, RPC), and third-party HTTP APIs. Paths and payloads match the code in this repository as of the last update.

---

## Base URLs

| Layer | Base URL | Notes |
|--------|-----------|--------|
| **Supabase project** | `https://<project-ref>.supabase.co` | Configured in `src/integrations/supabase/client.ts` as `SUPABASE_URL`. |
| **Supabase Auth** | `{SUPABASE_URL}/auth/v1/*` | Used via `@supabase/supabase-js` (`signUp`, `signInWithPassword`, session). |
| **Supabase REST (PostgREST)** | `{SUPABASE_URL}/rest/v1/*` | Table CRUD via `.from('table_name')`. |
| **Supabase Edge Functions** | `{SUPABASE_URL}/functions/v1/{function-name}` | Also callable with `supabase.functions.invoke(...)`. |
| **Local OpenAI proxy** | `http://localhost:8787` (default) | `node server/server.js`; set `PORT` to override. |

**Edge Function HTTP headers (direct `fetch`):** `Content-Type: application/json`, `apikey: <anon key>`, `Authorization: Bearer <anon or user JWT>`.

---

## 1. Local development server (`server/server.js`)

Run: `OPENAI_API_KEY=... node server/server.js` (or set env on Windows).

| Method | Path | Feature | Request body | Success response |
|--------|------|---------|--------------|------------------|
| `OPTIONS` | `*` | CORS preflight | — | `204` |
| `POST` | `/api/chat` | Chat + structured crop analysis (dev alternative to Edge `chatbot` / `crop-analysis`) | JSON: `message` **or** `cropData`; optional `language` (`english` \| `hindi` \| `kannada`) | With `message`: `{ success: true, data: { text } }`. With `cropData`: `{ success: true, data: { positives, improvements, recommendations, overallScore } }` or parse error payload. |
| `POST` | `/api/whisper` | Speech-to-text (dev alternative to Edge `whisper`) | JSON: `audioBase64` (required), optional `mimeType` (default `audio/webm`) | `{ success: true, data }` where `data` is OpenAI transcription JSON (typically includes `text`). |

**Frontend usage:** `ChatbotWidget` uses `http://localhost:8787/api/chat` when hostname is localhost.

---

## 2. Supabase Edge Functions

Deployed names match the folders under `supabase/functions/`. Full URL: `{SUPABASE_URL}/functions/v1/<name>`.

### 2.1 `chatbot`

| | |
|--|--|
| **Feature** | In-app agricultural assistant (text); multilingual (English / Hindi / Kannada). |
| **Method** | `POST` |
| **Body** | JSON. Provide **`message`** *or* **`cropData`** (at least one). Optional **`language`**: `english` \| `hindi` \| `kannada` (default `english`). |
| **Success** | `{ success: true, data: { text: string, version?: string } }` |
| **Errors** | `400` missing fields; `500` missing `OPENAI_API_KEY` or OpenAI failure. |
| **Used by** | `ChatbotWidget`, `JarvisAssistant` (`invoke` or direct fetch). |

### 2.2 `whisper`

| | |
|--|--|
| **Feature** | Voice → text (OpenAI Whisper). |
| **Method** | `POST` |
| **Body** | `{ audioBase64: string, mimeType?: string }` (default `audio/webm`). |
| **Success** | `{ success: true, data: <OpenAI transcription object> }` (includes `text`). |
| **Errors** | `400` if `audioBase64` missing; `500` if key missing or server error. |
| **Used by** | `JarvisAssistant`, optionally chat widgets with voice. |

### 2.3 `crop-analysis`

| | |
|--|--|
| **Feature** | Free-text farming Q&A **or** structured crop cultivation analysis (JSON scorecard). |
| **Method** | `POST` |
| **Body** | JSON. **`message`** *or* **`cropData`** required. Optional **`language`** (also read from `cropData.language`). |
| **Success (message)** | `{ success: true, data: { text: string } }` |
| **Success (cropData)** | `{ success: true, data: { positives: string[], improvements: string[], recommendations: string[], overallScore: number } }` (with server-side JSON extraction / fallback if model output is malformed). |
| **Errors** | `400` invalid body; `500` OpenAI / key issues. |
| **Used by** | `CropAnalysisReport` via `supabase.functions.invoke('crop-analysis', ...)`. |

### 2.4 `crop-recommendations`

| | |
|--|--|
| **Feature** | Map / planner: top crop suggestions for coordinates (currently **mock** data varied by location hash). |
| **Method** | `POST` |
| **Body** | `{ latitude: number, longitude: number, area?: number }` — `area` defaults to `1` (hectares) in the function. |
| **Success** | `{ recommendations: CropRecommendation[], location: { latitude, longitude } }` where each item has `cropName`, `confidence`, `soilSuitability`, `waterRequirement`, `seasonalFit`. |
| **Errors** | `400` if lat/lng missing; `500` on unexpected errors. |
| **Auth** | Function creates a Supabase client with the request `Authorization` header (pass user JWT when invoking from the client). |
| **Used by** | `MapPlanner` via `supabase.functions.invoke('crop-recommendations', ...)`. |

---

## 3. Supabase Auth (via JS client)

Not custom routes, but part of the backend contract:

| Action | Client API | Typical REST (for reference) |
|--------|------------|------------------------------|
| Register | `supabase.auth.signUp({ email, password, options })` | `POST /auth/v1/signup` |
| Login | `supabase.auth.signInWithPassword({ email, password })` | `POST /auth/v1/token?grant_type=password` |
| Session / logout | `getSession`, `signOut`, etc. | Standard GoTrue endpoints |

**Used by** | `SignUp.tsx`, `SignIn.tsx`, `AuthContext`, protected flows.

---

## 4. Supabase REST — tables (`/rest/v1/{table}`)

Accessed with `supabase.from('...')` and RLS policies on the project. Query params follow PostgREST (`select`, `eq`, `order`, etc.).

### 4.1 `farmer_profiles`

| Feature | Operations (from app code) |
|---------|----------------------------|
| Profile / settings | `select`, `insert` (signup), `update` (settings, credits) |
| Marketplace | Load buyer/seller profile and `credit_score`; deduct credits on purchase |
| Credit tracker | Read profile and related transactions |

**Main columns (see `src/integrations/supabase/types.ts`):** `user_id`, `name`, `phone`, `location`, `address`, `crop_type`, `land_size`, `credit_score`, `profile_image`, timestamps.

### 4.2 `crop_analysis`

| Feature | Operations |
|---------|------------|
| Crop analysis workflow | `insert` (form submission), `select`, `update` (e.g. `report_generated`) |

**Main columns:** `user_id`, `crop_type`, `land_size`, `sowing_date`, `cultivation_method`, `watering_method`, `seed_type`, `seed_source`, `fertilizers`, `pesticides`, `problems`, `harvest_outcome`, `additional_notes`, `report_generated`.

### 4.3 `marketplace_listings`

| Feature | Operations |
|---------|------------|
| Browse marketplace | `select` where `status = 'active'`, ordered by `created_at` |
| Seller listings | `select` by `seller_id` |
| New listing | `insert` (`ProductForm`) |
| After purchase | `update` `status` to `'sold'` |

**Main columns:** `seller_id`, `title`, `description`, `price`, `category`, `seller_name`, `seller_location`, `image_url`, `status`.

### 4.4 `marketplace_transactions`

| Feature | Operations |
|---------|------------|
| Purchase flow | `insert` with `product_id`, `buyer_id`, `seller_id`, `amount`, `credits_used`, `status`, `product_title` |
| Credit tracker | `select` (history) |

### 4.5 `loan_applications`

| Feature | Operations |
|---------|------------|
| Loans | `insert` (`LoanApplicationForm`), `select` with pagination (`LoanApplicationList`) |

**Main columns:** `user_id`, `amount`, `purpose`, `status`, `credit_score_at_application`, `approved_at`, `rejected_reason`, timestamps.

### 4.6 `signin_credentials`

| Feature | Operations |
|---------|------------|
| Sign-in audit / mirror table | On login: `select` by `user_id`, then `update` or `insert` with `email`, `password`, `signin_timestamp`. On signup: `insert`. |

> **Security note:** The app currently stores plaintext passwords in this table in addition to Supabase Auth — this is a design risk; treat as legacy / to be hardened.

### 4.7 `user_credentials`

| Feature | Operations |
|---------|------------|
| Signup mirror | `insert` on registration (`user_id`, `email`, `password`, `created_at`). |

> Same security caveat as `signin_credentials`.

---

## 5. Supabase RPC (`/rest/v1/rpc/increment`)

| Name | Args | Returns | Feature |
|------|------|---------|---------|
| `increment` | `row_id: string` (user id), `amount: number` | `number` (per types) | Adds credits to a farmer profile — used when **buying credits** (`CreditPurchaseModal`) and when **crediting the seller** on marketplace sale (`Marketplace` uses `amount: 50` for seller reward). |

---

## 6. Third-party & auxiliary HTTP APIs

These are not hosted in this repo but are called by the web app.

| Service | URL / pattern | Feature |
|---------|----------------|---------|
| **Open-Meteo** | `GET https://api.open-meteo.com/v1/forecast?latitude=...&longitude=...&current=...&daily=...` | Live weather on dashboard widgets (`LiveDataWidget`). |
| **Nominatim (OSM)** | `GET https://nominatim.openstreetmap.org/reverse?format=json&lat=...&lon=...` | Reverse geocoding for location label (`User-Agent: KisaanMitra/1.0`). |
| **Dashboard risk alert (external tunnel)** | `POST https://cd63ce29821c.ngrok-free.app/send-alert` | `Dashboard.tsx` sends `{ type: "risk_alert", source: "web_dashboard" }` — **ephemeral dev URL**; replace with your production notification service. |

**OpenAI** is called only from `server/server.js` and Supabase Edge Functions (`api.openai.com`), not directly from the browser.

---

## 7. Feature → API map

| Product feature | Primary APIs |
|-----------------|--------------|
| **Registration / login** | Supabase Auth; tables `farmer_profiles`, `signin_credentials`, `user_credentials` |
| **Farmer profile & settings** | `farmer_profiles` |
| **Jarvis Assistant** | Edge `chatbot`, Edge `whisper` |
| **Embedded chat widget** | Local `/api/chat` (dev) and/or Edge `chatbot` |
| **Crop analysis form & AI report** | `crop_analysis` table; Edge `crop-analysis` |
| **Map / crop recommendations** | Edge `crop-recommendations` |
| **Marketplace** | `marketplace_listings`, `marketplace_transactions`, `farmer_profiles`, RPC `increment` |
| **Loans** | `loan_applications` |
| **Credits** | `farmer_profiles.credit_score`, RPC `increment` |
| **Live weather & location label** | Open-Meteo, Nominatim |
| **Risk alert to mobile** | External `POST .../send-alert` (ngrok in repo) |
| **Cold chain / other UI-only pages** | Mock data in components — no backend endpoints in this repo |

---

## 8. CORS

- **Edge Functions:** `Access-Control-Allow-Origin: *`; allowed headers include `authorization`, `x-client-info`, `apikey`, `content-type`.
- **Local server:** `Access-Control-Allow-Origin: *` for `GET`, `POST`, `OPTIONS`.

---

## 9. Required secrets & env

| Where | Variable |
|-------|----------|
| Supabase (project / function secrets) | `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` (functions receive Supabase-managed env as configured) |
| Local Node server | `OPENAI_API_KEY`, optional `PORT` |

---

If you add new tables, functions, or routes, update this file alongside the code so it stays the single inventory of backend endpoints.
