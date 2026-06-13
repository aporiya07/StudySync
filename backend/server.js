const path = require('path');
const express = require('express');
const cors = require('cors');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { detectCrisis } = require('./crisis');
const {
  getAnalyzeFallback,
  getCopingFallback,
  getCrisisResponse,
} = require('./fallbacks');
const {
  analyzeHistory,
  generateCopingStrategy,
  generateChatReply,
} = require('./gemini');
const {
  sanitizeProfile,
  sanitizeCheckIn,
  sanitizeHistory,
  sanitizeChatBody,
} = require('./sanitize');

const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

app.use(
  cors({
    origin: process.env.FRONTEND_URL || (isProd ? true : 'http://localhost:5173'),
  })
);
app.use(express.json({ limit: '32kb' }));

const USE_MOCKS = process.env.USE_MOCKS === 'true';

app.post('/api/analyze', async (req, res) => {
  const profile = sanitizeProfile(req.body?.profile || {});
  const history = sanitizeHistory(req.body || {});

  if (USE_MOCKS || !process.env.GEMINI_API_KEY) {
    return res.json(getAnalyzeFallback());
  }

  try {
    const result = await analyzeHistory(history, profile, process.env.GEMINI_API_KEY);
    return res.json(result);
  } catch (err) {
    console.error('Analyze route error:', err.message);
    return res.json(getAnalyzeFallback());
  }
});

app.post('/api/coping-strategy', async (req, res) => {
  const profile = sanitizeProfile(req.body?.profile || {});
  const checkIn = sanitizeCheckIn(req.body?.checkIn || {});

  if (USE_MOCKS || !process.env.GEMINI_API_KEY) {
    return res.json(getCopingFallback());
  }

  try {
    const result = await generateCopingStrategy(checkIn, profile, process.env.GEMINI_API_KEY);
    return res.json(result);
  } catch (err) {
    console.error('Coping route error:', err.message);
    return res.json(getCopingFallback());
  }
});

app.post('/api/chat', async (req, res) => {
  const { message, profile, checkIn, recentHistory } = sanitizeChatBody(req.body || {});

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (detectCrisis(message)) {
    return res.json(getCrisisResponse());
  }

  if (USE_MOCKS || !process.env.GEMINI_API_KEY) {
    const fallback = require('./fallbacks').getChatFallback();
    return res.json(fallback);
  }

  try {
    const result = await generateChatReply(
      message,
      profile,
      checkIn,
      recentHistory,
      process.env.GEMINI_API_KEY
    );
    return res.json(result);
  } catch (err) {
    console.error('Chat route error:', err.message);
    return res.json(require('./fallbacks').getChatFallback());
  }
});

if (isProd) {
  const distPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`StudySync backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;
