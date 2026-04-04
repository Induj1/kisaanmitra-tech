# Conversational onboarding (web)

Flow and persistence live under:

- `src/onboarding/*` — state machine, copy, geocode, Supabase save
- `src/stores/onboardingStore.ts` — Zustand + `localStorage` draft
- `src/components/onboarding/*` — chat UI
- `src/pages/Onboarding.tsx` — route `/onboarding` (protected)

## Collected fields (`farmer_profiles`)

| Field           | Step   | Notes |
|----------------|--------|-------|
| `name`         | 1      | Free text |
| `location`     | 2      | GPS label or user typed |
| `crop_type`    | 3      | Wheat / Rice / Vegetables / Other |
| `primary_need` | 4      | Crop problem / Daily guidance / Market prices / Loans |

`address` is set to the same value as `location` on save.

## Steps

1. `ask_name` — welcome, user types name  
2. `confirm_location` — Haan / Change (or Yes / Change in English)  
3. `edit_location` — if Change, user types place  
4. `ask_crop` — quick replies  
5. `ask_crop_other` — if Other, user types crop  
6. `ask_need` — quick replies  
7. `complete` — final line → save → redirect to dashboard  

## Draft resume

`localStorage` key: `kisaan-onboarding-v1-{userId}` → JSON `{ draft: { step, lang, data, messages, … } }`

## Supabase

Run: `supabase/migrations/20260404120000_farmer_profiles_primary_need.sql` (adds `primary_need`).

## Geocoding

`geocode.ts` uses Nominatim reverse lookup — follow OSM usage policy in production (cache, rate limits, or your own proxy).

## Typing delay

Outgoing bot turns use ~380–720 ms delay so replies feel less instant.
