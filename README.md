# HealTrack — Smart Emergency Healthcare App

A premium, mobile-first emergency healthcare app built with React, TypeScript, Vite, Tailwind CSS, react-i18next, and plain Leaflet.

📖 **Full project documentation:** see [`docs/DOCUMENTATION.md`](./docs/DOCUMENTATION.md) for architecture, routing map, state management, design system, i18n, the SOS emergency flow, backend integration points, and troubleshooting.

## Features

- **Splash → Login → OTP → Onboarding** flow with dummy auth (Phone: `9876543210`, OTP: `1234`)
- **Home** — emergency SOS with confirmation + live status, real GPS location (browser geolocation + OpenStreetMap/Nominatim reverse geocoding), health categories, quick actions, nearby hospitals
- **Hospitals** — searchable/filterable list, map view (plain Leaflet, no react-leaflet), detail page with tabs (overview/doctors/facilities/availability)
- **Appointments** — 4-step booking flow (doctor → date → time → confirm), history with upcoming/completed/cancelled tabs
- **Ambulance** — type selection (Basic/Advanced/ICU), live tracking with a progress timeline
- **Emergency Mode** — dedicated full-screen active state with live timer and one-tap actions
- **Guardians** — up to 2 guardians, My Profile / Guardian View toggle with a privacy-scoped read-only view
- **Profile** — medical ID card, health data dashboard, medical history timeline, insurance, emergency contacts, settings
- **8 languages** — English and Hindi are fully translated; Tamil, Telugu, Kannada, Malayalam, Bengali and Marathi cover the core screens (nav, auth, onboarding, home) with automatic English fallback elsewhere
- **Dark mode** with persistence, respecting system preference on first load
- Skeleton loaders, empty states, and confirm dialogs throughout
- All data persists to `localStorage` so your session survives a refresh

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`) in your browser. For the most authentic feel, open dev tools → toggle device toolbar → pick any phone preset (the UI is designed mobile-first, max width 480px, and centers itself on larger screens).

To build for production:

```bash
npm run build
npm run preview
```

## Demo credentials

- **Phone:** 9876543210
- **OTP:** 1234

## Project structure

```
src/
  components/       Reusable UI (Button, Card, Dialog, Toast, BottomNav, SOSCard, HospitalCard, LeafletMap...)
  context/          AuthContext, ThemeContext, AppStateContext (global state + localStorage sync)
  i18n/             i18next setup + 8 language JSON files
  lib/              utils, storage helpers, mock data (hospitals, doctors, categories)
  pages/            One folder per feature area (onboarding, hospitals, appointments, ambulance, emergency, guardians, profile)
  types/            Shared TypeScript types
```

## Notes on real vs. mock data

- **Location** is real — it uses your browser's actual GPS via `navigator.geolocation` and reverse-geocodes it with OpenStreetMap/Nominatim.
- **Hospitals, doctors, ambulance drivers** are realistic mock data (no backend yet) — swap `src/lib/mockData.ts` for real API calls when you're ready to connect a backend.
- **Health data, insurance, medical history** intentionally start empty — the app never fabricates medical readings; it shows honest empty states until a user (or your backend) supplies real data.
- **Authentication** is a dummy OTP flow for demo purposes — replace `AuthContext.tsx` with your real auth/OTP provider (Firebase, MSG91, Twilio Verify, etc.) when going to production.

## Extending this further

- Wire `requestAmbulance` / hospital data / appointments in `AppStateContext.tsx` to real API endpoints.
- Add a service worker for true offline support (an "offline" banner hook point is easy to add in each page's loading state).
- The Tailwind design tokens (see `tailwind.config.ts` + `src/index.css` CSS variables) are the single source of truth for the color system — change them there to re-theme the whole app instantly, light and dark mode included.
