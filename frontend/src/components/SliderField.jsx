export default function SliderField({ label, min = 1, max = 10, value, onChange, lowLabel, highLabel }) {
  const id = `slider-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className="ss-label mb-0">
          {label}
        </label>
        <span
          aria-live="polite"
          aria-atomic="true"
          className="text-sm font-semibold text-violet-300"
        >
          {value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        step={1}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={`${label}: ${value} out of ${max}`}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className="w-full accent-violet-400"
      />
      <div className="mt-1 flex justify-between text-xs text-ss-muted" aria-hidden="true">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
