interface StatusBadgeProps {
  type: "low" | "high" | "moderate";
  label: string;
}

export default function StatusBadge({ type, label }: StatusBadgeProps) {
  const styles = {
    low: "bg-risk-low/10 text-risk-low border-risk-low/20",
    high: "bg-risk-high/10 text-risk-high border-risk-high/20",
    moderate: "bg-amber-400/10 text-amber-500 border-amber-400/20",
  };

  return (
    <span className={`px-4 py-1.5 rounded-full font-label-md text-label-md border ${styles[type]} uppercase tracking-wider`}>
      {label}
    </span>
  );
}
