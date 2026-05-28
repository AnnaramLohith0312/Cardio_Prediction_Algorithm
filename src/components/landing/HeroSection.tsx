import Link from "next/link";
import HeroMetricCard from "./HeroMetricCard";
import SplineHero from "./SplineHero";

export default function HeroSection() {
  return (
    <section className="relative hero-gradient overflow-hidden pt-12 md:pt-20 pb-20 md:pb-32">
      <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Left Content */}
        <div className="md:col-span-6 flex flex-col items-start gap-8">
          <div className="space-y-4">
            <h1 className="font-display-lg text-[48px] font-extrabold text-slate-text max-w-lg leading-tight tracking-tight">
              Predict Cardiovascular Risk in <span className="text-primary">Seconds</span>
            </h1>
            <p className="font-body-lg text-lg text-on-surface-variant max-w-md leading-relaxed">
              Advanced AI screening that analyzes your vitals and lifestyle habits to provide medical-grade heart health intelligence instantly.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/assessment">
              <button className="bg-secondary text-on-secondary px-8 py-4 rounded-lg font-label-md text-sm font-semibold hover:shadow-lg active:scale-95 transition-all cursor-pointer">
                Start Assessment
              </button>
            </Link>
            <Link href="/assessment">
              <button className="bg-surface border border-outline-variant text-primary px-8 py-4 rounded-lg font-label-md text-sm font-semibold hover:bg-surface-container-low transition-all cursor-pointer">
                View Demo
              </button>
            </Link>
          </div>
          {/* Trust Row */}
          <div className="pt-8 flex flex-col gap-4 w-full">
            <p className="font-label-sm text-xs text-outline uppercase tracking-wider font-semibold">
              Trusted by healthcare professionals
            </p>
            <div className="flex items-center gap-8 opacity-60">
              <span className="text-xl text-on-surface font-black tracking-tighter">MEDCORE</span>
              <span className="text-xl text-on-surface font-black tracking-tighter">VITALIS</span>
              <span className="text-xl text-on-surface font-black tracking-tighter">BIOSTATS</span>
            </div>
          </div>
        </div>
        {/* Right Visuals */}
        <div className="md:col-span-6 relative flex justify-center items-center">
          <div className="relative w-full max-w-[450px] aspect-square flex items-center justify-center">
            {/* AI Heart 3D zone */}
            <SplineHero />
            {/* Floating Cards positioned over Spline zone */}
            <HeroMetricCard label="BMI" value="24.5" className="-top-4 -left-8 z-10" delay="0.2s" />
            <HeroMetricCard label="Risk Profile" value="LOW" isBadge className="top-1/4 -right-12 z-10" delay="0.8s" />
            <HeroMetricCard label="BP Level" value="120/80" className="bottom-8 -left-12 z-10" delay="1.5s" />
            <HeroMetricCard label="Pulse Pressure" value="40 mmHg" className="-bottom-4 right-0 text-secondary z-10" delay="0.5s" />
          </div>
        </div>
      </div>
    </section>
  );
}

