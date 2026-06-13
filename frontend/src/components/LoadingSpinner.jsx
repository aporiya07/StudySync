export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className="flex flex-col items-center justify-center gap-3 py-12"
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-violet-400/30 border-t-violet-400"
        aria-hidden="true"
      />
      <p className="text-sm text-ss-muted" aria-hidden="true">
        {label}
      </p>
    </div>
  );
}
