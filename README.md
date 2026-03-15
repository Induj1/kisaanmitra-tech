# KisaanMitra

**आपका साथी, आपकी फ़सल** — Empowering Indian farmers with smart tools, data, and community.

KisaanMitra is a digital platform for agriculture: crop planning, expert guidance, local market prices, weather, government schemes, and more.

---

## Features

- **Dashboard** — Weather, sensors, tasks, prices, and updates in one place  
- **Farm Planner (GIS)** — Land mapping and crop planning  
- **Marketplace** — Seeds, fertilizers, equipment with farm credits  
- **Weather & Mandi** — Real-time weather and market price alerts  
- **Ask an Expert** — AI chatbot and expert network for crop advice  
- **Subsidy Finder** — Discover and apply for government schemes  
- **Market Intelligence** — Daily crop prices, trends, and mandi insights  
- **Crop Calendar** — Plan and track your agricultural cycle  
- **Cold Chain Solution** — Cold storage and logistics  
- **Crop Analysis** — AI-powered crop recommendations and insights  
- **Loans** — Loan applications and tracking  
- **Community** — Connect and share with other farmers  

Supports **12+ Indian languages** and **high-contrast** accessibility.

---

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite  
- **UI:** Tailwind CSS, shadcn/ui, Framer Motion  
- **Backend / DB:** Supabase (auth, database, edge functions)  
- **Maps:** Pigeon Maps  

---

## Getting Started

### Prerequisites

- Node.js 18+  
- npm or bun  

### Install and run

```bash
# Clone the repo
git clone https://github.com/Induj1/kisaanmitra-tech.git
cd kisaanmitra-tech

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open **http://localhost:8080** (or the port shown in the terminal).

### Other scripts

| Command            | Description              |
|--------------------|--------------------------|
| `npm run dev`      | Start Vite dev server    |
| `npm run build`    | Production build         |
| `npm run preview`  | Preview production build |
| `npm run start:server` | Start Node proxy (e.g. for AI/chat) |

### Environment

Copy environment variables as needed (e.g. from `.env.example` if present) into a `.env` file. Do not commit `.env` or any secrets.

---

## Project structure

```
├── src/
│   ├── components/   # Reusable UI and feature components
│   ├── pages/        # Route pages
│   ├── contexts/     # Auth, language, etc.
│   ├── integrations/ # Supabase client and types
│   └── lib/          # Utilities
├── server/           # Optional Node proxy (e.g. AI routes)
├── supabase/         # Supabase config and edge functions
└── public/            # Static assets
```

---

## Deployment

- **Vercel / Netlify:** Connect the GitHub repo and use `npm run build` with output directory `dist`.  
- **Custom domain:** Configure in your hosting provider (e.g. Netlify, Vercel).

Live demo: [https://kisaanmitra-tech.vercel.app/](https://kisaanmitra-tech.vercel.app/)

---

## Repository

- **GitHub:** [Induj1/kisaanmitra-tech](https://github.com/Induj1/kisaanmitra-tech)  
- **License:** See repository for license details.

---

*Made for Indian farmers.*
