import { useOutletContext } from 'react-router-dom';
import { getTodayCheckIn } from '../utils/storage';

const TYPE_LABELS = {
  breathing: 'Breathing Exercise',
  movement: 'Movement Break',
  reframe: 'Mind Reframe',
  break: 'Rest Break',
  motivation: 'Motivation Boost',
};

export default function Insights() {
  const { profile } = useOutletContext();
  const today = getTodayCheckIn();

  if (!today?.copingStrategy) {
    return (
      <div className="ss-card max-w-xl text-center">
        <p className="text-4xl">✨</p>
        <h2 className="mt-4 text-xl font-semibold">No insights yet</h2>
        <p className="mt-2 text-sm text-ss-muted">
          Complete today&apos;s check-in to see your personalized coping strategy.
        </p>
      </div>
    );
  }

  const { strategy, type } = today.copingStrategy;

  return (
    <div className="max-w-2xl">
      <h2 className="mb-2 text-xl font-semibold">Today&apos;s Insights</h2>
      <p className="mb-6 text-sm text-ss-muted">
        A quick exercise tailored for you, {profile.name}.
      </p>

      <div className="ss-card space-y-4">
        <span className="inline-block rounded-full bg-teal-400/10 px-3 py-1 text-xs font-semibold text-teal-300">
          {TYPE_LABELS[type] || type}
        </span>
        <p className="text-lg leading-relaxed text-slate-200">{strategy}</p>

        <div className="border-t border-ss-border pt-4">
          <p className="text-xs text-ss-muted">Based on today&apos;s check-in</p>
          <div className="mt-2 flex gap-4 text-sm">
            <span>Mood: {today.mood}/10</span>
            <span>Stress: {today.stress}/10</span>
            <span>Energy: {today.energy}/10</span>
          </div>
        </div>
      </div>
    </div>
  );
}
