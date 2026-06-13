# StudySync

**Balance your studies and wellbeing.**

StudySync helps Indian exam aspirants (NEET, JEE, CUET, CAT, GATE, UPSC) balance intense study schedules with mental wellness. Unlike generic mood apps, StudySync maps stress triggers to study patterns and exam countdown urgency — surfacing correlations like *"stress spikes when sleep < 6h and study > 8h"* and offering immediate 2–5 minute coping strategies plus a safe AI companion.

## Features

- **Profile setup** — personalized exam countdown header
- **Daily check-in** — mood, stress, energy, sleep, study hours, challenges, adaptive reflection
- **Today's insights** — AI-generated coping strategy after each check-in
- **Weekly dashboard** — Burnout Radar, Hidden Stress Triggers, Weekly Pattern Analysis
- **Companion chat** — AI chat with crisis detection guardrails

## Safety

- Crisis keyword detection runs **before** any AI call on chat
- Fixed India helplines returned for crisis messages: iCall (9152987821), Vandrevala Foundation (1860-2662-345)
- Standing disclaimer: *StudySync AI supports emotional wellness and is not a substitute for professional help.*

## Setup

### Prerequisites

- Node.js 18+
- Gemini API key

### Install

```bash
cd StudySync
npm run install:all
```

### Environment

Create a `.env` file in the project root:

```
GEMINI_API_KEY=your_key_here
```

### Run locally

Terminal 1 — backend:

```bash
npm run dev:backend
```

Terminal 2 — frontend:

```bash
npm run dev:frontend
```

Open http://localhost:5173

### Tests

```bash
npm test
```

### Production build

```bash
npm run build
NODE_ENV=production npm start
```

## Deploy (Vercel)

1. Push this repo to a **public** GitHub repository (< 10 MB — no `node_modules` or `dist`)
2. Import the repo on [vercel.com](https://vercel.com)
3. Set environment variable: `GEMINI_API_KEY`
4. Build command: `npm run install:all && npm run build`
5. The included `vercel.json` routes all traffic through the Express API handler

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS + React Router
- **Backend:** Node.js + Express
- **AI:** Google Gemini (`gemini-2.5-flash` for analysis, `gemini-2.5-flash-lite` for coping + chat)
- **Storage:** localStorage (profile + check-in history)

## Docs

- [TEST_CASES.md](TEST_CASES.md) — Unit tests, manual test scenarios, and coverage summary
- [EVALUATION.md](EVALUATION.md) — Self-assessment: code quality, security, efficiency, testing, accuracy, problem alignment

## License

See [LICENSE](LICENSE).
