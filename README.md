# Operator App

A personal training tracker PWA built with React. Tracks a structured 168-day programme across three phases — Capacity, Velocity, and Outcome — covering gym sessions, running, and rucking.

---

## Features

- **Structured plan** — 168-day programme across 3 phases (Capacity → Velocity → Outcome), 8 weeks each
- **Session tracking** — gym (upper/lower/SE), runs, rucks, and rest days with progressive overload suggestions
- **No-gym mode** — converts any gym session to a bodyweight equivalent; still counts toward the plan
- **Missed session recovery** — modal with Push Back / Condensed / Skip options
- **Rest timer** — tappable rest cells start a countdown with vibration on completion
- **Run logging** — distance, time, RPE, auto-calculated pace per mile and km
- **Ruck log** — weight, distance, notes, with history
- **Lift progress charts** — canvas line charts for Deadlift, Squat, DB Bench Press, and Pull Ups
- **Session history** — unified gym + run feed in Stats, expandable entries
- **Weight tracking** — log and visualise body weight trend
- **Strava integration** — OAuth connection showing YTD km, milestone progress, recent runs
- **Streak counter** — consecutive days tracked with labels
- **Badges** — 30 awards across running, lifting, sessions, phase, streak, and weight categories
- **Deload detection** — auto-detects deload weeks and shows guidance
- **Weekly summary** — 7-day tile view on Dashboard
- **Upcoming sessions** — next 5 sessions preview with tap-to-navigate
- **Confetti** on session completion
- **Swipe navigation** between tabs
- **PWA** — installable on Android/iOS, works offline

---

## Stack

| | |
|---|---|
| Framework | React 18 + Vite 5 |
| PWA | vite-plugin-pwa (Workbox) |
| Styling | CSS custom properties, no UI library |
| State | `localStorage` (`op_v3` key) |
| Deploy | GitHub Actions → GitHub Pages |
| Icons | Python Pillow (generated in CI) |

---

## Local Development

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173/operator_app/`.

Strava OAuth requires the client secret — it is only available in production builds deployed via GitHub Actions. The Strava panel will show a "deploy via GitHub Actions" message locally.

---

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which:

1. Installs dependencies
2. Generates PWA icons via `scripts/generate_icons.py` (requires Pillow)
3. Builds with `VITE_STRAVA_CLIENT_SECRET` injected from GitHub Secrets
4. Deploys to GitHub Pages

The GitHub secret must be named `STRAVA_CLIENT_SECRET`.

---

## Strava Setup

| | |
|---|---|
| Client ID | `235259` |
| Redirect URI | `https://drtudor.github.io/operator_app/` |
| Scope | `read,activity:read` |

The client secret lives in GitHub Secrets and is bundled into the JS at build time. This is acceptable for a personal app — do not share the built bundle publicly if you want the secret protected.

---

## Plan Structure

| Phase | Days | Focus |
|---|---|---|
| Capacity | 1–56 | Base fitness, aerobic development |
| Velocity | 57–112 | Speed, power, intensity |
| Outcome | 113–168 | Peak performance, event prep |

Each phase has a deload week (week 4 and week 8). The plan auto-detects which day you are on based on `startDate` and `skippedDays` in state.

---

## Data Schema (`localStorage` key: `op_v3`)

```json
{
  "startDate": "2026-05-03",
  "skippedDays": 0,
  "missedDates": [],
  "completed": [1],
  "weights": [{ "date": "2026-05-03", "value": "96.8" }],
  "runs": [{ "date": "...", "dist": "5k", "secs": 1500 }],
  "pbs": { "5k": 1500 },
  "ruckLogs": [{ "date": "...", "weight": 20, "distance": 4, "notes": "" }],
  "runSessionLogs": [{ "date": "...", "planDay": 3, "distance": 3, "timeSeconds": 1620, "pace": 540, "effort": 7, "notes": "" }],
  "workoutHistory": [{ "date": "...", "planDay": 1, "type": "upper", "exercises": { "Pull Ups": { "weight": 77, "reps": 5, "sets": 2 } }, "notes": "" }]
}
```
