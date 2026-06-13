import { getDaysToExam } from '../utils/storage';

export default function Header({ profile, onReset }) {
  const days = getDaysToExam(profile.targetExamDate);

  return (
    <header className="mb-8 flex items-center justify-between border-b border-ss-border pb-6">
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-widest text-violet-400/80"
          aria-hidden="true"
        >
          StudySync
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-100">
          Hi {profile.name},{' '}
          <span aria-label={`${days} days remaining until ${profile.exam}`}>
            {days} days to {profile.exam}
          </span>{' '}
          <span aria-hidden="true">👋</span>
        </h1>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="ss-btn-ghost text-red-300/80 hover:text-red-300"
        aria-label="Reset profile and clear all data"
      >
        Reset Profile
      </button>
    </header>
  );
}
