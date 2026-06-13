const PROFILE_KEY = 'profile';
const HISTORY_KEY = 'history';

export function getProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function clearAllData() {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(HISTORY_KEY);
}

export function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export function getDaysToExam(targetExamDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exam = new Date(targetExamDate);
  exam.setHours(0, 0, 0, 0);
  const diff = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

export function getTodayCheckIn() {
  const today = getTodayDate();
  return getHistory().find((entry) => entry.date === today) || null;
}

export function getYesterdayCheckIn() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().slice(0, 10);
  return getHistory().find((entry) => entry.date === dateStr) || null;
}

export function upsertCheckIn(checkIn) {
  const history = getHistory();
  const idx = history.findIndex((e) => e.date === checkIn.date);
  if (idx >= 0) {
    history[idx] = { ...history[idx], ...checkIn };
  } else {
    history.push(checkIn);
  }
  history.sort((a, b) => a.date.localeCompare(b.date));
  saveHistory(history);
  return history;
}

export function getLast7Days() {
  const history = getHistory();
  return history.slice(-7);
}
