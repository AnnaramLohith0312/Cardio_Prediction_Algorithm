"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function SignUpPage() {
  const router = useRouter();
  const { signup } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Set theme
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  };

  const getPasswordStrength = (pass: string): 0 | 1 | 2 | 3 => {
    if (!pass) return 0;
    if (pass.length < 6) return 1;
    if (pass.length < 10) return 2;
    return 3;
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Client-side validations
    if (!name.trim()) {
      setError("Please enter your full name.");
      setLoading(false);
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      await signup(email, name, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Account registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong"];
  const strengthColors = ["bg-slate-700", "bg-red-400", "bg-amber-400", "bg-[#0d9488]"];

  return (
    <div className="min-h-screen flex flex-col font-satoshi bg-[#0a0f1e] overflow-x-hidden select-none">
      
      {/* Font & Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');

        .font-satoshi {
          font-family: 'Satoshi', sans-serif;
        }
        .font-display {
          font-family: 'Instrument Serif', Georgia, serif;
        }

        /* ECG drawing animation */
        @keyframes draw {
          0% {
            stroke-dashoffset: 1000;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        .ecg-anim-path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw 4s linear infinite;
        }

        /* Webkit autofill fix */
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px var(--autofill-bg) inset !important;
          -webkit-text-fill-color: var(--autofill-text) !important;
          border-radius: 10px;
        }

        [data-theme="light"] {
          --autofill-bg: #f8fafc;
          --autofill-text: #0f172a;
        }
        [data-theme="dark"] {
          --autofill-bg: #1e293b;
          --autofill-text: #f1f5f9;
        }
      `}} />

      {/* --- TOP NAVIGATION BAR --- */}
      <header className="h-[60px] bg-[#0a0f1e] border-b border-white/10 z-40 fixed top-0 left-0 right-0 px-4 sm:px-8 flex justify-between items-center transition-colors">
        {/* Left Logo */}
        <Link href="/" className="flex items-center gap-2 min-h-[44px]">
          <svg className="w-7 h-7 text-[#e53e3e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            <path d="M3 12h4l2-3 4 6 2-3h6" className="text-white" strokeWidth="1.5" />
          </svg>
          <span className="font-semibold text-[20px] text-white tracking-wide">
            CardioSense AI
          </span>
        </Link>

        {/* Right Toggle & Sign In redirect */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0d9488] focus-visible:outline-offset-2"
            aria-label="Toggle Dark/Light Mode"
            type="button"
          >
            {theme === "dark" ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
          
          <div className="hidden lg:flex items-center gap-3">
            <span className="text-sm text-slate-400">Already have an account?</span>
            <Link 
              href="/signin" 
              className="px-5 py-2 border border-[#0d9488] text-[#0d9488] hover:bg-[#0d9488]/10 font-bold rounded-full text-xs tracking-wide transition-all min-h-[44px] flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0d9488] focus-visible:outline-offset-2"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* --- MAIN SPLIT-SCREEN LAYOUT --- */}
      <div className="flex-1 flex mt-[60px]">
        
        {/* LEFT PANEL */}
        <section className="hidden lg:flex lg:w-1/2 bg-[#0a0f1e] relative flex-col justify-between p-12 overflow-hidden border-r border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(13,148,136,0.15)_0%,rgba(229,62,62,0.05)_50%,transparent_100%)] pointer-events-none"></div>
          <div></div>

          <div className="w-full relative flex items-center justify-center my-auto min-h-[200px]">
            <svg className="w-full h-40 text-slate-700 overflow-visible" viewBox="0 0 400 100" fill="none">
              <path d="M 0 50 Q 80 50 100 50 L 115 30 L 130 75 L 145 15 L 160 55 L 175 50 Q 200 50 400 50" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" strokeLinecap="round" />
              <path 
                className="ecg-anim-path"
                d="M 0 50 Q 80 50 100 50 L 115 30 L 130 75 L 145 15 L 160 55 L 175 50 Q 200 50 400 50" 
                stroke="#e53e3e" 
                strokeWidth="3" 
                strokeLinecap="round" 
              />
            </svg>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white font-medium text-sm">
                <span className="flex-shrink-0 text-emerald-500 text-base">✅</span>
                <span>73,000+ Patient Records Analyzed</span>
              </div>
              <div className="flex items-center gap-3 text-white font-medium text-sm">
                <span className="flex-shrink-0 text-emerald-500 text-base">✅</span>
                <span>5 ML Models — Random Forest, SVM, KNN, LR, DT</span>
              </div>
              <div className="flex items-center gap-3 text-white font-medium text-sm">
                <span className="flex-shrink-0 text-emerald-500 text-base">✅</span>
                <span>Clinical-grade cardiovascular risk detection</span>
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/5 flex justify-between items-center text-[13px] text-slate-500">
              <span>Trusted by medical professionals for early risk screening.</span>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className={`w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 transition-colors duration-300 ${
          theme === "dark" ? "bg-[#0f172a]" : "bg-white"
        }`}>
          <div className={`w-full max-w-[440px] flex flex-col justify-center transition-all duration-[400ms] ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}>
            
            {/* Header branding (mobile only) */}
            <div className="flex lg:hidden flex-col items-center text-center mb-8">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-6 h-6 text-[#e53e3e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  <path d="M3 12h4l2-3 4 6 2-3h6" stroke="#0d9488" strokeWidth="1.5" />
                </svg>
                <span className={`font-bold text-lg tracking-wide ${theme === "dark" ? "text-white" : "text-[#0f172a]"}`}>
                  CardioSense AI
                </span>
              </div>
              <span className="text-[11px] text-[#0d9488] font-bold tracking-widest uppercase">
                Premium Cardiovascular Screening
              </span>
            </div>

            {/* Title Block */}
            <div className="mb-8">
              <div className="hidden lg:flex items-center gap-2 mb-2 text-[#0d9488] font-bold text-xs uppercase tracking-[0.08em] font-satoshi">
                <svg className="w-4 h-4 text-[#e53e3e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  <path d="M3 12h4l2-3 4 6 2-3h6" stroke="#0d9488" strokeWidth="1.5" />
                </svg>
                CardioSense AI — Premium Cardiovascular Screening
              </div>
              
              <h2 className={`text-4xl font-semibold font-display tracking-tight leading-none mb-2 ${
                theme === "dark" ? "text-slate-100" : "text-[#0f172a]"
              }`}>
                Create Account
              </h2>
              <p className={`text-[15px] font-medium leading-relaxed ${
                theme === "dark" ? "text-slate-400" : "text-[#64748b]"
              }`}>
                Join CardioSense AI to register patient assessments and analyze risk.
              </p>
            </div>

            {/* Error Message banner */}
            {error && (
              <div className="mb-6 p-4 rounded-[10px] bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold flex items-start gap-2.5 shadow-sm">
                <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* SignUp Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Full Name */}
              <div className="space-y-2">
                <label 
                  htmlFor="name-input" 
                  className={`text-sm font-semibold block ${theme === "dark" ? "text-slate-300" : "text-[#374151]"}`}
                >
                  Full name
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0d9488] transition-colors pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    id="name-input"
                    type="text"
                    required
                    placeholder="Alex Chen"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError(null);
                    }}
                    className={`w-full pl-12 pr-4 h-12 rounded-[10px] outline-none text-sm font-medium transition-all ${
                      theme === "dark"
                        ? "bg-[#1e293b] border-[#334155] text-slate-100 placeholder-[#475569] focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/15"
                        : "bg-[#f8fafc] border-[#e2e8f0] text-[#0f172a] placeholder-[#cbd5e1] focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/15"
                    } border-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0d9488] focus-visible:outline-offset-2`}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label 
                  htmlFor="email-input" 
                  className={`text-sm font-semibold block ${theme === "dark" ? "text-slate-300" : "text-[#374151]"}`}
                >
                  Email address
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0d9488] transition-colors pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    id="email-input"
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    className={`w-full pl-12 pr-4 h-12 rounded-[10px] outline-none text-sm font-medium transition-all ${
                      theme === "dark"
                        ? "bg-[#1e293b] border-[#334155] text-slate-100 placeholder-[#475569] focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/15"
                        : "bg-[#f8fafc] border-[#e2e8f0] text-[#0f172a] placeholder-[#cbd5e1] focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/15"
                    } border-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0d9488] focus-visible:outline-offset-2`}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label 
                  htmlFor="password-input" 
                  className={`text-sm font-semibold block ${theme === "dark" ? "text-slate-300" : "text-[#374151]"}`}
                >
                  Password
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0d9488] transition-colors pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="password-input"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    className={`w-full pl-12 pr-12 h-12 rounded-[10px] outline-none text-sm font-medium transition-all ${
                      theme === "dark"
                        ? "bg-[#1e293b] border-[#334155] text-slate-100 placeholder-[#475569] focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/15"
                        : "bg-[#f8fafc] border-[#e2e8f0] text-[#0f172a] placeholder-[#cbd5e1] focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/15"
                    } border-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0d9488] focus-visible:outline-offset-2`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0d9488] transition-colors min-h-[30px] min-w-[30px] flex items-center justify-center rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0d9488]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Password Strength Meter */}
                <div className="space-y-2 mt-2">
                  <div className="flex gap-2">
                    {[1, 2, 3].map((num) => (
                      <div
                        key={num}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          strength >= num ? strengthColors[strength] : (theme === "dark" ? "bg-slate-800" : "bg-[#e2e8f0]")
                        }`}
                      />
                    ))}
                  </div>
                  {strength > 0 && (
                    <p className={`text-[10px] font-bold uppercase tracking-wider text-right ${theme === "dark" ? "text-slate-400" : "text-[#64748b]"}`}>
                      Strength: {strengthLabels[strength]}
                    </p>
                  )}
                </div>

              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-[#0d9488] to-[#0891b2] hover:brightness-105 active:scale-[0.98] text-white font-bold rounded-[10px] shadow-[0_4px_16px_rgba(13,148,136,0.3)] transition-all flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0d9488] focus-visible:outline-offset-3"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Footer Options */}
            <div className="text-center space-y-4 mt-8">
              <p className={`text-sm font-medium ${theme === "dark" ? "text-slate-400" : "text-[#64748b]"}`}>
                Already have an account?{" "}
                <Link href="/signin" className="text-[#0d9488] font-bold hover:underline">
                  Sign in
                </Link>
              </p>
              
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#94a3b8] font-semibold">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Your data is encrypted and never shared.</span>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
