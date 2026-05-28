import BMICard from "./BMICard";
import PulsePressureCard from "./PulsePressureCard";
import CompletionRing from "./CompletionRing";

interface LiveInsightsPanelProps {
  bmi: number;
  pulsePressure: number;
  completionPercentage: number;
}

export default function LiveInsightsPanel({
  bmi,
  pulsePressure,
  completionPercentage,
}: LiveInsightsPanelProps) {
  return (
    <aside className="hidden md:block w-full md:w-1/3 lg:w-1/4">
      <div className="sticky top-24 flex flex-col gap-6">
        <CompletionRing percentage={completionPercentage} />
        <BMICard bmi={bmi} />
        <PulsePressureCard value={pulsePressure} />
        {/* Model info card */}
        <div className="p-6 border border-outline-variant/20 rounded-xl bg-surface-container-low">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-risk-low animate-pulse"></div>
            <span className="text-[10px] font-bold text-on-surface-variant font-mono uppercase tracking-wider">
              Model v2.4.1 Stable
            </span>
          </div>
          <p className="text-[10px] text-on-surface-variant/70 leading-relaxed">
            Vitalis Intelligence AI Cluster &middot; Scientific Reference Ref: 2024.1
          </p>
        </div>
      </div>
    </aside>
  );
}
