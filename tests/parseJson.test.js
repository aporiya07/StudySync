const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { parseGeminiJson, validateAnalyze, validateCoping, validateChat } = require('../backend/gemini');
const {
  getAnalyzeFallback,
  getCopingFallback,
  getChatFallback,
} = require('../backend/fallbacks');

describe('parseGeminiJson', () => {
  it('parses plain JSON', () => {
    const result = parseGeminiJson('{"message":"hello"}');
    assert.equal(result.message, 'hello');
  });

  it('strips markdown fences', () => {
    const wrapped = '```json\n{"strategy":"breathe","type":"breathing"}\n```';
    const result = parseGeminiJson(wrapped);
    assert.equal(result.type, 'breathing');
  });

  it('falls back on malformed JSON for analyze shape', () => {
    let parsed;
    try {
      parsed = parseGeminiJson('not json at all');
    } catch {
      parsed = getAnalyzeFallback();
    }
    assert.ok(parsed.burnoutRadar);
    assert.ok(Array.isArray(parsed.stressTriggers));
    assert.ok(parsed.weeklyInsight);
  });

  it('falls back on malformed JSON for coping shape', () => {
    let parsed;
    try {
      parsed = parseGeminiJson('{ broken');
    } catch {
      parsed = getCopingFallback();
    }
    assert.ok(parsed.strategy);
    assert.ok(parsed.type);
  });

  it('falls back on malformed JSON for chat shape', () => {
    let parsed;
    try {
      parsed = parseGeminiJson('');
    } catch {
      parsed = getChatFallback();
    }
    assert.ok(parsed.message);
  });
});

describe('validate shapes', () => {
  it('validateAnalyze accepts valid data', () => {
    const data = getAnalyzeFallback();
    assert.equal(validateAnalyze(data).burnoutRadar.level, 'Moderate');
  });

  it('validateCoping rejects invalid type', () => {
    assert.throws(() => validateCoping({ strategy: 'x', type: 'invalid' }));
  });

  it('validateChat requires message', () => {
    assert.throws(() => validateChat({}));
  });
});
