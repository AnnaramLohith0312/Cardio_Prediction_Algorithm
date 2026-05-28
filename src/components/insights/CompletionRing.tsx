interface CompletionRingProps {
  percentage: number;
}

export default function CompletionRing({ percentage }: CompletionRingProps) {
  return (
    <div className="glass-panel rounded-xl p-6 shadow-sm overflow-hidden relative">
      <div
        className="absolute top-0 left-0 h-1 bg-primary transition-all duration-500"
        style={{ width: `${percentage}%` }}
      ></div>
      <div className="flex justify-between items-center mb-2">
        <span className="font-label-md text-xs font-semibold text-on-surface">Form Completion</span>
        <span className="font-label-md text-sm font-bold text-primary">{percentage}%</span>
      </div>
      <p className="text-xs text-on-surface-variant leading-relaxed">
        {percentage === 100
          ? "All details complete! Click calculate to generate your risk profile."
          : "Fill in all metrics. Your heart health insights compile as you type."}
      </p>
    </div>
  );
}
