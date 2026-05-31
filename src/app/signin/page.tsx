"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/hooks/useAuth";
import Footer from "@/components/shared/Footer";

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

  useEffect(() => {
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
    <div className="bg-background text-on-surface selection:bg-teal-accent/30 min-h-screen flex flex-col font-body-main">
      <style dangerouslySetInnerHTML={{__html: `
        .ecg-grid {
            background-size: 40px 40px;
            background-image: linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
        }
      `}} />
      <main className="flex-grow flex flex-col md:flex-row min-h-screen">
        {/* Left Panel: Brand Storytelling */}
        <section className="relative hidden md:flex md:w-1/2 bg-surface-container-lowest overflow-hidden flex-col justify-between p-margin-desktop border-r border-border group">
          {/* ECG Grid Background Overlay */}
          <div className="absolute inset-0 ecg-grid opacity-20 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-teal-accent/5 via-transparent to-transparent pointer-events-none"></div>
          
          <div className="relative z-10">
            <h1 className="font-headline-page text-headline-page text-primary font-bold">CorMetrics</h1>
            <div className="mt-section-gap max-w-md">
              <h2 className="font-display-hero text-[48px] leading-tight text-on-surface mb-6">
                Empowering early cardiovascular detection.
              </h2>
              <p className="font-body-main text-text-secondary">
                Harnessing advanced neural networks to provide clinicians with unparalleled diagnostic precision and predictive insights.
              </p>
            </div>
          </div>

          {/* Medical Visual Logic */}
          <div className="relative z-10 mt-auto">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border bg-surface-container shadow-2xl transition-transform duration-500 ease-out group-hover:scale-[1.02]">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3Fy4EoTZNMMtnuMCQiaeJrWQgWKCXkh9ZFynvVzznyLOwWBIDutZdpvUIs1Jkg_wjomjuMJtT6E8TCuzQpHsCsRYooeWHcY4LGuD2r0toWx9AWPiifFw2uEFEuXC3GrptU12R9AmcerbkFp4ejlBUdwWg-En7azSR5V3fbpXesYtYKS2fdFf2DvRBgw_74JI4jhr4WChiIkqhgWAxI3ym9V4MbSdOC-nVw8MNnTIbuCjqdyxqSo80sXms_Cl0Av9lmHz388Ehklvs" 
                className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                alt="Medical diagnostic interface"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-teal-accent/20 flex items-center justify-center backdrop-blur-md border border-teal-accent/30">
                  <span className="material-symbols-outlined text-teal-accent" style={{ fontVariationSettings: "'FILL' 1" }}>monitor_heart</span>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-teal-accent">REAL-TIME ANALYSIS</p>
                  <p className="font-title-card text-title-card text-white">Clinical Intelligence Engine</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex gap-8 items-center opacity-60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span className="font-metadata text-metadata">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">security</span>
                <span className="font-metadata text-metadata">AES-256 Encrypted</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Panel: Sign In Form */}
        <section className="flex-grow flex items-center justify-center p-margin-mobile md:p-margin-desktop bg-background">
          <div className="w-full max-w-[420px]">
            {/* Mobile Logo */}
            <div className="md:hidden mb-12">
              <h1 className="font-headline-page text-headline-page text-primary font-bold text-center">CorMetrics</h1>
            </div>
            
            <header className="mb-10">
              <h2 className="font-headline-section text-headline-section text-on-surface mb-2">Welcome Back</h2>
              <p className="font-body-compact text-text-muted">Enter your credentials to access the diagnostic dashboard.</p>
            </header>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-risk-high/10 border border-risk-high text-risk-high text-sm font-semibold flex items-start gap-2.5">
                <span className="material-symbols-outlined">error</span>
                <span>{error}</span>
              </div>
            )}

            {error && (
  <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg border border-error/50 flex items-center gap-3">
    <span className="material-symbols-outlined">error</span>
    <p className="text-sm font-medium">{error}</p>
  </div>
)}
<form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant ml-1" htmlFor="email">EMAIL ADDRESS</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[20px] group-focus-within:text-teal-accent transition-colors">mail</span>
                  <input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface-container-high border border-border focus:border-teal-accent focus:ring-1 focus:ring-teal-accent/50 rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-text-muted/50 transition-all outline-none" 
                    placeholder="dr.smith@cardiology.com" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="password">PASSWORD</label>
                  <a className="font-metadata text-metadata text-primary hover:underline transition-all" href="#">Forgot password?</a>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[20px] group-focus-within:text-teal-accent transition-colors">lock</span>
                  <input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface-container-high border border-border focus:border-teal-accent focus:ring-1 focus:ring-teal-accent/50 rounded-xl py-4 pl-12 pr-12 text-on-surface placeholder:text-text-muted/50 transition-all outline-none" 
                    placeholder="••••••••" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-teal-accent transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-3 px-1">
                <input 
                  id="remember" 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 rounded border-border bg-surface-container-high text-teal-accent focus:ring-teal-accent/30 focus:ring-offset-background transition-all cursor-pointer" 
                />
                <label className="font-body-compact text-text-secondary cursor-pointer select-none" htmlFor="remember">Keep me signed in for 30 days</label>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-accent hover:bg-teal-accent/90 active:scale-[0.98] disabled:opacity-50 text-white font-title-card py-4 rounded-xl transition-all shadow-lg shadow-teal-accent/10 flex items-center justify-center gap-2"
              >
                <span>{loading ? "Signing in..." : "Secure Sign In"}</span>
                {!loading && <span className="material-symbols-outlined text-[18px]">lock_open</span>}
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-label-caps">
                <span className="bg-background px-4 text-text-muted">OR CONTINUE WITH</span>
              </div>
            </div>

            <div className="relative w-full rounded-xl overflow-hidden group">
              <button className="w-full bg-surface-container-low border border-border hover:bg-surface-container-high hover:border-on-surface-variant/30 text-on-surface font-title-card py-4 rounded-xl transition-all flex items-center justify-center gap-3">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"></path>
                </svg>
                Sign in with Google
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

            <footer className="mt-12 text-center">
              <p className="font-body-compact text-text-muted">
                Don't have an institutional account? 
                <Link href="/signup" className="text-primary font-semibold hover:underline ml-1">Sign up</Link>
              </p>
            </footer>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background text-primary">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined animate-spin text-3xl">sync</span>
          <span className="text-sm font-semibold tracking-wider">Loading CorMetrics...</span>
        </div>
      </div>
    }>
      <SignInFormContent />
    </Suspense>
  );
}
