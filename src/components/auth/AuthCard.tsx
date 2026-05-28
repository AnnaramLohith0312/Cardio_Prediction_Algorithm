import React from "react";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export default function AuthCard({ children, title, description }: AuthCardProps) {
  return (
    <div className="w-full max-w-md auth-transition">
      <div className="glass-card border border-outline-variant/30 shadow-xl rounded-xl p-8 md:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">favorite</span>
          </div>
          <h1 className="font-headline-lg text-2xl font-bold text-slate-text mb-2">{title}</h1>
          <p className="font-body-md text-sm text-on-surface-variant max-w-[280px] mx-auto">
            {description}
          </p>
        </div>
        {children}
        {/* Verification Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-outline">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified_user
          </span>
          <span className="font-label-sm text-[11px] font-medium">Medical-grade data encryption (HIPAA Compliant)</span>
        </div>
      </div>
    </div>
  );
}
