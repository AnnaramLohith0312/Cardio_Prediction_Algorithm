"use client";

import React, { useState } from "react";

type ErrorBannerProps = {
  message: string;
  onDismiss?: () => void;
};

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-[slideUp_0.3s_ease-out]">
      <div className="bg-risk-high text-white p-4 rounded-xl shadow-lg flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <div className="flex flex-col">
            <span className="font-bold">Error Occurred</span>
            <span className="text-sm opacity-90">{message}</span>
          </div>
        </div>
        <button 
          onClick={handleDismiss}
          className="p-1 rounded-md hover:bg-white/20 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white shrink-0"
          aria-label="Dismiss Error"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
}
