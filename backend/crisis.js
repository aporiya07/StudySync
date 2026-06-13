const CRISIS_PATTERNS = [
  'kill myself',
  'kill my self',
  'end my life',
  'suicide',
  "don't want to live",
  'dont want to live',
  'want to die',
  'self-harm',
  'self harm',
  'hurt myself',
  'not worth living',
  'better off dead',
];

function detectCrisis(message) {
  if (typeof message !== 'string' || !message.trim()) {
    return false;
  }
  const normalized = message.toLowerCase();
  return CRISIS_PATTERNS.some((pattern) => normalized.includes(pattern));
}

module.exports = { detectCrisis, CRISIS_PATTERNS };
