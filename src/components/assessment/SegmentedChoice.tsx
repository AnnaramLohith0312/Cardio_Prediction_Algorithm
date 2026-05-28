interface Option {
  label: string;
  value: 1 | 2 | 3;
}

interface SegmentedChoiceProps {
  icon: string;
  value: 1 | 2 | 3;
  onChange: (val: 1 | 2 | 3) => void;
  options: Option[];
}

export default function SegmentedChoice({
  icon,
  value,
  onChange,
  options,
}: SegmentedChoiceProps) {
  return (
    <div className="flex bg-surface-container p-1 rounded-full relative overflow-hidden w-full">
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2 text-xs font-semibold rounded-full z-10 transition-all cursor-pointer ${
              isSelected
                ? "bg-white text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
