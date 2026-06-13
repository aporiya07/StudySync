# Test Cases — StudySync

## Running Tests

```bash
cd StudySync
npm test
# → node --test tests/*.test.js
```

All 15 tests pass with zero failures.

---

## Test Suite 1 — Crisis Detection (`tests/crisis.test.js`)

Tests the safety-critical `detectCrisis()` function that runs **before every AI call** on the chat route.

| # | Test Case | Input | Expected | Result |
|---|---|---|---|---|
| TC-01 | Detects `suicide` keyword | `"I want to suicide"` | `true` | ✅ Pass |
| TC-02 | Detects `kill myself` | `"Sometimes I think I should kill myself"` | `true` | ✅ Pass |
| TC-03 | Detects `end my life` | `"I want to end my life"` | `true` | ✅ Pass |
| TC-04 | Detects `don't want to live` | `"I don't want to live anymore"` | `true` | ✅ Pass |
| TC-05 | No false positive on exam stress | `"I'm stressed about JEE mock test scores"` | `false` | ✅ Pass |
| TC-06 | Handles empty / whitespace input | `""` and `"   "` | `false` | ✅ Pass |
| TC-07 | Crisis response contains India helplines | `getCrisisResponse()` | `isCrisis: true`, includes `9152987821` and `1860-2662-345` | ✅ Pass |

---

## Test Suite 2 — Gemini JSON Parsing (`tests/parseJson.test.js`)

Tests `parseGeminiJson()` which strips markdown fences from Gemini responses, and all three `validate*()` shape validators.

### 2a — `parseGeminiJson()`

| # | Test Case | Input | Expected | Result |
|---|---|---|---|---|
| TC-08 | Parses plain JSON | `'{"message":"hello"}'` | `result.message === "hello"` | ✅ Pass |
| TC-09 | Strips ` ```json ``` ` markdown fences | ` ```json\n{"strategy":"breathe","type":"breathing"}\n``` ` | `result.type === "breathing"` | ✅ Pass |
| TC-10 | Falls back gracefully on malformed JSON (analyze) | `"not json at all"` | Fallback has `burnoutRadar`, `stressTriggers[]`, `weeklyInsight` | ✅ Pass |
| TC-11 | Falls back gracefully on malformed JSON (coping) | `"{ broken"` | Fallback has `strategy` and `type` | ✅ Pass |
| TC-12 | Falls back gracefully on malformed JSON (chat) | `""` | Fallback has `message` | ✅ Pass |

### 2b — Shape Validators

| # | Test Case | Input | Expected | Result |
|---|---|---|---|---|
| TC-13 | `validateAnalyze` accepts valid data | `getAnalyzeFallback()` | `burnoutRadar.level === "Moderate"` | ✅ Pass |
| TC-14 | `validateCoping` rejects invalid `type` | `{ strategy: "x", type: "invalid" }` | Throws error | ✅ Pass |
| TC-15 | `validateChat` requires `message` field | `{}` | Throws error | ✅ Pass |

---

## Manual Test Cases (UI / Integration)

These require both servers running locally or the app deployed on Vercel.

### MT-01 — Profile Setup Flow
**Steps:** Open app → redirected to `/setup` → fill Name, Age, Exam → Submit  
**Expected:** Profile saved to `localStorage`, redirected to `/check-in`

### MT-02 — Daily Check-In + Coping Strategy
**Steps:** Complete sliders (Mood, Stress, Energy), select Sleep & Study hours, pick a challenge, submit  
**Expected:** Spinner shows "Generating your coping strategy...", `/insights` loads with an AI-generated strategy

### MT-03 — Weekly Dashboard (Burnout Radar)
**Steps:** Complete ≥2 check-ins → navigate to `/dashboard`  
**Expected:** Burnout Radar level (Low/Moderate/High), stress triggers list, weekly insight paragraph

### MT-04 — Companion Chat (Normal Message)
**Steps:** Navigate to `/chat` → type `"I'm feeling overwhelmed with my studies"` → Send  
**Expected:** Empathetic 3–5 sentence reply from StudySync AI, `isCrisis: false`

### MT-05 — Crisis Detection (Safety Gate)
**Steps:** In chat → type `"I want to end my life"`  
**Expected:** Red-styled response with iCall and Vandrevala Foundation helpline numbers, **no Gemini API call made**

### MT-06 — Offline / API Failure Fallback
**Steps:** Start backend with `USE_MOCKS=true` → use any feature  
**Expected:** All routes return valid, pre-written fallback responses — app remains fully usable

### MT-07 — SPA Route Persistence (Vercel)
**Steps:** Navigate to `https://your-app.vercel.app/chat` directly or refresh the page  
**Expected:** React app loads correctly (not a 404), routing handled by `index.html` fallback

---

## Coverage Summary

| Area | Unit Tests | Manual Tests | Notes |
|---|---|---|---|
| Crisis detection | ✅ 7 cases | ✅ MT-05 | Safety-critical, tested first |
| Gemini JSON parsing | ✅ 5 cases | — | Handles malformed AI output |
| Response shape validation | ✅ 3 cases | — | Guards against bad Gemini responses |
| Check-in → coping flow | — | ✅ MT-02 | End-to-end with real Gemini call |
| Weekly analysis | — | ✅ MT-03 | Requires ≥2 days of data |
| Chat companion | — | ✅ MT-04 | Tested with real message |
| Input sanitization | — | Covered by sanitize.js | All inputs clamped/validated server-side |
| Fallback resilience | — | ✅ MT-06 | App works without API key |
| SPA routing (Vercel) | — | ✅ MT-07 | `vercel.json` rewrite tested |
