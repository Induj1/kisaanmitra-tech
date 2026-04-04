# KisaanMitra — Website Features

This document lists **every feature and screen** implemented in the KisaanMitra web app (Vite + React + TypeScript), based on the current codebase. It distinguishes **public** vs **authenticated** areas, **live integrations** (Supabase, edge functions) vs **demo / mock UI**, and calls out **marketing links that are not wired to routes**.

---

## Tech stack (relevant to features)

- **Frontend:** React 18, React Router 6, TanStack Query, Tailwind CSS, shadcn/ui (Radix), Framer Motion, Recharts, Pigeon Maps, React Hook Form + Zod.
- **Auth & data:** Supabase Auth; tables such as `farmer_profiles`, `marketplace_listings`, `marketplace_transactions`, `crop_analysis`, loan-related data (via components), optional `signin_credentials` / `user_credentials` on signup.
- **Edge functions (Supabase):** `chatbot`, `whisper`, `crop-analysis`, `crop-recommendations` (present under `supabase/functions/`; the live app invokes `chatbot` and `crop-analysis` from the UI where noted).
- **Optional local dev:** `npm run start:server` — `ChatbotWidget` can call a local chat API on localhost before falling back to Supabase.

---

## Global behavior (all or most pages)

| Feature | Where it lives | Notes |
|--------|----------------|-------|
| **Primary navigation** | `Navigation.tsx` | Home, Features, Demo, Government; when signed in, **Services** dropdown + account menu (Settings, Logout). |
| **Language selection** | `LanguageContext.tsx`, `LanguageSelector.tsx` in `Header` | **English, Hindi, Kannada** for shared UI strings (`translate()` keys). Some pages add their own English copy (e.g. Weather, Market Prices). |
| **High contrast mode** | `PageLayout.tsx`, per-page `Header` toggles, `App.tsx` | Toggles `high-contrast` on `<html>`; preference stored in `localStorage` (`highContrast`). |
| **Dark mode styles** | Tailwind `dark:` classes | System/user theme is not a dedicated toggle in code; layouts support dark styling via classes. |
| **Toast notifications** | `Toaster`, `Sonner` in `App.tsx` | Global feedback for forms and actions. |
| **Footer** | `Footer.tsx` | Branding, placeholder feature/resource links (`#`), contact blurb, app store icons (placeholders). |
| **404** | `NotFound.tsx` | Unknown routes. |

---

## Route map

### Public routes (no login required)

| Path | Page | Summary |
|------|------|---------|
| `/` | `Index.tsx` | Marketing landing: hero, stats, feature grids, tabs (core features / benefits / testimonials), live-style insight cards (simulated data), FAQ, CTAs. |
| `/features` | `Features.tsx` | Grid of feature cards + “dashboard qualities” section; navigates to detail routes or app routes (some targets may 404 — see **Gaps**). |
| `/demo` | `Demo.tsx` | Tabs: **AI Assistant** (`ChatbotWidget`), **Weather** (`LiveDataWidget`), **Farming Tools** (static wheat/rice calculators, signup CTA). |
| `/government` | `Government.tsx` | Searchable/filterable **government schemes** (PM-KISAN, PMFBY, KCC, etc.) with links to official sites. |
| `/sign-in` | `SignIn.tsx` | Email/password sign-in via Supabase; redirects to `/dashboard` if session exists. |
| `/sign-up` | `SignUp.tsx` | Registration: creates auth user, **`farmer_profiles`** row, and rows in `signin_credentials` / `user_credentials` (see code comments re: plain-text storage). |
| `/features/farm-planner` | `FarmPlannerDetail.tsx` | Long-form **GIS Farm Planner** marketing + embedded `MapPlanner`. |
| `/features/marketplace` | `MarketplaceDetail.tsx` | Marketplace feature explainer (`FeatureDetail`). |
| `/features/weather` | `WeatherDetail.tsx` | Weather & mandi feature explainer. |
| `/features/ask-expert` | `AskExpertDetail.tsx` | Ask Expert feature explainer. |
| `/features/government-schemes` | `GovernmentSchemesDetail.tsx` | Subsidy / schemes feature explainer. |
| `/crop-analysis` | `CropAnalysis.tsx` | **Crop analysis form** (`CropAnalysisForm`) — **not** wrapped in `ProtectedRoute` (reachable without login if URL known). |
| `/crop-analysis/report` | `CropAnalysis.tsx` | Report view when `?id=` is present (`CropAnalysisReport`). |
| `*` | `NotFound.tsx` | Catch-all. |

### Protected routes (require Supabase session)

| Path | Page | Summary |
|------|------|---------|
| `/dashboard` | `Dashboard.tsx` | Personalized hub: geolocation / `LocationAccessPopup` for new users, **Connect Device**, **Send Risk Alert** (POST to external ngrok URL), tabs **Overview** (KPIs, alerts table, tasks), **Analytics** (sample metrics), **Sensors** (`SensorDataWidget` + device status cards), grid of deep links (Jarvis, crop analysis, expert, marketplace, loans, profile, weather, farm planner, crop calendar, government). |
| `/farm-planner` | `FarmPlanner.tsx` | Location-aware planner: crop select, budget steps, **mock AI recommendation** (timeout-based), `MapPlanner`, `LiveDataWidget`, optional Supabase usage in file for recommendations (check file for current flow — primary demo uses local mock). |
| `/marketplace` | `Marketplace.tsx` | **Browse** active listings from Supabase; **Sell** with `ProductForm`; **Buy** with credit balance from `farmer_profiles.credit_score`; transactions in `marketplace_transactions`; **Buy Credits** via `CreditPurchaseModal`. |
| `/weather` | `Weather.tsx` | Weather info layout, advisories (rainfall, wind, temperature, humidity), seasonal tabs (Kharif/Rabi/Zaid), `LiveDataWidget`, `LocationAccessPopup`. |
| `/market-prices` | `MarketPrices.tsx` | Mandi-style UI: search, **line/bar charts** (static sample series), local vs national comparison (sample), `LiveDataWidget`, location popup. |
| `/loans` | `Loans.tsx` | **Credit score** display (`CreditTracker`), eligibility alerts, loan scheme cards, tabs **Apply** (`LoanApplicationForm`) / **History** (`LoanApplicationList`). |
| `/ask-expert` | `AskExpert.tsx` | Large **`ChatbotWidget`** + sidebar cards: farming tips, pest/disease/water topic tabs (static copy), tri-language toggle local to page header. |
| `/assistant` | `JarvisAssistant.tsx` | **Jarvis** copilot: chat UI, **quick prompts**, **toolbelt** links to major routes, sends messages to Supabase **`chatbot`** function (with REST fallback), **voice record** path toward **`whisper`** function, **browser TTS** (`speechSynthesis`) for assistant replies. |
| `/crop-calendar` | `CropCalendar.tsx` | Simple **crop cards** (e.g. wheat, rice) with planting/harvest windows — static content. |
| `/settings` | `Settings.tsx` | Loads `farmer_profiles` for user; **`UserSettings`** form (name, phone, location, crop type, land size) updates Supabase. |
| `/drone-monitoring` | `DroneMonitoring.tsx` | Multi-tab experience: book drone service, flight history, live preview / analysis (mock data), crop health index, forms and toasts — **demonstration UI**. |
| `/organic-certification` | `OrganicCertification.tsx` | Certification progress, requirements checklist, input log, QR-style certification flow (mock) — **demonstration UI**. |
| `/cold-chain-solution` | `ColdChainSolution.tsx` | Cold storage units, temperature/humidity, inventory, community SHG-style members (mock) — **demonstration UI**. |
| `/livestock-monitoring` | `LivestockMonitoring.tsx` | Per-animal vitals, alerts, vaccinations, herd management (mock) — **demonstration UI**. |

---

## Page-by-page feature detail

### Home (`/`)

- Hero with brand, dual CTAs (sign up, features).
- Highlight statistics (e.g. farmers served, yield, languages, support) — **presentational**.
- **Platform Features** grid linking to routes (dashboard/market-prices/crop-calendar use paths that expect login or may 404 for “community” / “automation”).
- **How KisaanMitra Helps You:** tabbed **Core Features**, **Benefits**, **Testimonials**.
- **CTA** strip (sign up + demo).
- **Live Agricultural Insights:** animated demo values for weather, mandi prices, expert tips.
- **FAQ** accordion (pricing, offline use, weather accuracy, sensors).

### Features (`/features`)

- Cards for: GIS Farm Planner, Marketplace, Weather & Mandi, Ask Expert, Subsidy Finder, Personalized Dashboard, Market Intelligence, Crop Calendar, Community, Smart Automation, Govt. schemes (duplicate card).
- Secondary section summarizing simplicity (multilingual, voice, low connectivity) and multi-device use — **marketing copy**.

### Demo (`/demo`)

- Language switcher + high contrast (page-level).
- **AI Assistant** tab: full `ChatbotWidget`.
- **Weather Updates:** `LiveDataWidget` in weather mode.
- **Farming Tools:** static NPK / water / yield examples for wheat and rice on 1 acre.

### Government schemes (`/government`)

- Text search and **category** filter.
- Scheme cards: Hindi + English descriptions, benefits, eligibility, **external official links**, badges (e.g. popular).

### Authentication

- **Sign in:** validated email/password, Supabase session, redirect to dashboard.
- **Sign up:** name, phone, location, email, password; provisions **`farmer_profiles`** with defaults (`crop_type: General`, `land_size: 1`).

### Dashboard (`/dashboard`)

- Welcome uses email local-part as display name.
- Geolocation stored in `localStorage` (`userLatitude`, `userLongitude`).
- **New user** flow can show `LocationAccessPopup` once (`isNewUser` from auth metadata timing).
- **Connect Device** opens `DeviceConnectionDialog`.
- **Send Risk Alert:** HTTP POST to configured backend URL (see `Dashboard.tsx` — third-party/ngrok endpoint).
- **Overview metrics:** temperature, soil moisture, crop health, market trend — **sample/static** in code.
- **Active alerts** table; **upcoming tasks** list — **sample data**.
- **Feature grid** with imagery linking to: `/assistant`, `/crop-analysis`, `/ask-expert`, `/marketplace`, `/loans`, `/settings`, `/weather`, `/farm-planner`, `/crop-calendar`, `/government`.

### Farm planner (`/farm-planner`)

- Auth guard (client-side redirect to sign-in).
- Location from geolocation or popup.
- Workflow: select crop (wheat, rice, maize, cotton, sugarcane) → enter irrigation/fertilizer/pesticide budgets → **generated plan** (mock rules: thresholds change recommendation text and numbers).
- **MapPlanner** map component; **LiveDataWidget**.

### Marketplace (`/marketplace`)

- Credit balance header; **Buy Credits** modal.
- **Browse:** list `marketplace_listings` with `status === 'active'`; purchase deducts buyer credits, marks listing sold, records transaction, seller credit RPC `increment`.
- **Sell:** create listings via `ProductForm` (refreshes list on success).

### Weather (`/weather`)

- Location acquisition with fallback popup.
- Main forecast copy and **farming advisories** by topic.
- **Seasonal forecast** tab content for Kharif/Rabi/Zaid.
- `LiveDataWidget` integration.

### Market prices (`/market-prices`)

- Search input (filters displayed rows in UI).
- **Trend charts** (Recharts wrappers) for wheat/rice sample series.
- **Comparison** cards local vs national.
- `LiveDataWidget`; location popup.

### Loans (`/loans`)

- Static **credit score** state in page (demo number) with `CreditTracker` UI.
- Eligibility messaging based on threshold vs 600.
- Tips to improve credit (profile, marketplace, repayment, activity).
- Static **loan product** cards (crop, equipment, land development, micro).
- **Apply** and **History** tabs with Supabase-backed forms/lists (per `LoanApplicationForm` / `LoanApplicationList`).

### Ask expert (`/ask-expert`)

- `ChatbotWidget` with per-page language prop (English/Hindi/Kannada).
- Static **tips** and **topic** cards (crops, pests, irrigation, etc.).

### Jarvis assistant (`/assistant`)

- Conversational UI with **preset prompts**.
- **Toolbelt** shortcuts: Farm Planner, Weather, Mandi Prices, Crop Calendar, Crop Analysis, Marketplace, Loans, Ask Expert.
- Backend: **`chatbot`** edge function; optional **`whisper`** for recorded audio.
- **Speech synthesis** reads latest assistant message (English India voice hint).

### Crop calendar (`/crop-calendar`)

- Minimal calendar cards for crops and seasons — **no interactive calendar control** beyond static text.

### Settings (`/settings`)

- Fetch and update **`farmer_profiles`** for the signed-in user through `UserSettings`.

### Crop analysis (`/crop-analysis`, `/crop-analysis/report`)

- **Form:** rich fields — crop type, land size/unit, sowing date, cultivation method, watering, seed type/source, fertilizers/pesticides, problems, harvest outcome, notes; submits to **`crop_analysis`** table then navigates to report with `id`.
- **Report:** loads row by id, invokes Supabase **`crop-analysis`** edge function to build sections (strengths, improvements, suggestions), overall score, optional **YouTube / external resources** by crop type, print/download style actions in UI.

### Drone monitoring (`/drone-monitoring`)

- Booking form (location, farm size, area, schedule, priority).
- Tabs for active flights, history, analytics, live view — **mock flight IDs and insights**.

### Organic certification (`/organic-certification`)

- Progress bar, requirement checklist, input logging, certification dashboard tabs — **mock farm** (“Himalayan Organic Farm”, etc.).

### Cold chain (`/cold-chain-solution`)

- Storage unit monitoring cards, inventory, utilization, community directory — **mock data** for Northeast India–style units.

### Livestock monitoring (`/livestock-monitoring`)

- Animal list with collar IDs, vitals time series, health status, vaccinations, alerts — **mock livestock**.

### Feature detail pages (`/features/*`)

- Shared `FeatureDetail` pattern: title, description, benefits list, feature bullets.
- **Farm planner detail** additionally embeds **`MapPlanner`** and “how it works” steps.

### Not found (`*`)

- Friendly 404 messaging (via `NotFound.tsx` and language keys).

---

## Shared components (feature-related)

| Component | Role |
|-----------|------|
| `ChatbotWidget` | Chat UI; tries **local** `8787` API, then **Supabase `chatbot`**; mic/speak are **mock alerts** (not full STT/TTS). |
| `LiveDataWidget` | Reusable “live” panel for weather/market-style demos on several pages. |
| `MapPlanner` | Map-based GIS-style planner (Pigeon Maps). |
| `LocationAccessPopup` | Manual or browser geolocation capture. |
| `SensorDataWidget` | Sensor readouts on dashboard sensors tab. |
| `DeviceConnectionDialog` | UI for connecting field devices (from dashboard). |
| `ProductCard` / `ProductForm` / `CreditPurchaseModal` | Marketplace listing display, create listing, buy credits flow. |
| `LoanApplicationForm` / `LoanApplicationList` | Loan apply + history. |
| `CreditTracker` | Credit score visualization on loans page. |
| `GovernmentScheme` | Scheme card rendering on government page. |
| `LineChart` / `BarChart` | Charts on market prices page. |

---

## Marketing vs implementation gaps

These appear in **copy or navigation** but **do not have dedicated routes** in `App.tsx`:

- **`/community`** — linked from `Index.tsx` / `Features.tsx` feature grids → resolves to **404**.
- **`/automation`** — same → **404**.

The **footer** “Features” and “Resources” links use `href="#"` (placeholders, not real routes).

**Navigation** does not list every protected page: e.g. **`/assistant`**, **`/drone-monitoring`**, **`/organic-certification`**, **`/livestock-monitoring`** are reachable from **Dashboard** cards or direct URL, not all from the main nav dropdown.

---

## Summary checklist (everything the site offers)

**Discovery & marketing:** landing page, features catalog, feature detail pages, demo, government scheme browser, FAQ, testimonials, CTAs.

**Account:** sign up, sign in, sign out, session persistence, farmer profile CRUD, optional new-user location prompt.

**Operations hub:** dashboard with KPIs, alerts, tasks, analytics tab, sensors tab, device connect, risk alert hook, deep links to all major tools.

**Planning & data:** farm planner (map + budgets + mock AI), crop calendar (static), GIS marketing map on detail page.

**Markets & money:** marketplace (credits, buy/sell, transactions), market prices (charts + search UI), loans (eligibility UI, apply, history).

**Advisory & AI:** ask expert (chatbot widget), Jarvis (full assistant + voice pipeline hooks), crop analysis form + AI report via edge function.

**Field & logistics (demo UIs):** drone monitoring, organic certification tracker, cold chain dashboard, livestock monitoring.

**Accessibility & locale:** high contrast, English/Hindi/Kannada for core chrome and several flows.

---

*Generated from repository source (`src/App.tsx`, pages, and key components). Update this file when routes or integrations change.*
