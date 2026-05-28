import RiskGauge from "./RiskGauge";
import AdviceCard from "./AdviceCard";

interface ResultCardProps {
  percentage: number;
  label: string;
  advice: string;
  modelName?: string;
}

export default function ResultCard({ percentage, label, advice, modelName }: ResultCardProps) {
  const isHigh = percentage >= 50;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-8 shadow-sm flex flex-col items-center text-center w-full">
      <div className="flex justify-between w-full mb-6 items-start">
        <div className="text-left">
          <h1 className="font-headline-lg text-2xl font-bold text-slate-text">Risk Prediction</h1>
          <p className="font-body-md text-sm text-on-surface-variant">Based on your recent diagnostic data</p>
          {modelName && (
            <p className="text-[10px] text-teal-600 bg-teal-50 border border-teal-200 rounded px-1.5 py-0.5 mt-1.5 font-mono inline-block">
              Model: {modelName}
            </p>
          )}
        </div>
        <span
          className={`px-4 py-1.5 rounded-full font-label-md text-xs font-bold border uppercase tracking-wider ${
            isHigh
              ? "bg-risk-high/10 text-risk-high border-risk-high/20"
              : "bg-risk-low/10 text-risk-low border-risk-low/20"
          }`}
        >
          {label}
        </span>
      </div>
      
      <RiskGauge percentage={percentage} />
      
      <AdviceCard advice={advice} />
    </div>
  );
}
