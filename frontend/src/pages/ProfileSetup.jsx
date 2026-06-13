import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProfile, saveHistory } from '../utils/storage';
import { generateSeedHistory } from '../utils/seedData';

const EXAMS = ['NEET', 'JEE', 'CUET', 'CAT', 'GATE', 'UPSC', 'Other'];

export default function ProfileSetup({ onSaved }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    age: '',
    exam: 'NEET',
    targetExamDate: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const name = form.name.trim();
    const age = Number(form.age);

    if (!name) {
      setError('Please enter your name.');
      return;
    }
    if (!form.age || isNaN(age) || age < 10 || age > 99) {
      setError('Please enter a valid age (10–99).');
      return;
    }

    // Default exam date to 6 months from now if not provided
    const targetExamDate =
      form.targetExamDate ||
      new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const profile = {
      name,
      age,
      exam: form.exam,
      targetExamDate,
    };

    try {
      saveProfile(profile);
      saveHistory(generateSeedHistory());
      // Call onSaved FIRST so App re-renders with the new profile
      // and authenticated routes become available before navigate() fires
      if (onSaved) onSaved();
      navigate('/check-in');
    } catch (err) {
      setError('Something went wrong saving your profile. Please try again.');
      console.error('ProfileSetup save error:', err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-ss-bg via-[#16174a] to-[#10112a] p-8">
      <div className="ss-card w-full max-w-lg">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            Welcome to
          </p>
          <h1 className="mt-2 text-3xl font-bold">StudySync</h1>
          <p className="mt-2 text-sm text-ss-muted">
            Balance your studies and wellbeing — built for exam aspirants.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label className="ss-label" htmlFor="name">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              id="name"
              className="ss-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="ss-label" htmlFor="age">
              Age <span className="text-red-400">*</span>
            </label>
            <input
              id="age"
              type="number"
              min="10"
              max="99"
              className="ss-input"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              placeholder="18"
            />
          </div>

          <div>
            <label className="ss-label" htmlFor="exam">
              Exam preparing for
            </label>
            <select
              id="exam"
              className="ss-input"
              value={form.exam}
              onChange={(e) => setForm({ ...form, exam: e.target.value })}
            >
              {EXAMS.map((exam) => (
                <option key={exam} value={exam}>
                  {exam}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="ss-label" htmlFor="date">
              Target exam date{' '}
              <span className="normal-case font-normal text-ss-muted">(optional)</span>
            </label>
            <input
              id="date"
              type="date"
              className="ss-input"
              value={form.targetExamDate}
              onChange={(e) => setForm({ ...form, targetExamDate: e.target.value })}
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button type="submit" className="ss-btn w-full">
            Get Started →
          </button>
        </form>
      </div>
    </div>
  );
}
