# HealTrack — Smart Emergency Healthcare App
### Full Project Documentation

---

## 1. Overview

HealTrack is a mobile-first emergency healthcare application built as a single-page React app. It lets a user manage their medical profile, book hospital appointments, request ambulances, and — most importantly — trigger fast emergency assistance (SOS) that alerts a trusted guardian or surfaces the nearest police stations and hospitals, directly from the home screen.

The project is a **complete frontend implementation** with realistic mock data standing in for a backend. It is built to be dropped onto a real backend (auth, hospitals, ambulances, notifications, SOS logging) with minimal rework, because all data access is centralized in a small number of files (see §8).

| | |
|---|---|
| **Type** | Single-page web app (mobile-first, works on desktop too) |
| **Status** | Frontend-complete demo; no backend attached |
| **Auth** | Dummy OTP flow (Phone `9876543210`, OTP `1234`) |
| **Persistence** | Browser `localStorage` (survives refresh, not shared across devices) |
| **Languages** | 8 (English, Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi) |
| **Theme** | Light + premium dark mode, system-preference aware |

---

## 2. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Build tool | **Vite 5** | Fast dev server, instant HMR |
| Framework | **React 18** + **TypeScript 5** | Type safety across the whole app |
| Routing | **react-router-dom v6** | Client-side routing, nested route guards |
| Styling | **Tailwind CSS 3** | Utility-first styling, custom design tokens |
| Icons | **lucide-react** | Consistent icon set used everywhere |
| Maps | **Leaflet** (plain, not react-leaflet) | Lightweight, framework-agnostic map rendering |
| i18n | **react-i18next** + **i18next-browser-languagedetector** | 8-language support with auto-detection |
| Animation | Tailwind keyframes (no animation library) | Pulse rings, heartbeat, fade/scale transitions |
| State | React Context + `useState`/`useEffect` (no Redux/Zustand) | Small-to-medium app size didn't need a state library |
| Persistence | Browser `localStorage` via a typed wrapper | No backend yet; swap for real API calls later |

No backend, database, or external API keys are required to run the app — everything works out of the box except:
- **Live GPS location** (needs the browser's geolocation permission — this part is fully real)
- **Reverse geocoding** (calls the public OpenStreetMap Nominatim API — real, no key needed)
- **Map tiles** (calls the public OpenStreetMap tile server — real, no key needed)

---

## 3. Getting Started

```bash
# 1. Unzip the project, then from inside the folder:
npm install

# 2. Start the dev server
npm run dev
# → opens on http://localhost:5173 (or the next free port)

# 3. Production build (optional)
npm run build
npm run preview
```

**Demo login:** Phone `9876543210`, OTP `1234`.

**Requirements:** Node.js 18+ and npm. An internet connection is needed once for `npm install`, and again at runtime only for the map tiles/reverse-geocoding calls mentioned above — the rest of the app works fully offline once loaded.

---

## 4. Project Structure

```
healtrack-app/
├── index.html                 Vite entry HTML (loads Leaflet's CSS from a CDN)
├── package.json                Dependencies & npm scripts
├── vite.config.ts              Vite config — defines the "@/" → "src/" path alias
├── tailwind.config.ts          Design tokens: colors, radii, shadows, keyframes
├── tsconfig.json                TypeScript compiler config (strict mode on)
│
└── src/
    ├── main.tsx                 React root + i18n bootstrap
    ├── App.tsx                  Providers + route table (the app's "map")
    ├── index.css                 Global styles, CSS variables for light/dark theme
    │
    ├── types/index.ts            Every shared TypeScript type/interface
    │
    ├── context/                  Global state, one file per concern
    │   ├── AuthContext.tsx        Login/OTP/session state
    │   ├── ThemeContext.tsx       Light/dark mode
    │   └── AppStateContext.tsx    Everything else: profile, guardians, appointments,
    │                              ambulance bookings, notifications, SOS events, location
    │
    ├── i18n/
    │   ├── index.ts               i18next setup + list of supported languages
    │   └── locales/*.json         One JSON file per language
    │
    ├── lib/
    │   ├── mockData.ts            Hospitals, doctors, police stations, ambulance types
    │   ├── geo.ts                 Haversine distance + "nearest facilities" ranking
    │   ├── storage.ts             Typed localStorage get/set wrapper
    │   └── utils.ts                Small helpers (className merge, id generator, time formatting)
    │
    ├── components/                Reusable, cross-page building blocks
    │   ├── ui/                    Generic UI primitives (Button, Card, Dialog, Toast, Badge, Skeleton, EmptyState)
    │   ├── SOSCard.tsx             The homepage SOS button + full two-option emergency flow
    │   ├── HospitalCard.tsx        Hospital list-item used on Home + Hospital list
    │   ├── LocationCard.tsx        Live GPS card shown on Home
    │   ├── LeafletMap.tsx          Plain-Leaflet map wrapper (markers, routes)
    │   ├── BottomNav.tsx           5-tab bottom navigation with raised emergency button
    │   ├── PageHeader.tsx          Shared back-button header for inner pages
    │   └── OnboardingProgress.tsx  Step-progress bar used in onboarding
    │
    └── pages/                     One file per screen, organized by feature folder
        ├── Splash.tsx, Login.tsx, OTP.tsx
        ├── onboarding/  Welcome.tsx, LanguageSelect.tsx, LocationPermission.tsx
        ├── Home.tsx, Search.tsx, Notifications.tsx
        ├── hospitals/   HospitalList.tsx, HospitalDetail.tsx
        ├── appointments/BookAppointment.tsx, AppointmentList.tsx
        ├── ambulance/   BookAmbulance.tsx, TrackAmbulance.tsx
        ├── emergency/   EmergencyActive.tsx
        ├── guardians/   GuardianList.tsx, AddGuardian.tsx
        └── profile/     Profile.tsx, EditProfile.tsx, MedicalHistory.tsx, HealthData.tsx,
                          Insurance.tsx, EmergencyContacts.tsx, MedicalIdCard.tsx, Settings.tsx
```

---

## 5. Routing Map

Defined in `src/App.tsx`. Every route except Splash/Login/OTP/Onboarding is wrapped in `<RequireAuth>`, which redirects to `/login` if not authenticated, or `/onboarding/welcome` if authenticated but onboarding isn't finished. Routes marked **[Tab]** render inside `<TabLayout>`, which adds the bottom navigation bar.

| Path | Screen | Notes |
|---|---|---|
| `/` | Splash | Auto-redirects after ~1.8s based on auth state |
| `/login` | Login | Mobile number entry |
| `/otp` | OTP | 4-digit code, auto-focus/paste/resend |
| `/onboarding/welcome` | Onboarding step 1 | |
| `/onboarding/language` | Onboarding step 2 | Picks from 8 languages |
| `/onboarding/location` | Onboarding step 3 | Requests real GPS permission |
| `/home` **[Tab]** | Home | SOS card, location, categories, quick actions, nearby hospitals |
| `/search` | Search | Recent searches + grouped live results |
| `/hospitals` **[Tab]** | Hospital list | Filter chips, sort, list/map toggle |
| `/hospitals/:id` | Hospital detail | Tabs: overview/doctors/facilities/availability |
| `/appointments` **[Tab]** | Appointment list | Upcoming/Completed/Cancelled tabs |
| `/appointments/book` | Book appointment | 4-step flow |
| `/ambulance/book` | Book ambulance | Type selection + pickup/destination |
| `/ambulance/track/:id` | Track ambulance | Live progress timeline (auto-advances every 4s for demo) |
| `/emergency` **[Tab]** | Emergency Active | Full-screen active-emergency mode |
| `/guardians` | Guardian list | My Profile / Guardian View toggle |
| `/guardians/add` | Add guardian | Max 2 guardians |
| `/profile` **[Tab]** | Profile | Main hub — medical ID, health summary, menu sections |
| `/profile/edit` | Edit profile | Name, age, blood group |
| `/profile/medical-history` | Medical history | Timeline grouped by year |
| `/profile/health-data` | Health data | Heart rate / BP / temp / weight |
| `/profile/insurance` | Insurance | Add/view policy (masked policy number) |
| `/profile/emergency-contacts` | Emergency contacts | Separate from Guardians |
| `/profile/medical-id` | Medical ID card | Shareable digital ID card |
| `/profile/settings` | Settings | Language, dark mode, notifications, privacy, help |
| `/notifications` | Notifications | Grouped Today/Earlier, read/unread |

---

## 6. State Management

There is no Redux/Zustand — three React Context providers cover everything, all wrapped around the router in `App.tsx`:

### `AuthContext`
Handles the dummy OTP login flow and onboarding completion flag.
- `isAuthenticated`, `hasOnboarded`, `phone`
- `requestOtp(phone)`, `verifyOtp(otp)`, `resetPendingPhone()`
- `completeOnboarding()`, `logout()`

### `ThemeContext`
Light/dark mode. Reads system preference on first load, then persists the user's choice.
- `theme`, `toggleTheme()`, `setTheme(t)`

### `AppStateContext`
Everything else — this is the app's "database." All of it is persisted to `localStorage` under the key `healtrack:appstate` and re-hydrated on load.

| Data | Shape | Key actions |
|---|---|---|
| `profile` | `UserProfile` | `updateProfile(patch)` |
| `guardians` | `Guardian[]` (max 2) | `addGuardian()`, `removeGuardian()` |
| `emergencyContacts` | `EmergencyContact[]` | `addEmergencyContact()`, `removeEmergencyContact()` |
| `appointments` | `Appointment[]` | `addAppointment()`, `cancelAppointment()` |
| `ambulanceBookings` | `AmbulanceBooking[]` | `requestAmbulance()`, `advanceAmbulance()`, `cancelAmbulance()` |
| `medicalHistory` | `MedicalHistoryEntry[]` | (starts empty — no fabricated entries) |
| `healthMetrics` | `HealthMetric[]` | (starts empty — no fabricated readings) |
| `insurance` | `InsuranceInfo \| null` | `setInsurance()` |
| `notifications` | `AppNotification[]` | `pushNotification()`, `markNotificationRead()`, `markAllNotificationsRead()`, `clearAllNotifications()` |
| `emergency` | Active-emergency flags | `startEmergency()`, `endEmergency()` |
| `sosEvents` | `SOSEvent[]` | `logSOSEvent()` — client-side log of every SOS trigger (see §9) |
| `guardianMode` | boolean | `setGuardianMode()` — toggles the read-only "Guardian View" |
| `location` | `LocationState` | `detectLocation()` — real GPS + reverse geocoding |

---

## 7. Design System

All colors are defined as CSS variables in `src/index.css` (light values under `:root`, dark values under `.dark`), then exposed to Tailwind as semantic color names in `tailwind.config.ts`. This means **the entire app's look can be re-themed by editing one file** — no component ever hardcodes a hex color.

| Semantic name | Light | Usage |
|---|---|---|
| `primary` | Deep navy | Brand color, main buttons, header gradients |
| `emergency` | Red | SOS button, cancel actions, critical badges |
| `success` | Teal/green | Confirmed states, "open" badges |
| `warning` | Amber | Caution badges, location errors |
| `info` | Blue | Informational badges, location card |
| `background` / `surface` | Off-white / white | Page background vs. card background |
| `muted` | Light gray | Secondary backgrounds, disabled states |

Every semantic color has `-50`, `-600`, `-700` shade variants (e.g. `bg-emergency-50`, `text-emergency-600`) for tinted backgrounds and readable-on-light-background text.

**Typography:** system font stack (`Inter`/`Segoe UI`/system-ui) — no custom font loading required.

**Animations** (all in `tailwind.config.ts` as keyframes, respecting `prefers-reduced-motion`):
- `animate-pulse-ring` — the expanding ring behind the SOS button
- `animate-heartbeat` — subtle scale pulse on the SOS button and splash logo
- `animate-shimmer` — skeleton loading shimmer
- `animate-fade-in` / `animate-scale-in` — dialog and content entrance transitions

**Layout:** the whole app is capped at `480px` wide (`#root { max-width: 480px }` in `index.css`) and centered on larger screens, so it always renders like a phone app regardless of window size.

---

## 8. Where Mock Data Lives (Backend Integration Points)

Everything a real backend would eventually serve lives in `src/lib/mockData.ts`:
- `HOSPITALS` — 4 sample hospitals with coordinates, specializations, beds, hours
- `DOCTORS` — 5 sample doctors linked to hospitals
- `POLICE_STATIONS` — 3 sample police stations with coordinates
- `HEALTH_CATEGORIES` — the 8 icons on the Home screen
- `RELATIONSHIP_OPTIONS` — dropdown options for guardians/contacts
- `AMBULANCE_TYPES` — Basic/Advanced/ICU with price/ETA/equipment
- `NOTIFICATIONS_SEED` — the 3 example notifications shown on first login

**To connect a real backend:** replace the imports of these constants with API calls (e.g. in `HospitalList.tsx`, `AppStateContext.tsx`'s `requestAmbulance`, etc.), and swap `src/lib/storage.ts` (`localStorage`) for real API persistence in `AuthContext.tsx` and `AppStateContext.tsx`. The rest of the app's UI logic does not need to change, since components only ever talk to the two contexts, never to `mockData.ts` directly (except for read-only listing pages).

---

## 9. The SOS Emergency Flow (Home Screen)

This is the app's most safety-critical feature, so it's documented in detail.

**Entry point:** tapping the large pulsing SOS button on Home (`SOSCard.tsx`) opens a chooser with two options, without navigating through the Emergency tab:

### Option 1 — Alert Guardian
1. Confirms first ("Alert **[Guardian Name]**?") to prevent accidental triggers.
2. On confirm:
   - Opens the phone dialer via `tel:` link to the guardian's number.
   - Opens the device's SMS app via `sms:` link, pre-filled with a message containing the user's name, current location (or coordinates if no address label yet), and the timestamp.
   - Pushes a real in-app notification (visible on the Notifications page).
   - Reads the current GPS location from `AppStateContext`.
3. Shows a results screen with a ✓/⚠ checklist of what actually happened. **Honesty note:** a browser cannot silently place a call or send an SMS — it can only hand off to the OS's dialer/messaging app. The checklist therefore says "Guardian call **initiated**" / "Guardian SMS **drafted**," never "delivered," since delivery can't be confirmed from JavaScript. Manual Call/SMS fallback buttons are shown either way.
4. If no guardian has been added yet, the app prompts the user to add one first instead of pretending to alert someone who doesn't exist.

### Option 2 — Nearby Emergency Services
1. Confirms first ("Find nearby help?").
2. On confirm, computes the closest hospitals **and** police stations using the Haversine formula (`src/lib/geo.ts`) against the user's real GPS coordinates when available, or the mock data's static distances as a fallback.
3. Shows up to 4 nearest facilities, each with a Call and Get Directions button.
4. **Important limitation, by design:** the app never claims a police station or hospital was "notified." There is no real integration with any emergency-service API, so it only ever offers Call/Directions — this matches the requirement that a facility being *shown as nearby* must never be confused with a facility *actually receiving an alert*.

### SOS Event Logging
Every trigger (either option) is recorded via `logSOSEvent()` into `AppStateContext`'s `sosEvents` array — a client-side stand-in for what a real backend's SOS audit log would store: timestamp, coordinates, accuracy, guardian info, and a status (`success`/`unavailable`/`skipped`) for each of call/SMS/notification/location/service-lookup. This is the first place to wire up a real backend endpoint for SOS logging.

---

## 10. Internationalization (i18n)

- Powered by `react-i18next`, configured in `src/i18n/index.ts`.
- **English and Hindi are fully translated** — every string in the app.
- **Tamil, Telugu, Kannada, Malayalam, Bengali, and Marathi** cover the highest-traffic screens (navigation, login/OTP, onboarding, Home, and the SOS flow). Any string not yet translated in these languages automatically falls back to English (`fallbackLng: 'en'`), so the app never shows a blank or broken label.
- The selected language is persisted to `localStorage` under `healtrack:language` and auto-detected from the browser on first visit.
- **To add a new language:** create a new file in `src/i18n/locales/`, add it to the `resources` object and `SUPPORTED_LANGUAGES` array in `src/i18n/index.ts`.
- **To add a new translatable string:** add the key to `en.json` first (this is the fallback), then optionally to the other locale files.

---

## 11. Known Limitations (By Design)

These are intentional, not bugs — they exist because this is a frontend-only build without a backend or paid APIs:

| Area | Current behavior | What a production build needs |
|---|---|---|
| Authentication | Dummy OTP, always accepts `1234` | Real OTP provider (Firebase Auth, MSG91, Twilio Verify) |
| Data persistence | Browser `localStorage` only | A real backend + database (per-user, cross-device) |
| Hospitals/Doctors/Police | Static mock list (4 hospitals, 5 doctors, 3 stations) | Real directory API or CMS |
| Ambulance booking | Simulated driver assignment, auto-advancing status | Real dispatch system integration |
| SOS to guardian | Opens the OS dialer/SMS app (real handoff, not silent auto-send) | A serverless function using a telephony API (Twilio, etc.) if truly silent server-side calling/SMS is required |
| SOS to police/hospital | Shows nearest facilities with Call/Directions only | No public API for this exists in most regions — would require a direct integration/partnership with local emergency services |
| Health data / medical history / insurance | Starts empty, never fabricated | Real EHR/insurance data source |
| Push notifications | In-app only (added to the Notifications list) | Web Push / FCM for true background notifications |

---

## 12. Scripts Reference

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local dev server with hot reload |
| `npm run build` | Type-check (`tsc -b`) and produce a production build in `dist/` |
| `npm run preview` | Serve the production build locally to sanity-check it |
| `npm run lint` | Run ESLint across the project |

---

## 13. Troubleshooting

| Symptom | Fix |
|---|---|
| `Cannot find module '@/...'` / import resolution errors | Make sure `vite.config.ts` has the `resolve.alias` block mapping `@` to `./src` (already included in this project) |
| `ENOENT: no such file or directory, open 'package.json'` | You're one folder above the project root — `cd` into the folder that directly contains `package.json` before running npm commands |
| Location shows "unavailable" | Browser location permission was denied, or you're testing on `http://` instead of `https://`/`localhost` (geolocation requires a secure context) |
| Old data seems to have disappeared after an update | If the app's `localStorage` key prefix changes between versions, previously saved data becomes unreachable under the new prefix — this is expected, just log in again |
| Port 5173 already in use | Vite automatically retries on 5174, 5175, etc. — check the terminal output for the actual URL |

---

## 14. Demo Credentials & Quick Facts Recap

- **Login:** Phone `9876543210`, OTP `1234`
- **Max guardians:** 2
- **Languages:** 8 (2 fully translated, 6 core-screen translated with English fallback)
- **Design tokens:** single source of truth in `tailwind.config.ts` + `src/index.css`
- **No backend required to run** — only real GPS/map/geocoding calls hit the network at runtime
