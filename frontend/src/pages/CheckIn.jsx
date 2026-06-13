import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import SliderField from '../components/SliderField';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchCopingStrategy } from '../api/client';
import { getReflectionPrompt } from '../utils/reflectionPrompt';
import { getTodayDate, upsertCheckIn, getTodayCheckIn } from '../utils/storage';

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

const defaultForm = () => {
  const existing = getTodayCheckIn();
  if (existing) {
    return {
      mood: existing.mood,
      stress: existing.stress,
      energy: existing.energy,
      sleep: existing.sleep,
      studyHours: existing.studyHours,
      challenges: existing.challenges || [],
      reflection: existing.reflection || '',
    };
  }
  return {
    mood: 5,
    stress: 5,
    energy: 5,
    sleep: '6-8h',
    studyHours: '4-6',
    challenges: [],
    reflection: '',
  };
};

export default function CheckIn() {
  const { profile } = useOutletContext();
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleChallenge = (challenge) => {
    setForm((prev) => ({
      ...prev,
      challenges: prev.challenges.includes(challenge)
        ? prev.challenges.filter((c) => c !== challenge)
        : [...prev.challenges, challenge],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const checkIn = {
      date: getTodayDate(),
      ...form,
    };

    try {
      const coping = await fetchCopingStrategy(profile, checkIn);
      upsertCheckIn({ ...checkIn, copingStrategy: coping });
      navigate('/insights');
    } catch {
      setError('Could not generate coping strategy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Generating your coping strategy..." />;
  }

  return (
    <div className="max-w-2xl">
      <h2 className="mb-2 text-xl font-semibold">Daily Check-In</h2>
      <p className="mb-6 text-sm text-ss-muted">Quick reflection to track your wellbeing today.</p>

      <form onSubmit={handleSubmit} className="ss-card space-y-6">
        <SliderField
          label="Mood"
          value={form.mood}
          onChange={(v) => setForm({ ...form, mood: v })}
          lowLabel="😞 1"
          highLabel="10 😄"
        />
        <SliderField
          label="Stress"
          value={form.stress}
          onChange={(v) => setForm({ ...form, stress: v })}
          lowLabel="Low"
          highLabel="High"
        />
        <SliderField
          label="Energy"
          value={form.energy}
          onChange={(v) => setForm({ ...form, energy: v })}
          lowLabel="Exhausted"
          highLabel="Energetic"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="ss-label">Sleep hours</label>
            <select
              className="ss-input"
              value={form.sleep}
              onChange={(e) => setForm({ ...form, sleep: e.target.value })}
            >
              {SLEEP_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="ss-label">Study hours</label>
            <select
              className="ss-input"
              value={form.studyHours}
              onChange={(e) => setForm({ ...form, studyHours: e.target.value })}
            >
              {STUDY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="ss-label">Today&apos;s biggest challenges</label>
          <div className="flex flex-wrap gap-2">
            {CHALLENGES.map((challenge) => (
              <button
                key={challenge}
                type="button"
                onClick={() => toggleChallenge(challenge)}
                className={`ss-chip ${form.challenges.includes(challenge) ? 'ss-chip-active' : ''}`}
              >
                {challenge}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="ss-label">{getReflectionPrompt()}</label>
          <input
            className="ss-input"
            value={form.reflection}
            onChange={(e) => setForm({ ...form, reflection: e.target.value })}
            placeholder="Share briefly..."
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button type="submit" className="ss-btn w-full">
          Submit Check-In
        </button>
      </form>
    </div>
  );
}
