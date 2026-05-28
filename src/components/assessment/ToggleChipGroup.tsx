interface ToggleChipGroupProps {
  label: string;
  value: 0 | 1;
  onChange: (val: 0 | 1) => void;
  options: { label: string; value: 0 | 1 }[];
}

export default function ToggleChipGroup({
  label,
  value,
  onChange,
  options,
}: ToggleChipGroupProps) {
  return (
    <div className="flex flex-col gap-4">
      <label className="font-label-md text-label-md text-on-surface-variant font-semibold">{label}</label>
      <div className="flex gap-2">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer border active:scale-95 transition-all ${
                isSelected
                  ? "border-2 border-secondary bg-secondary-fixed/30 text-on-secondary-fixed-variant"
                  : "border-outline-variant text-on-surface-variant hover:border-primary"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
