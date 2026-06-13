function getAnalyzeFallback() {
  return {
    burnoutRadar: {
      level: 'Moderate',
      summary:
        'Your recent check-ins show elevated stress on high-study, low-sleep days. Take short breaks and protect sleep tonight.',
    },
    stressTriggers: [
      {
        trigger: 'Long study sessions',
        pattern: 'Stress rises when study hours exceed 6 and sleep drops below 6 hours.',
        evidence: 'Multiple days with 8+ study hours paired with under 6h sleep showed stress 7+.',
      },
      {
        trigger: 'Mock test pressure',
        pattern: 'Mock Test appears frequently on your highest-stress days.',
        evidence: 'Stress peaked on days when Mock Test was selected as a challenge.',
      },
    ],
    weeklyInsight:
      'Your stress tends to increase when you sleep less than 6 hours and study more than 8 hours. Protecting even one extra hour of sleep may help steady your mood before the exam.',
  };
}

function getCopingFallback() {
  return {
    strategy:
      'Take 3 minutes for box breathing: inhale 4 counts, hold 4, exhale 4, hold 4. Repeat 5 times, then write one small win from today.',
    type: 'breathing',
  };
}

function getChatFallback() {
  return {
    message:
      "I hear you. Exam prep is intense, and it's okay to feel overwhelmed sometimes. What's one thing that felt manageable today, even if it was small?",
    isCrisis: false,
  };
}

function getCrisisResponse() {
  return {
    message:
      "I'm really glad you reached out. What you're feeling matters, and you don't have to face this alone. Please contact a crisis helpline right now — trained counselors are available 24/7:\n\n• iCall: 9152987821\n• Vandrevala Foundation: 1860-2662-345\n\nAlso consider telling someone you trust — a friend, family member, or teacher. You deserve support.",
    isCrisis: true,
    helplines: [
      { name: 'iCall', number: '9152987821' },
      { name: 'Vandrevala Foundation', number: '1860-2662-345' },
    ],
  };
}

module.exports = {
  getAnalyzeFallback,
  getCopingFallback,
  getChatFallback,
  getCrisisResponse,
};
