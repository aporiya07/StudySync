const { GoogleGenerativeAI } = require('@google/generative-ai');
const {
  getAnalyzeFallback,
  getCopingFallback,
  getChatFallback,
} = require('./fallbacks');

function parseGeminiJson(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }
  return JSON.parse(cleaned);
}

function validateAnalyze(data) {
  if (!data?.burnoutRadar?.level || !data?.burnoutRadar?.summary) {
    throw new Error('Invalid analyze shape');
  }
  if (!Array.isArray(data.stressTriggers)) {
    throw new Error('Invalid stressTriggers');
  }
  if (!data.weeklyInsight) {
    throw new Error('Invalid weeklyInsight');
  }
  return data;
}

function validateCoping(data) {
  const types = ['breathing', 'movement', 'reframe', 'break', 'motivation'];
  if (!data?.strategy || !types.includes(data.type)) {
    throw new Error('Invalid coping shape');
  }
  return data;
}

function validateChat(data) {
  if (!data?.message) {
    throw new Error('Invalid chat shape');
  }
  return { message: data.message, isCrisis: false };
}

const MODEL_ANALYZE = ['gemini-3.5-flash', 'gemini-2.5-flash'];
const MODEL_FAST = ['gemini-2.5-flash-lite', 'gemini-2.5-flash'];

function isQuotaError(err) {
  const msg = (err?.message || '').toLowerCase();
  const status = err?.status || err?.code;
  return (
    status === 429 ||
    msg.includes('429') ||
    msg.includes('quota') ||
    msg.includes('rate limit') ||
    msg.includes('resource exhausted')
  );
}

async function callGemini(apiKey, models, prompt) {
  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError;

  for (let i = 0; i < models.length; i++) {
    const modelName = models[i];
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return parseGeminiJson(text);
    } catch (err) {
      if (isQuotaError(err) && i < models.length - 1) {
        await new Promise((r) => setTimeout(r, 500));
        lastError = err;
        continue;
      }
      throw err;
    }
  }

  throw lastError;
}

function buildAnalyzePrompt(history, profile) {
  return `You are StudySync AI, an AI mental wellness analyst for Indian exam students preparing for ${profile.exam}.

Analyze the last 7 days of daily check-in data and return STRICT JSON only (no markdown fences):
{
  "burnoutRadar": { "level": "Low|Moderate|High", "summary": "..." },
  "stressTriggers": [ { "trigger": "...", "pattern": "...", "evidence": "..." } ],
  "weeklyInsight": "A 2-3 sentence correlation insight"
}

Student: ${profile.name}, age ${profile.age}, exam in progress.
Check-in history (JSON):
${JSON.stringify(history, null, 2)}

Find correlations between sleep, study hours, mood, stress, energy, and challenges. Be specific and empathetic.`;
}

function buildCopingPrompt(checkIn, profile) {
  return `You are StudySync AI, an empathetic wellness coach for ${profile.name} preparing for ${profile.exam}.

Based on today's check-in, suggest ONE short coping exercise (2-5 minutes). Return STRICT JSON only (no markdown fences):
{
  "strategy": "Short, specific 2-5 min coping exercise tailored to today's data",
  "type": "breathing|movement|reframe|break|motivation"
}

Today's check-in:
${JSON.stringify(checkIn, null, 2)}`;
}

function buildChatPrompt(message, profile, checkIn, recentHistory) {
  const context = checkIn
    ? `Today's mood: ${checkIn.mood}/10, stress: ${checkIn.stress}/10, energy: ${checkIn.energy}/10.`
    : 'No check-in today yet.';

  return `You are StudySync AI, an empathetic wellness companion for Indian exam students. Be warm, concise (3-5 sentences), never clinical or robotic.

Student: ${profile.name}, preparing for ${profile.exam}.
${context}
Recent history summary: ${recentHistory.length} days logged.

Respond to the student message with supportive, practical empathy. Return STRICT JSON only (no markdown fences):
{ "message": "your reply here" }

Student message: ${message}`;
}

async function analyzeHistory(history, profile, apiKey) {
  try {
    const raw = await callGemini(apiKey, MODEL_ANALYZE, buildAnalyzePrompt(history, profile));
    return validateAnalyze(raw);
  } catch (err) {
    console.error('Analyze failed:', err.message);
    return getAnalyzeFallback();
  }
}

async function generateCopingStrategy(checkIn, profile, apiKey) {
  try {
    const raw = await callGemini(apiKey, MODEL_FAST, buildCopingPrompt(checkIn, profile));
    return validateCoping(raw);
  } catch (err) {
    console.error('Coping strategy failed:', err.message);
    return getCopingFallback();
  }
}

async function generateChatReply(message, profile, checkIn, recentHistory, apiKey) {
  try {
    const raw = await callGemini(
      apiKey,
      MODEL_FAST,
      buildChatPrompt(message, profile, checkIn, recentHistory)
    );
    return validateChat(raw);
  } catch (err) {
    console.error('Chat failed:', err.message);
    return getChatFallback();
  }
}

module.exports = {
  parseGeminiJson,
  validateAnalyze,
  validateCoping,
  validateChat,
  analyzeHistory,
  generateCopingStrategy,
  generateChatReply,
};
