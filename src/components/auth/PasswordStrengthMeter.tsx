"use client";

interface PasswordStrengthMeterProps {
  strength: 0 | 1 | 2 | 3; // 0=None, 1=Weak, 2=Fair, 3=Strong
}

export default function PasswordStrengthMeter({ strength }: PasswordStrengthMeterProps) {
  const segments = [
    { color: "bg-red-400", active: strength >= 1 },
    { color: "bg-amber-400", active: strength >= 2 },
    { color: "bg-primary", active: strength >= 3 },
  ];

  const labels = ["Very Weak", "Weak", "Fair", "Strong"];

  return (
    <div className="space-y-2 mt-2">
      <div className="flex gap-2">
        {segments.map((seg, idx) => (
          <div
            key={idx}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              seg.active ? seg.color : "bg-outline-variant/30"
            }`}
          />
        ))}
      </div>
      {strength > 0 && (
        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant text-right">
          Strength: {labels[strength]}
        </p>
      )}
    </div>
  );
}
