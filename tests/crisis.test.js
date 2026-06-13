const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { detectCrisis } = require('../backend/crisis');
const { getCrisisResponse } = require('../backend/fallbacks');

describe('detectCrisis', () => {
  it('detects suicide keyword', () => {
    assert.equal(detectCrisis('I want to suicide'), true);
  });

  it('detects kill myself', () => {
    assert.equal(detectCrisis('Sometimes I think I should kill myself'), true);
  });

  it('detects end my life', () => {
    assert.equal(detectCrisis('I want to end my life'), true);
  });

  it('detects dont want to live', () => {
    assert.equal(detectCrisis("I don't want to live anymore"), true);
  });

  it('returns false for normal exam stress', () => {
    assert.equal(detectCrisis("I'm stressed about JEE mock test scores"), false);
  });

  it('returns false for empty message', () => {
    assert.equal(detectCrisis(''), false);
    assert.equal(detectCrisis('   '), false);
  });

  it('crisis response includes India helplines', () => {
    const res = getCrisisResponse();
    assert.equal(res.isCrisis, true);
    assert.ok(res.message.includes('9152987821'));
    assert.ok(res.message.includes('1860-2662-345'));
  });
});
