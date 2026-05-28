interface RiskGaugeProps {
  percentage: number;
}

export default function RiskGauge({ percentage }: RiskGaugeProps) {
  // SVG stroke-dasharray parameters
  // Circumference of a circle with r=15.9155 is ~100.
  // So stroke-dasharray="${percentage}, 100" shows the exact percentage.
  return (
    <div className="relative w-64 h-64 flex items-center justify-center my-4">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <path
          className="stroke-surface-container-high"
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          strokeWidth="3"
        ></path>
        <path
          className="stroke-primary animate-gauge"
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          strokeDasharray={`${percentage}, 100`}
          strokeLinecap="round"
          strokeWidth="3"
        ></path>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display-lg text-[48px] font-extrabold text-primary leading-none">{percentage}%</span>
        <span className="font-label-md text-xs font-semibold text-on-surface-variant uppercase tracking-widest mt-2">
          Cumulative Risk
        </span>
      </div>
    </div>
  );
}
