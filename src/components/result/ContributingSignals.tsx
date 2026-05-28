interface Signal {
  label: string;
  impact: number;
  value: string;
}

interface ContributingSignalsProps {
  signals: Signal[];
}

export default function ContributingSignals({ signals }: ContributingSignalsProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
      <h3 className="font-label-md text-xs font-bold text-primary mb-4 uppercase tracking-widest">Key Risk Drivers</h3>
      <div className="space-y-4">
        {signals.map((sig) => (
          <div key={sig.label} className="flex flex-col gap-2">
            <div className="flex justify-between font-label-md text-xs font-semibold">
              <span className="text-on-surface">
                {sig.label} <span className="text-on-surface-variant font-normal">({sig.value})</span>
              </span>
              <span className="text-primary">{sig.impact}% Impact</span>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-1000"
                style={{ width: `${sig.impact}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
