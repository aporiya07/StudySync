import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProfile, saveHistory } from '../utils/storage';
import { generateSeedHistory } from '../utils/seedData';

const EXAMS = ['NEET', 'JEE', 'CUET', 'CAT', 'GATE', 'UPSC', 'Other'];

export default function ProfileSetup() {
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
    if (!form.name.trim() || !form.age || !form.targetExamDate) {
      setError('Please fill in all fields.');
      return;
    }

    const profile = {
      name: form.name.trim(),
      age: Number(form.age),
      exam: form.exam,
      targetExamDate: form.targetExamDate,
    };

    saveProfile(profile);
    saveHistory(generateSeedHistory());
    navigate('/check-in');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-ss-bg via-[#0f172a] to-[#0c1220] p-8">
      <div className="ss-card w-full max-w-lg">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-400">
            Welcome to MindMitra
          </p>
          <h1 className="mt-2 text-3xl font-bold">StudySync</h1>
          <p className="mt-2 text-sm text-ss-muted">
            Balance your studies and wellbeing — built for exam aspirants.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="ss-label" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="ss-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="ss-label" htmlFor="age">
              Age
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
              Target exam date
            </label>
            <input
              id="date"
              type="date"
              className="ss-input"
              value={form.targetExamDate}
              onChange={(e) => setForm({ ...form, targetExamDate: e.target.value })}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button type="submit" className="ss-btn w-full">
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
}
