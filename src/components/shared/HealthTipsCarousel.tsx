"use client";

import { useState } from "react";
import { HealthTip } from "@/types/cardio";

const TIPS: HealthTip[] = [
  {
    title: "Monitor Blood Pressure Regularly",
    description: "Keeping track of your blood pressure helps identify trends early and allows you to make informed decisions about your health.",
    category: "Prevention",
  },
  {
    title: "Prioritize Active Living",
    description: "Aim for at least 150 minutes of moderate-intensity aerobic physical activity per week to keep your heart muscle strong.",
    category: "Exercise",
  },
  {
    title: "Healthy Fats & Fiber",
    description: "Focus on oats, vegetables, and foods rich in omega-3 fatty acids like olive oil and nuts to manage cholesterol levels naturally.",
    category: "Nutrition",
  },
];

export default function HealthTipsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTip = () => {
    setActiveIndex((prev) => (prev + 1) % TIPS.length);
  };

  const prevTip = () => {
    setActiveIndex((prev) => (prev - 1 + TIPS.length) % TIPS.length);
  };

  const activeTip = TIPS[activeIndex];

  return (
    <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 flex flex-col justify-between h-48 relative overflow-hidden group">
      <div>
        <span className="text-[10px] uppercase font-bold text-primary tracking-widest">{activeTip.category}</span>
        <h4 className="font-headline-sm text-lg text-slate-text mt-1 mb-2 font-semibold">{activeTip.title}</h4>
        <p className="font-body-sm text-sm text-on-surface-variant line-clamp-3">{activeTip.description}</p>
      </div>
      <div className="flex justify-between items-center mt-4 z-10">
        <span className="text-xs text-on-surface-variant font-label-sm">
          {activeIndex + 1} of {TIPS.length}
        </span>
        <div className="flex gap-2">
          <button
            onClick={prevTip}
            className="p-1 rounded-full border border-outline-variant/40 hover:bg-white hover:text-primary transition-colors text-on-surface-variant"
            aria-label="Previous Tip"
          >
            <span className="material-symbols-outlined text-sm leading-none flex items-center justify-center w-5 h-5">
              chevron_left
            </span>
          </button>
          <button
            onClick={nextTip}
            className="p-1 rounded-full border border-outline-variant/40 hover:bg-white hover:text-primary transition-colors text-on-surface-variant"
            aria-label="Next Tip"
          >
            <span className="material-symbols-outlined text-sm leading-none flex items-center justify-center w-5 h-5">
              chevron_right
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
