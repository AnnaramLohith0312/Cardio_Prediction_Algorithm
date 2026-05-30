"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/hooks/useAuth";

function SignInFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginWithGoogle } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedEmail = localStorage.getItem("cardio_remembered_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      setLoading(true);
      setError(null);
      try {
        await loginWithGoogle(credentialResponse.credential);
        const redirectUrl = searchParams.get("redirect") || "/dashboard";
        router.push(redirectUrl);
      } catch (err: any) {
        setError(err.message || "Google Sign-In verification failed on the server.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      if (rememberMe) {
        localStorage.setItem("cardio_remembered_email", email);
      } else {
        localStorage.removeItem("cardio_remembered_email");
      }
      const redirectUrl = searchParams.get("redirect") || "/dashboard";
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message || "Incorrect username/email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-satoshi bg-[#0b1220] overflow-x-hidden select-none">
      
      {/* Premium styles: custom fonts, ECG line drawing, and autofill overrides */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');

        .font-satoshi {
          font-family: 'Satoshi', sans-serif;
        }
        .font-display {
          font-family: 'Instrument Serif', Georgia, serif;
        }

        @keyframes draw {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }
        .ecg-anim-path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw 5s linear infinite;
        }

        /* Prevent ugly yellow browser autofill box-shadows */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
          -webkit-text-fill-color: #0f172a !important;
          border: 1px solid #e2e8f0 !important;
          caret-color: #0f766e !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}} />

      {/* --- TOP CHROM NAVIGATION HEADER --- */}
      <header className="h-[64px] bg-[#0b1220] border-b border-white/5 z-40 fixed top-0 left-0 right-0 px-4 sm:px-8 flex justify-between items-center">
        {/* Left Logo */}
        <Link href="/" className="flex items-center gap-2.5 min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0f766e] focus-visible:outline-offset-2 rounded px-2">
          <svg className="w-6 h-6 text-[#dc2626]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            <path d="M3.22 12H7.5l1.5-2.5L11 14.5l1.5-3.5 1.5 2h4.78" stroke="#ffffff" strokeWidth="1.5" />
          </svg>
          <span className="font-semibold text-lg text-white tracking-wide">
            CardioSense AI
          </span>
        </Link>

        {/* Right Nav Action */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400 hidden sm:inline-block">Don't have an account?</span>
          <Link 
            href="/signup" 
            className="px-5 py-2 border border-[#0f766e] text-white hover:bg-[#0f766e]/20 bg-[#0f766e] lg:bg-transparent lg:text-[#0f766e] font-bold rounded-lg text-xs tracking-wide transition-all min-h-[44px] flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0f766e] focus-visible:outline-offset-2"
          >
            Create account
          </Link>
        </div>
      </header>

      {/* --- MAIN SPLIT CONTAINER --- */}
      <div className="flex-1 flex flex-col lg:flex-row mt-[64px]">
        
        {/* LEFT BRAND PANEL (Visible as top header on mobile/tablet, full screen split on desktop) */}
        <section className="w-full lg:w-[55%] bg-[#0b1220] relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5">
          {/* Subtle Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,118,110,0.12)_0%,rgba(220,38,38,0.03)_60%,transparent_100%)] pointer-events-none"></div>

          {/* ECG Line Motif */}
          <div className="absolute inset-x-0 top-1/3 h-40 opacity-40 pointer-events-none hidden lg:block">
            <svg className="w-full h-full text-slate-800/20 overflow-visible" viewBox="0 0 400 100" fill="none">
              <path d="M 0 50 Q 80 50 100 50 L 115 30 L 130 75 L 145 15 L 160 55 L 175 50 Q 200 50 400 50" stroke="rgba(255,255,255,0.02)" strokeWidth="2" strokeLinecap="round" />
              <path 
                className="ecg-anim-path"
                d="M 0 50 Q 80 50 100 50 L 115 30 L 130 75 L 145 15 L 160 55 L 175 50 Q 200 50 400 50" 
                stroke="#dc2626" 
                strokeWidth="2" 
                strokeLinecap="round" 
              />
            </svg>
          </div>

          <div className="hidden lg:block"></div> {/* Spacer */}

          {/* Marketing Copy and Trust Indicators */}
          <div className="space-y-6 sm:space-y-8 relative z-10 my-auto lg:my-0">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight font-satoshi max-w-lg">
                Precision cardiovascular screening, built for proactive care.
              </h1>
              <p className="text-sm sm:text-[15px] text-slate-400 leading-relaxed max-w-md font-medium">
                CardioSense AI leverages state-of-the-art predictive algorithms to aid clinicians in early identification of cardiovascular risks.
              </p>
            </div>

            {/* Credibility Bullets with Minimalist Icons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-slate-200 font-semibold text-sm">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#0f766e]/20 text-[#0f766e]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span>AI-powered risk prediction</span>
              </div>
              <div className="flex items-center gap-3 text-slate-200 font-semibold text-sm">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#0f766e]/20 text-[#0f766e]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span>Secure patient insights</span>
              </div>
              <div className="flex items-center gap-3 text-slate-200 font-semibold text-sm">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#0f766e]/20 text-[#0f766e]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span>Faster early screening decisions</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 text-[11px] sm:text-[12px] text-[#0f766e] font-bold uppercase tracking-wider">
              Designed for modern preventive healthcare teams.
            </div>
          </div>
        </section>

        {/* RIGHT SIGN-IN PANEL (Clean white background with premium typography) */}
        <section className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white">
          <div className={`w-full max-w-[440px] flex flex-col justify-center transition-all duration-500 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}>
            
            {/* Header / Brand Sub-heading */}
            <div className="mb-8">
              <span className="inline-flex items-center gap-1.5 text-[#0f766e] font-bold text-xs uppercase tracking-wider mb-2 font-satoshi">
                <svg className="w-4 h-4 text-[#dc2626]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                CardioSense AI Secure Portal
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold font-display tracking-tight text-[#0f172a] mb-2.5">
                Welcome back
              </h2>
              <p className="text-sm sm:text-[15px] font-medium leading-relaxed text-[#475569]">
                Sign in to access predictions, dashboards, and patient screening insights.
              </p>
            </div>

            {/* Error Message banner */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2.5 shadow-sm">
                <svg className="w-5 h-5 flex-shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Credentials Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Input */}
              <div className="space-y-2">
                <label 
                  htmlFor="email-input" 
                  className="text-sm font-semibold text-[#0f172a] block"
                >
                  Email address
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0f766e] transition-colors pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    id="email-input"
                    type="email"
                    required
                    placeholder="name@medical-institution.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    className="w-full pl-12 pr-4 h-12 rounded-lg bg-white border border-[#e2e8f0] text-[#0f172a] placeholder-[#64748b] focus:border-[#0f766e] focus:ring-4 focus:ring-[#0f766e]/10 outline-none text-sm font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0f766e] focus-visible:outline-offset-2"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label 
                    htmlFor="password-input" 
                    className="text-sm font-semibold text-[#0f172a]"
                  >
                    Password
                  </label>
                  <button 
                    type="button"
                    onClick={() => alert("Password reset is managed by the system administrator. Please contact IT support.")}
                    className="text-xs font-semibold text-[#0f766e] hover:text-[#0d9488] hover:underline transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0f766e] focus-visible:outline-offset-2 rounded"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0f766e] transition-colors pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="password-input"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    className="w-full pl-12 pr-12 h-12 rounded-lg bg-white border border-[#e2e8f0] text-[#0f172a] placeholder-[#64748b] focus:border-[#0f766e] focus:ring-4 focus:ring-[#0f766e]/10 outline-none text-sm font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0f766e] focus-visible:outline-offset-2"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0f766e] transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0f766e]"
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
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-3">
                <div className="relative flex items-center min-h-[44px]">
                  <input
                    id="remember-checkbox"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-5 h-5 rounded border-[#e2e8f0] text-[#0f766e] focus:ring-[#0f766e]/30 cursor-pointer accent-[#0f766e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0f766e]"
                  />
                </div>
                <label 
                  htmlFor="remember-checkbox" 
                  className="text-sm cursor-pointer select-none font-medium text-[#475569]"
                >
                  Remember me for 30 days
                </label>
              </div>

              {/* Primary CTA Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#0f766e] hover:bg-[#0d9488] active:scale-[0.98] text-white font-bold rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0f766e] focus-visible:outline-offset-3"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Or Divider */}
            <div className="relative my-7 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e2e8f0]"></div>
              </div>
              <span className="relative px-4 text-xs font-semibold uppercase tracking-wider bg-white text-[#94a3b8]">
                OR
              </span>
            </div>

            {/* Google Sign-in Button */}
            <div className="relative w-full h-12 mb-6 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0f766e] focus-visible:outline-offset-2 rounded-lg overflow-hidden">
              <button 
                type="button"
                className="absolute inset-0 w-full h-full flex items-center justify-center gap-3 border bg-white border-[#e2e8f0] text-[#374151] hover:bg-[#f8fafc] hover:border-[#cbd5e1] active:scale-[0.98] font-semibold text-[15px] rounded-lg transition-all cursor-pointer"
                aria-label="Sign in with Google"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 15.01 1 12 1 7.35 1 3.39 3.65 1.5 7.5l3.86 3C6.27 7.7 8.9 5.04 12 5.04z" />
                  <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.12 2.74-2.38 3.59l3.7 2.87c2.16-1.99 3.41-4.92 3.41-8.61z" />
                  <path fill="#FBBC05" d="M5.36 14.5c-.24-.72-.38-1.5-.38-2.3s.14-1.58.38-2.3L1.5 6.9c-.83 1.66-1.3 3.52-1.3 5.5s.47 3.84 1.3 5.5l3.86-2.9z" />
                  <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.03.69-2.35 1.1-3.96 1.1-3.1 0-5.73-2.66-6.64-5.46L1.5 15.8c1.89 3.85 5.85 6.5 10.5 6.5z" />
                </svg>
                <span>Continue with Google</span>
              </button>
              <div className="absolute inset-0 opacity-0 overflow-hidden cursor-pointer w-full h-full flex justify-center items-center scale-110">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google Sign-In was unsuccessful. Please try again.")}
                  shape="rectangular"
                  theme="outline"
                  size="large"
                  width="440"
                />
              </div>
            </div>

            {/* Footer trust and alternative links */}
            <div className="text-center space-y-4">
              <p className="text-sm font-medium text-[#64748b]">
                Don't have an account?{" "}
                <Link href="/signup" className="text-[#0f766e] font-bold hover:underline hover:text-[#0d9488]">
                  Sign up
                </Link>
              </p>
              
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#94a3b8] font-semibold">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Your health data is encrypted and securely handled.</span>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0b1220] text-white">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-8 h-8 animate-spin text-[#0f766e]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm font-semibold tracking-wider text-slate-400">Loading CardioSense AI...</span>
        </div>
      </div>
    }>
      <SignInFormContent />
    </Suspense>
  );
}
