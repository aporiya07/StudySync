export default function SliderField({ label, min = 1, max = 10, value, onChange, lowLabel, highLabel }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="ss-label mb-0">{label}</label>
        <span className="text-sm font-semibold text-teal-300">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-teal-400"
      />
      <div className="mt-1 flex justify-between text-xs text-ss-muted">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
