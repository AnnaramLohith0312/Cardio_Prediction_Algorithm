"use client";

import React, { Suspense } from "react";
import Spline from "@splinetool/react-spline";

// Once a Spline URL is ready, place it here (e.g. "https://prod.spline.design/.../scene.splinecode")
const SPLINE_URL = ""; 

export default function SplineHero() {
  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden pointer-events-none md:pointer-events-auto">
      <Suspense fallback={<SplineSkeleton />}>
        {SPLINE_URL ? (
          <Spline scene={SPLINE_URL} className="w-full h-full object-cover" />
        ) : (
          <SplinePlaceholder />
        )}
      </Suspense>
    </div>
  );
}

function SplineSkeleton() {
  return (
    <div className="w-full h-full bg-surface-container-low/40 animate-pulse flex items-center justify-center rounded-2xl">
      <span className="material-symbols-outlined text-primary/30 text-5xl animate-spin">
        progress_activity
      </span>
    </div>
  );
}

function SplinePlaceholder() {
  return (
    <div className="w-full h-full bg-primary-container/10 border-2 border-dashed border-primary/25 rounded-2xl flex flex-col items-center justify-center p-8 text-center">
      <span className="material-symbols-outlined text-primary text-6xl animate-pulse mb-4">
        favorite
      </span>
      <p className="font-label-md text-primary font-bold text-sm">3D Spline Scene</p>
      <p className="text-xs text-on-surface-variant mt-1.5 max-w-[200px] leading-relaxed">
        Replace with scene.splinecode URL
      </p>
    </div>
  );
}
