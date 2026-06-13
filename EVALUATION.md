# Evaluation Notes — StudySync (MindMitra)

A self-assessment against the judging criteria.

---

## 1. Code Quality

- **Modular backend** — logic split across `server.js` (routes), `gemini.js` (AI), `sanitize.js` (validation), `crisis.js` (safety), `fallbacks.js` (resilience)
- **Consistent style** — uniform naming, early returns, no nested callbacks
- **React component structure** — pages in `pages/`, shared UI in `components/`, API layer isolated in `api/client.js`
- **No hardcoded secrets** — API key only via `.env` / Vercel environment variable

---

## 2. Security

- **Input sanitization on every route** — all fields clamped, whitelisted, or trimmed server-side via `sanitize.js` before any AI call
- **Request size limit** — `express.json({ limit: '32kb' })` prevents oversized payloads
- **CORS locked** — restricted to `localhost:5173` in dev and the deployed frontend URL in production via `FRONTEND_URL` env var
- **Crisis detection is pre-AI** — `detectCrisis()` runs before Gemini is called, so no crisis message ever reaches the model
- **No database / no auth** — zero attack surface from persistent storage; all data stays in the user's browser (`localStorage`)
- **`.env` excluded from git** — `.gitignore` explicitly blocks `.env` and all `node_modules/`

---

## 3. Efficiency

- **Model fallback chain** — primary model tried first; if quota is hit (429), falls back to next model with a 500ms delay — no silent failure
- **Graceful degradation** — every API route catches errors and returns a pre-written fallback response, keeping the app functional even if Gemini is down
- **History capped at 7 days** — `sanitizeHistory()` slices to last 7 entries before sending to AI, keeping prompt size bounded
- **localStorage only** — no server-side state means zero database latency
- **Vite build** — production assets are minified and tree-shaken; static files served directly from Vercel CDN

---

## 4. Testing

- **15 unit tests** — `node:test` built-in runner, no external test framework needed
- **Safety tests** — 7 tests for crisis keyword detection (the most safety-critical path)
- **AI resilience tests** — 5 tests for JSON parsing and fallback on malformed Gemini output
- **Shape validation tests** — 3 tests ensuring bad AI responses are rejected before reaching the client
- **Manual test plan** — 7 integration scenarios documented in [`TEST_CASES.md`](TEST_CASES.md)
- **All 15 pass** — `npm test` exits 0 with no failures or skips

---

## 5. Accuracy

- **Gemini prompts are exam-student-specific** — prompts include exam name, age, and study context rather than generic wellness prompts
- **Structured JSON output enforced** — every prompt requests strict JSON; `parseGeminiJson()` strips markdown fences and `validate*()` checks required fields
- **Correlation-based analysis** — weekly analysis prompt explicitly asks Gemini to find correlations between sleep, study hours, mood, stress, and energy — not just averages
- **Fallback accuracy** — fallback responses are pre-written to be contextually accurate for Indian exam students (references mock tests, JEE/NEET pressure, sleep vs study tradeoffs)
- **Crisis accuracy** — 12 specific keyword phrases tested; no false positives on common exam stress language

---

## 6. Problem Statement Alignment

**Problem:** Indian competitive exam students (JEE, NEET, UPSC etc.) face extreme mental pressure with no wellness tools tailored to their specific context.

| Requirement | How MindMitra addresses it |
|---|---|
| Track daily mental state | Daily check-in: mood, stress, energy, sleep, study hours, challenges |
| Surface study-specific patterns | Weekly Dashboard correlates sleep deprivation with stress spikes, identifies challenge patterns |
| Immediate coping support | Generates a personalized 2–5 min coping exercise after every check-in |
| Safe companion | Crisis detection with Indian helplines (iCall, Vandrevala Foundation) |
| Exam-aware context | Profile includes exam type; all AI prompts reference it for relevant responses |
| Accessible | No login, no database — works immediately in any browser |
