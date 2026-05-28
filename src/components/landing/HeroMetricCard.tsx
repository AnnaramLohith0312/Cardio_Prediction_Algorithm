interface HeroMetricCardProps {
  label: string;
  value: string;
  className?: string;
  delay?: string;
  isBadge?: boolean;
}

export default function HeroMetricCard({ label, value, className = "", delay = "0s", isBadge = false }: HeroMetricCardProps) {
  return (
    <div
      className={`absolute glass-panel p-4 rounded-xl shadow-xl float-animation z-10 ${className}`}
      style={{ animationDelay: delay }}
    >
      <p className="text-[11px] text-outline font-semibold mb-1 uppercase tracking-wider">{label}</p>
      {isBadge ? (
        <span className="bg-risk-low/20 text-risk-low px-2 py-0.5 rounded text-[10px] font-bold uppercase">
          {value}
        </span>
      ) : (
        <p className="text-lg font-extrabold text-primary">{value}</p>
      )}
    </div>
  );
}
