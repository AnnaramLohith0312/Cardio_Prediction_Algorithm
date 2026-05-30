"use client";

import React from "react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--bg-color)]/80 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
      <div className="flex flex-col items-center">
        <svg 
          className="w-32 h-32 text-[var(--accent-red)] animate-[pulse_1.5s_infinite]" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M3 12h4l2-3 4 6 2-3h6" className="animate-[dash_2s_linear_infinite]" strokeDasharray="100" strokeDashoffset="100" />
        </svg>
        <p className="mt-4 text-lg font-bold text-[var(--text-muted)] animate-pulse">
          Analyzing cardiovascular risk...
        </p>
      </div>
    </div>
  );
}
