export async function fetchAnalyze(profile, history) {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, history }),
  });
  if (!res.ok) throw new Error('Analysis failed');
  return res.json();
}

export async function fetchCopingStrategy(profile, checkIn) {
  const res = await fetch('/api/coping-strategy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, checkIn }),
  });
  if (!res.ok) throw new Error('Coping strategy failed');
  return res.json();
}

export async function fetchChat(profile, message, checkIn, recentHistory) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, message, checkIn, recentHistory }),
  });
  if (!res.ok) throw new Error('Chat failed');
  return res.json();
}
