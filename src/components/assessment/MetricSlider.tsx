interface MetricSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  unit: string;
}

export default function MetricSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  unit,
}: MetricSliderProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <label className="font-label-md text-label-md text-on-surface-variant font-semibold">{label}</label>
        <span className="text-primary font-bold text-headline-md">
          {value} <span className="text-sm text-on-surface-variant font-normal">{unit}</span>
        </span>
      </div>
      <input
        className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer custom-slider accent-primary"
        max={max}
        min={min}
        step={step}
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
