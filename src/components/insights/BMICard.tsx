import { getBMICategory } from "@/lib/calculations";

interface BMICardProps {
  bmi: number;
}

export default function BMICard({ bmi }: BMICardProps) {
  const category = getBMICategory(bmi);

  const colorMap: Record<string, string> = {
    Underweight: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    Normal: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    Overweight: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    Obese: "text-red-400 bg-red-400/10 border-red-400/20",
  };

  const badgeColor = colorMap[category] || "text-on-surface-variant bg-surface-container border-outline";

  return (
    <div className="glass-panel rounded-xl p-6 shadow-sm">
      <h3 className="font-label-md text-xs font-semibold text-on-surface-variant mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px]">fitness_center</span>
        Calculated BMI
      </h3>
      <div className="flex items-baseline gap-3">
        <span className="text-[32px] font-extrabold text-primary">{bmi || "0.0"}</span>
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}>
          {category}
        </span>
      </div>
      <div className="mt-4 w-full h-1 bg-surface-container rounded-full flex overflow-hidden">
        {/* Underweight */}
        <div className="h-full bg-sky-400" style={{ width: "30%" }}></div>
        {/* Healthy */}
        <div className="h-full bg-emerald-500" style={{ width: "40%" }}></div>
        {/* Overweight */}
        <div className="h-full bg-amber-400" style={{ width: "15%" }}></div>
        {/* Obese */}
        <div className="h-full bg-red-400" style={{ width: "15%" }}></div>
      </div>
    </div>
  );
}
