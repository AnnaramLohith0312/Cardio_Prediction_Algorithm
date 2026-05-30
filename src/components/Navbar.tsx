"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // Check current theme on mount
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Predict", href: "/predict" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[var(--surface-color)]/80 backdrop-blur-md border-b border-[var(--border-color)] z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--interactive-teal)] rounded min-w-[44px] min-h-[44px] hover:opacity-80 transition-opacity">
          <svg className="w-8 h-8 text-[var(--interactive-teal)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            <path d="M3 12h4l2-3 4 6 2-3h6" className="text-white" strokeWidth="1.5" />
          </svg>
          <span className="font-[var(--font-display)] font-bold text-lg text-[var(--text-color)] tracking-wide">
            CardioSense AI
          </span>
        </Link>

        {/* Center: Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`relative py-2 text-sm font-semibold transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--interactive-teal)] rounded ${isActive ? "text-[var(--interactive-teal)]" : "text-[var(--text-muted)] hover:text-[var(--text-color)]"}`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-1 left-0 right-0 h-0.5 bg-[var(--interactive-teal)] rounded-full animate-[fadeIn_0.2s_ease-out]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full text-[var(--text-muted)] hover:bg-[var(--border-color)] transition-all min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--interactive-teal)] active:scale-95"
            aria-label="Toggle Dark/Light Mode"
          >
            {theme === "dark" ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
          
          <Link 
            href="/predict"
            className="px-5 py-2 bg-[var(--interactive-teal)] hover:bg-[var(--interactive-hover)] text-white rounded-[var(--radius-full)] font-bold shadow-[var(--shadow-sm)] transition-transform active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--interactive-teal)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-color)]"
          >
            Predict Now
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[var(--text-color)] min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--interactive-teal)] rounded active:scale-95"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[var(--surface-color)] border-b border-[var(--border-color)] shadow-[var(--shadow-md)] animate-[slideDown_0.2s_ease-out]">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-3 rounded-md text-base font-semibold min-h-[44px] ${pathname === link.href ? "bg-[var(--interactive-teal)]/10 text-[var(--interactive-teal)]" : "text-[var(--text-muted)] hover:bg-[var(--border-color)] hover:text-[var(--text-color)]"}`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-[var(--border-color)] flex justify-between items-center px-3">
              <span className="text-[var(--text-muted)] font-semibold">Theme</span>
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-[var(--border-color)] text-[var(--text-color)] min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95"
              >
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
            <div className="pt-4 px-3">
              <Link 
                href="/predict"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 bg-[var(--interactive-teal)] text-white rounded-[var(--radius-md)] font-bold text-center block active:scale-95 min-h-[44px]"
              >
                Predict Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
