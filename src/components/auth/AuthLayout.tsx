import React from "react";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col font-body-md text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed relative overflow-hidden bg-[radial-gradient(circle_at_top_right,_#f1f4f3_0%,_#f7faf8_100%)]">
      {/* Top AppBar */}
      <header className="w-full flex justify-between items-center px-gutter h-16 max-w-container-max mx-auto absolute top-0 left-0 right-0 z-10">
        <Link href="/" className="font-headline-md text-headline-md font-extrabold text-primary tracking-tight">
          Cardio Risk Predictor
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-20 relative overflow-hidden">
        {/* Atmospheric background elements */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full py-stack-lg px-gutter max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-stack-md border-t border-outline-variant/50">
        <div className="flex flex-col items-center md:items-start">
          <div className="font-headline-md text-headline-md font-bold text-on-surface mb-2">Cardio Risk Predictor</div>
          <p className="font-label-sm text-label-sm text-on-surface-variant">© 2024 Cardio Risk Predictor. AI-driven intelligence for heart health.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Scientific Methodology</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Contact</a>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-risk-low rounded-full animate-pulse"></div>
          <span className="font-label-sm text-label-sm text-outline font-mono">MODEL v2.4.1-STABLE</span>
        </div>
      </footer>
    </div>
  );
}
