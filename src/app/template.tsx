"use client";

import React from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-[pageTransition_0.3s_ease-out]">
      {children}
    </div>
  );
}
