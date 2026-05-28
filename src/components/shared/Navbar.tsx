"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Assessment", href: "/assessment" },
    { label: "Insights", href: "/result" }, // Or result page
    { label: "History", href: "/dashboard" },
  ];

  return (
    <header className="bg-surface-glass backdrop-blur-xl border-b border-outline-variant/30 shadow-sm sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-gutter max-w-container-max mx-auto h-16">
        <Link href="/" className="font-headline-md text-headline-md font-bold text-primary hover:opacity-95 transition-opacity">
          Cardio Risk Predictor
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-label-md text-label-md transition-colors ${
                  isActive
                    ? "text-primary font-bold border-b-2 border-primary pb-1"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/signin">
            <button className="material-symbols-outlined text-primary hover:bg-surface-container-low/50 p-2 rounded-lg transition-all" aria-label="Account">
              account_circle
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
