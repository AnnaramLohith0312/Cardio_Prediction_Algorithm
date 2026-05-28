interface GenderSelectorProps {
  value: 1 | 2;
  onChange: (val: 1 | 2) => void;
}

export default function GenderSelector({ value, onChange }: GenderSelectorProps) {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => onChange(2)}
        type="button"
        className={`flex-1 h-12 flex items-center justify-center gap-2 rounded-lg border-2 active:scale-95 transition-all cursor-pointer ${
          value === 2
            ? "border-secondary bg-secondary-fixed/30 text-on-secondary-fixed-variant font-bold"
            : "border-outline-variant hover:border-secondary text-on-surface-variant"
        }`}
      >
        <span className="material-symbols-outlined">male</span> Male
      </button>
      <button
        onClick={() => onChange(1)}
        type="button"
        className={`flex-1 h-12 flex items-center justify-center gap-2 rounded-lg border-2 active:scale-95 transition-all cursor-pointer ${
          value === 1
            ? "border-secondary bg-secondary-fixed/30 text-on-secondary-fixed-variant font-bold"
            : "border-outline-variant hover:border-secondary text-on-surface-variant"
        }`}
      >
        <span className="material-symbols-outlined">female</span> Female
      </button>
    </div>
  );
}
