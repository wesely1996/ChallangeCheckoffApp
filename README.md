# Challenge Checkoff App

A React app for tracking multi-day challenges. Mark off days as you complete them, visualize your progress, and manage multiple challenges at once.

Live at: [wesely1996.github.io/ChallangeCheckoffApp](https://wesely1996.github.io/ChallangeCheckoffApp/)

## Features

- Create challenges with a custom name, duration (in days), and start date
- Check off individual days as you complete them (optimistic updates)
- Progress bar per challenge
- Delete challenges with a confirmation dialog
- Pink / blue theme toggle, persisted to `localStorage`

## Tech stack

- React 19 + TypeScript + Vite
- Google Sheets as the database, accessed via a Google Apps Script web app
- Deployed to GitHub Pages via `gh-pages`

## Commands

```bash
npm run dev        # Start dev server with HMR
npm run build      # Type-check + build to dist/
npm run lint       # ESLint
npm run preview    # Preview production build locally
npm run deploy     # Build + publish to GitHub Pages
```

## Data layer

All persistence goes through a Google Apps Script web app acting as a REST-ish API. The frontend calls it directly from the browser:

| Action | Method | Description |
|---|---|---|
| `getChallenges` | GET | Fetch all challenges |
| `createChallenge` | POST | Create a new challenge |
| `toggleDay` | POST | Mark/unmark a day |
| `deleteChallenge` | POST | Delete a challenge |

The script URL is hardcoded in `src/api/sheetsApi.ts`. POST requests use `Content-Type: text/plain` to avoid CORS preflight.

The Apps Script source lives in `google-apps-script/Code.gs` and must be manually deployed from within Google Sheets via **Extensions > Apps Script > Deploy**.

## Setup

1. Clone the repo and run `npm install`
2. Open the Google Sheet and deploy `google-apps-script/Code.gs` as a web app (anyone, execute as you)
3. Paste the deployment URL into `SCRIPT_URL` in `src/api/sheetsApi.ts`
4. Run `npm run dev`
