interface AdviceCardProps {
  advice: string;
}

export default function AdviceCard({ advice }: AdviceCardProps) {
  return (
    <div className="bg-surface-container-low rounded-lg p-6 w-full text-left border border-outline-variant/10">
      <h3 className="font-headline-md text-lg font-bold mb-2 flex items-center gap-2 text-slate-text">
        <span className="material-symbols-outlined text-primary">auto_awesome</span>
        Health Insight
      </h3>
      <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
        {advice}
      </p>
    </div>
  );
}
