import { getPulsePressureHint } from "@/lib/calculations";

interface PulsePressureCardProps {
  value: number;
}

export default function PulsePressureCard({ value }: PulsePressureCardProps) {
  const hint = getPulsePressureHint(value);
  
  const isHigh = value > 60;
  const isLow = value < 40;
  
  let statusColor = "text-primary";
  let badgeColor = "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
  
  if (value > 80) {
    statusColor = "text-risk-high animate-pulse";
    badgeColor = "text-red-400 bg-red-400/10 border-red-400/20";
  } else if (value > 60) {
    statusColor = "text-amber-500";
    badgeColor = "text-amber-400 bg-amber-400/10 border-amber-400/20";
  } else if (isLow) {
    statusColor = "text-sky-500";
    badgeColor = "text-sky-400 bg-sky-400/10 border-sky-400/20";
  }

  return (
    <div className="glass-panel rounded-xl p-6 shadow-sm">
      <h3 className="font-label-md text-xs font-semibold text-on-surface-variant mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px]">speed</span>
        Pulse Pressure
      </h3>
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className={`text-[32px] font-extrabold transition-colors duration-300 ${statusColor}`}>
          {value || "0"}
        </span>
        <span className="text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider mr-2">mmHg</span>
        <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}>
          {hint}
        </span>
      </div>
      <p className="mt-2 text-xs text-on-surface-variant leading-relaxed">
        {isHigh
          ? "Elevated pulse pressure (>60 mmHg) can indicate increased arterial stiffness."
          : isLow
          ? "Low pulse pressure (<40 mmHg) can indicate reduced cardiac output."
          : "Your pulse pressure is currently within normal healthy clinical limits (40-60 mmHg)."}
      </p>
    </div>
  );
}

