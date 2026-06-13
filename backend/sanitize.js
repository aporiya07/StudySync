const EXAMS = ['NEET', 'JEE', 'CUET', 'CAT', 'GATE', 'UPSC', 'Other'];
const SLEEP_OPTIONS = ['<4h', '4-6h', '6-8h', '8h+'];
const STUDY_OPTIONS = ['0-2', '2-4', '4-6', '6-8', '8+'];
const CHALLENGES = [
  'Mock Test',
  'Family Pressure',
  'Time Management',
  'Fear of Failure',
  'Lack of Motivation',
  'Poor Sleep',
  'Distractions',
  'Other',
];

const trim = (value, max = 500) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

function clampNum(value, min, max, fallback) {
  const n = Number(value);
  if (Number.isNaN(n)) return fallback;
  return Math.min(Math.max(Math.round(n), min), max);
}

function sanitizeProfile(body = {}) {
  return {
    name: trim(body.name, 100) || 'Student',
    age: clampNum(body.age, 10, 99, 18),
    exam: EXAMS.includes(body.exam) ? body.exam : 'Other',
    targetExamDate: trim(body.targetExamDate, 20) || new Date().toISOString().slice(0, 10),
  };
}

function sanitizeCheckIn(body = {}) {
  const challenges = Array.isArray(body.challenges)
    ? body.challenges.filter((c) => CHALLENGES.includes(c)).slice(0, 8)
    : [];

  return {
    date: trim(body.date, 20) || new Date().toISOString().slice(0, 10),
    mood: clampNum(body.mood, 1, 10, 5),
    stress: clampNum(body.stress, 1, 10, 5),
    energy: clampNum(body.energy, 1, 10, 5),
    sleep: SLEEP_OPTIONS.includes(body.sleep) ? body.sleep : '6-8h',
    studyHours: STUDY_OPTIONS.includes(body.studyHours) ? body.studyHours : '4-6',
    challenges,
    reflection: trim(body.reflection),
  };
}

function sanitizeHistory(body = {}) {
  const history = Array.isArray(body.history) ? body.history : [];
  return history.slice(-7).map(sanitizeCheckIn);
}

function sanitizeChatBody(body = {}) {
  return {
    message: trim(body.message, 1000),
    profile: sanitizeProfile(body.profile || {}),
    checkIn: body.checkIn ? sanitizeCheckIn(body.checkIn) : null,
    recentHistory: sanitizeHistory({ history: body.recentHistory || [] }),
  };
}

module.exports = {
  sanitizeProfile,
  sanitizeCheckIn,
  sanitizeHistory,
  sanitizeChatBody,
  EXAMS,
  SLEEP_OPTIONS,
  STUDY_OPTIONS,
  CHALLENGES,
};
