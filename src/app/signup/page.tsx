"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Footer from "@/components/shared/Footer";

export default function SignUpPage() {
  const router = useRouter();
  const { signup } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPasswordStrength = (pass: string): 0 | 1 | 2 | 3 => {
    if (!pass) return 0;
    if (pass.length < 6) return 1;
    if (pass.length < 10) return 2;
    return 3;
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong"];
  const strengthColors = ["bg-surface-container-highest", "bg-risk-high", "bg-risk-medium", "bg-risk-low"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
                Join the network of advanced diagnostics.
              </h2>
              <p className="font-body-main text-text-secondary">
                Register a clinical account to access our predictive neural networks and securely manage patient assessment data.
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
                  <span className="material-symbols-outlined text-teal-accent" style={{ fontVariationSettings: "'FILL' 1" }}>shield_locked</span>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-teal-accent">SECURE ONBOARDING</p>
                  <p className="font-title-card text-title-card text-white">Identity Verification Systems</p>
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

        {/* Right Panel: Sign Up Form */}
        <section className="flex-grow flex items-center justify-center p-margin-mobile md:p-margin-desktop bg-background">
          <div className="w-full max-w-[420px]">
            {/* Mobile Logo */}
            <div className="md:hidden mb-12">
              <h1 className="font-headline-page text-headline-page text-primary font-bold text-center">CorMetrics</h1>
            </div>
            
            <header className="mb-10">
              <h2 className="font-headline-section text-headline-section text-on-surface mb-2">Create Account</h2>
              <p className="font-body-compact text-text-muted">Register to start analyzing patient cardiovascular risk profiles.</p>
            </header>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-risk-high/10 border border-risk-high text-risk-high text-sm font-semibold flex items-start gap-2.5">
                <span className="material-symbols-outlined">error</span>
                <span>{error}</span>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant ml-1" htmlFor="name">FULL NAME</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[20px] group-focus-within:text-teal-accent transition-colors">person</span>
                  <input 
                    id="name" 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface-container-high border border-border focus:border-teal-accent focus:ring-1 focus:ring-teal-accent/50 rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-text-muted/50 transition-all outline-none" 
                    placeholder="Dr. Alex Chen" 
                  />
                </div>
              </div>

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
                    placeholder="alex@cardiology.com" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="password">PASSWORD</label>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[20px] group-focus-within:text-teal-accent transition-colors">lock</span>
                  <input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface-container-high border border-border focus:border-teal-accent focus:ring-1 focus:ring-teal-accent/50 rounded-xl py-4 pl-12 pr-12 text-on-surface placeholder:text-text-muted/50 transition-all outline-none" 
                    placeholder="Min. 8 characters" 
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
                {/* Password Strength Meter */}
                <div className="space-y-2 pt-2 px-1">
                  <div className="flex gap-2">
                    {[1, 2, 3].map((num) => (
                      <div
                        key={num}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          strength >= num ? strengthColors[strength] : "bg-surface-container-highest"
                        }`}
                      />
                    ))}
                  </div>
                  {strength > 0 && (
                    <p className="text-[10px] font-bold uppercase tracking-wider text-right text-text-muted">
                      Strength: {strengthLabels[strength]}
                    </p>
                  )}
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-accent hover:bg-teal-accent/90 active:scale-[0.98] disabled:opacity-50 text-white font-title-card py-4 rounded-xl transition-all shadow-lg shadow-teal-accent/10 flex items-center justify-center gap-2 mt-4"
              >
                <span>{loading ? "Creating account..." : "Create Account"}</span>
                {!loading && <span className="material-symbols-outlined text-[20px]">person_add</span>}
              </button>
            </form>

            <footer className="mt-12 text-center">
              <p className="font-body-compact text-text-muted">
                Already have an account? 
                <Link href="/signin" className="text-primary font-semibold hover:underline ml-1">Sign in</Link>
              </p>
            </footer>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
