function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export function generateSeedHistory() {
  return [
    {
      date: daysAgo(6),
      mood: 7,
      stress: 4,
      energy: 7,
      sleep: '8h+',
      studyHours: '4-6',
      challenges: ['Time Management'],
      reflection: 'Good start to the week, felt focused.',
    },
    {
      date: daysAgo(5),
      mood: 6,
      stress: 5,
      energy: 6,
      sleep: '6-8h',
      studyHours: '6-8',
      challenges: ['Mock Test'],
      reflection: 'Mock test was okay but drained me.',
    },
    {
      date: daysAgo(4),
      mood: 5,
      stress: 6,
      energy: 5,
      sleep: '6-8h',
      studyHours: '6-8',
      challenges: ['Mock Test', 'Fear of Failure'],
      reflection: 'Compared my score with friends and felt behind.',
    },
    {
      date: daysAgo(3),
      mood: 4,
      stress: 8,
      energy: 3,
      sleep: '4-6h',
      studyHours: '8+',
      challenges: ['Poor Sleep', 'Mock Test', 'Family Pressure'],
      reflection: 'Pulled an all-nighter for revision. Exhausted.',
    },
    {
      date: daysAgo(2),
      mood: 4,
      stress: 7,
      energy: 4,
      sleep: '<4h',
      studyHours: '8+',
      challenges: ['Poor Sleep', 'Lack of Motivation'],
      reflection: 'Could not focus at all today.',
    },
    {
      date: daysAgo(1),
      mood: 5,
      stress: 6,
      energy: 5,
      sleep: '6-8h',
      studyHours: '4-6',
      challenges: ['Distractions'],
      reflection: 'Slept a bit more, felt slightly better.',
    },
  ];
}
