import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchAnalyze } from '../api/client';
import { getLast7Days } from '../utils/storage';

const LEVEL_STYLES = {
  Low: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30',
  Moderate: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
  High: 'bg-red-400/15 text-red-300 border-red-400/30',
};

export default function Dashboard() {
  const { profile } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const history = getLast7Days();

    if (history.length < 2) {
      if (isMounted) setLoading(false);
      return;
    }

    fetchAnalyze(profile, history)
      .then((res) => {
        if (isMounted) setData(res);
      })
      .catch(() => {
        if (isMounted) setError('Could not load weekly analysis. Showing cached insights if available.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [profile]);

  if (loading) {
    return <LoadingSpinner label="Analyzing your weekly patterns..." />;
  }

  const history = getLast7Days();
  if (history.length < 2) {
    return (
      <div className="ss-card max-w-xl text-center">
        <p className="text-4xl">📊</p>
        <h2 className="mt-4 text-xl font-semibold">Not enough data yet</h2>
        <p className="mt-2 text-sm text-ss-muted">
          Complete a few more daily check-ins to unlock weekly pattern analysis.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="ss-card max-w-xl text-center">
        <p className="text-sm text-red-300">{error || 'Analysis unavailable.'}</p>
      </div>
    );
  }

  const levelClass = LEVEL_STYLES[data.burnoutRadar.level] || LEVEL_STYLES.Moderate;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Weekly Dashboard</h2>
        <p className="text-sm text-ss-muted">Burnout radar, stress triggers, and pattern insights.</p>
      </div>

      {error && <p className="text-sm text-amber-300">{error}</p>}

      <div className="ss-card">
        <div className="mb-3 flex items-center gap-3">
          <h3 className="font-semibold">Burnout Radar</h3>
          <span className={`rounded-full border px-3 py-0.5 text-xs font-bold ${levelClass}`}>
            {data.burnoutRadar.level}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">{data.burnoutRadar.summary}</p>
      </div>

      <div className="ss-card">
        <h3 className="mb-4 font-semibold">Hidden Stress Triggers</h3>
        <div className="space-y-4">
          {data.stressTriggers.map((item, i) => (
            <div key={i} className="rounded-xl border border-ss-border bg-white/3 p-4">
              <p className="font-medium text-teal-300">{item.trigger}</p>
              <p className="mt-1 text-sm text-slate-300">{item.pattern}</p>
              <p className="mt-2 text-xs text-ss-muted">{item.evidence}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="ss-card">
        <h3 className="mb-3 font-semibold">Weekly Insight</h3>
        <p className="text-sm leading-relaxed text-slate-300">{data.weeklyInsight}</p>
      </div>
    </div>
  );
}
