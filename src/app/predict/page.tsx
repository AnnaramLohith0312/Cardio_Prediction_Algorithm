"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import PredictionResult from "./result";
import LoadingScreen from "@/components/LoadingScreen";
import ErrorBanner from "@/components/ErrorBanner";

type FormData = {
  age_years: string;
  gender: string; // "1"=Female, "2"=Male
  height: string;
  weight: string;
  ap_hi: string;
  ap_lo: string;
  cholesterol: string; // 1, 2, 3
  gluc: string; // 1, 2, 3
  smoke: boolean;
  alco: boolean;
  active: boolean;
};

export default function PredictPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resultData, setResultData] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>({
    age_years: "",
    gender: "",
    height: "",
    weight: "",
    ap_hi: "",
    ap_lo: "",
    cholesterol: "1", // defaults
    gluc: "1",
    smoke: false,
    alco: false,
    active: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Real-time BMI Calculation
  const bmi = useMemo(() => {
    const h = parseFloat(formData.height) / 100;
    const w = parseFloat(formData.weight);
    if (h > 0 && w > 0) return w / (h * h);
    return null;
  }, [formData.height, formData.weight]);

  const bmiStatus = useMemo(() => {
    if (!bmi) return { text: "Enter dimensions", color: "text-on-surface-variant" };
    if (bmi < 18.5) return { text: "Underweight", color: "text-secondary" };
    if (bmi < 25) return { text: "Normal Range", color: "text-risk-low" };
    if (bmi < 30) return { text: "Overweight", color: "text-risk-medium" };
    return { text: "Obese", color: "text-risk-high" };
  }, [bmi]);

  const pulsePressure = useMemo(() => {
    const hi = parseFloat(formData.ap_hi);
    const lo = parseFloat(formData.ap_lo);
    if (!isNaN(hi) && !isNaN(lo)) return hi - lo;
    return null;
  }, [formData.ap_hi, formData.ap_lo]);

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateStep = (stepNumber: number) => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (stepNumber === 1) {
      if (!formData.age_years || parseFloat(formData.age_years) < 1 || parseFloat(formData.age_years) > 100) newErrors.age_years = "Required";
      if (!formData.gender) newErrors.gender = "Required";
      if (!formData.height || parseFloat(formData.height) < 130 || parseFloat(formData.height) > 220) newErrors.height = "Required";
      if (!formData.weight || parseFloat(formData.weight) < 40 || parseFloat(formData.weight) > 200) newErrors.weight = "Required";
    }
    if (stepNumber === 2) {
      if (!formData.ap_hi || parseFloat(formData.ap_hi) < 60 || parseFloat(formData.ap_hi) > 250) newErrors.ap_hi = "Required";
      if (!formData.ap_lo || parseFloat(formData.ap_lo) < 40 || parseFloat(formData.ap_lo) > 200) newErrors.ap_lo = "Required";
      if (parseFloat(formData.ap_hi) <= parseFloat(formData.ap_lo)) {
        newErrors.ap_hi = "Invalid";
        newErrors.ap_lo = "Invalid";
      }
      if (!formData.cholesterol) newErrors.cholesterol = "Required";
      if (!formData.gluc) newErrors.gluc = "Required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(s => Math.min(totalSteps, s + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep(s => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const payload = {
        age_years: parseFloat(formData.age_years),
        gender: parseInt(formData.gender),
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        ap_hi: parseFloat(formData.ap_hi),
        ap_lo: parseFloat(formData.ap_lo),
        cholesterol: parseInt(formData.cholesterol),
        gluc: parseInt(formData.gluc),
        smoke: formData.smoke ? 1 : 0,
        alco: formData.alco ? 1 : 0,
        active: formData.active ? 1 : 0,
      };

      const token = localStorage.getItem("cardio_token"); 
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/predict", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Prediction failed");
      const data = await res.json();
      
      setResultData(data);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResultData(null);
    setCurrentStep(1);
    setFormData({
      age_years: "", gender: "", height: "", weight: "",
      ap_hi: "", ap_lo: "", cholesterol: "1", gluc: "1",
      smoke: false, alco: false, active: true,
    });
  };

  if (resultData) {
    return (
      <div className="bg-background text-on-background min-h-screen">
        <PredictionResult 
          inputData={formData} 
          resultData={resultData} 
          onReset={handleReset} 
        />
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body-main selection:bg-teal-accent/30 min-h-screen">
      <style dangerouslySetInnerHTML={{__html: `
        .step-transition { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .glass-panel {
            background: rgba(28, 32, 32, 0.7);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }
      `}} />
      
      {/* TopNavBar */}
      <header className="w-full top-0 sticky z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <nav className="flex justify-between items-center px-margin-desktop py-4 max-w-container-max mx-auto">
          <div className="font-headline-page text-headline-page text-primary font-bold">CorMetrics</div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="/dashboard" className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200">Dashboard</a>
            <a href="#" className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200">Analytics</a>
            <a href="#" className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200">Methodology</a>
            <a href="/predict" className="text-primary font-semibold border-b-2 border-primary pb-1">Risk Assessment</a>
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">account_circle</span>
          </div>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-margin-mobile md:px-0 py-12">
        {errorMsg && <ErrorBanner message={errorMsg} onDismiss={() => setErrorMsg(null)} />}
        {loading && <LoadingScreen />}

        {/* Progress Header */}
        <section className="mb-12 text-center">
          <span className="font-label-caps text-label-caps text-teal-accent uppercase tracking-widest">Clinical Protocol</span>
          <h1 className="font-headline-page text-headline-page mt-2 mb-8">Cardiovascular Risk Assessment</h1>
          <div className="flex items-center justify-between max-w-2xl mx-auto relative px-4">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-surface-container-high -z-10 -translate-y-1/2"></div>
            <div 
              className="absolute top-1/2 left-0 h-[2px] bg-teal-accent -z-10 -translate-y-1/2 transition-all duration-500" 
              style={{ width: \`\${((currentStep - 1) / (totalSteps - 1)) * 100}%\` }}
            ></div>
            
            {[1, 2, 3, 4].map((stepIdx) => {
              const labels = ["DEMOGRAPHICS", "CLINICAL", "LIFESTYLE", "REVIEW"];
              const isActive = currentStep === stepIdx;
              const isPast = currentStep > stepIdx;
              return (
                <div key={stepIdx} className="step-node flex flex-col items-center gap-2 group">
                  <div className={\`w-10 h-10 rounded-full flex items-center justify-center font-bold ring-4 ring-background transition-all \${isPast || isActive ? 'bg-teal-accent text-white' : 'bg-surface-container-highest text-on-surface-variant'}\`}>
                    {isPast ? <span className="material-symbols-outlined text-sm">check</span> : stepIdx}
                  </div>
                  <span className={\`font-label-caps text-[10px] \${isPast || isActive ? 'text-teal-accent' : 'text-on-surface-variant'}\`}>
                    {labels[stepIdx - 1]}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Form Canvas */}
        <div className="glass-panel rounded-xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          
          {/* Step 1: Demographics */}
          {currentStep === 1 && (
            <section className="step-content space-y-8 animate-[fadeIn_0.4s_ease-out]">
              <div className="border-l-4 border-teal-accent pl-6">
                <h2 className="font-headline-section text-headline-section">Patient Demographics</h2>
                <p className="text-text-muted mt-2">Foundational data for age-weighted risk algorithms.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">AGE (YEARS)</label>
                  <input 
                    type="number" 
                    value={formData.age_years}
                    onChange={e => handleChange("age_years", e.target.value)}
                    className={\`w-full bg-surface-container-lowest border \${errors.age_years ? 'border-risk-high' : 'border-border'} rounded-lg p-4 text-primary focus:border-teal-accent transition-all outline-none\`} 
                    placeholder="e.g. 45" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">BIOLOGICAL GENDER</label>
                  <select 
                    value={formData.gender}
                    onChange={e => handleChange("gender", e.target.value)}
                    className={\`w-full bg-surface-container-lowest border \${errors.gender ? 'border-risk-high' : 'border-border'} rounded-lg p-4 text-primary focus:border-teal-accent transition-all outline-none\`}
                  >
                    <option value="">Select...</option>
                    <option value="2">Male</option>
                    <option value="1">Female</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">HEIGHT (CM)</label>
                  <input 
                    type="number" 
                    value={formData.height}
                    onChange={e => handleChange("height", e.target.value)}
                    className={\`w-full bg-surface-container-lowest border \${errors.height ? 'border-risk-high' : 'border-border'} rounded-lg p-4 text-primary focus:border-teal-accent transition-all outline-none\`}
                    placeholder="e.g. 175" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">WEIGHT (KG)</label>
                  <input 
                    type="number" 
                    value={formData.weight}
                    onChange={e => handleChange("weight", e.target.value)}
                    className={\`w-full bg-surface-container-lowest border \${errors.weight ? 'border-risk-high' : 'border-border'} rounded-lg p-4 text-primary focus:border-teal-accent transition-all outline-none\`}
                    placeholder="e.g. 70" 
                  />
                </div>
              </div>
              
              {/* BMI Real-time Display */}
              <div className="p-6 bg-primary-container/10 rounded-lg border border-primary-container/20 flex items-center justify-between">
                <div>
                  <h4 className="font-title-card text-primary">Live BMI Calculation</h4>
                  <p className="text-metadata text-on-surface-variant">Calculated automatically from height and weight.</p>
                </div>
                <div className="text-right">
                  <span className={\`text-4xl font-bold \${bmi ? 'text-teal-accent' : 'text-text-muted'}\`}>
                    {bmi ? bmi.toFixed(1) : "--.-"}
                  </span>
                  <span className={\`block text-metadata \${bmiStatus.color}\`}>{bmiStatus.text}</span>
                </div>
              </div>
            </section>
          )}

          {/* Step 2: Clinical Values */}
          {currentStep === 2 && (
            <section className="step-content space-y-8 animate-[fadeIn_0.4s_ease-out]">
              <div className="border-l-4 border-teal-accent pl-6">
                <h2 className="font-headline-section text-headline-section">Clinical Biomarkers</h2>
                <p className="text-text-muted mt-2">Objective measurements from recent physical examinations.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="font-label-caps text-label-caps text-on-surface-variant">SYSTOLIC BP (MMHG)</label>
                    <span className="text-[10px] text-teal-accent">NORMAL &lt; 120</span>
                  </div>
                  <input 
                    type="number" 
                    value={formData.ap_hi}
                    onChange={e => handleChange("ap_hi", e.target.value)}
                    className={\`w-full bg-surface-container-lowest border \${errors.ap_hi ? 'border-risk-high' : 'border-border'} rounded-lg p-4 text-primary focus:border-teal-accent outline-none\`} 
                    placeholder="120" 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="font-label-caps text-label-caps text-on-surface-variant">DIASTOLIC BP (MMHG)</label>
                    <span className="text-[10px] text-teal-accent">NORMAL &lt; 80</span>
                  </div>
                  <input 
                    type="number" 
                    value={formData.ap_lo}
                    onChange={e => handleChange("ap_lo", e.target.value)}
                    className={\`w-full bg-surface-container-lowest border \${errors.ap_lo ? 'border-risk-high' : 'border-border'} rounded-lg p-4 text-primary focus:border-teal-accent outline-none\`} 
                    placeholder="80" 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="font-label-caps text-label-caps text-on-surface-variant">CHOLESTEROL LEVEL</label>
                    <span className="text-[10px] text-teal-accent">1=Norm, 3=High</span>
                  </div>
                  <select 
                    value={formData.cholesterol}
                    onChange={e => handleChange("cholesterol", e.target.value)}
                    className="w-full bg-surface-container-lowest border border-border rounded-lg p-4 text-primary focus:border-teal-accent outline-none"
                  >
                    <option value="1">Normal (&lt; 200 mg/dl)</option>
                    <option value="2">Above Normal (200-239)</option>
                    <option value="3">Well Above Normal (≥ 240)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="font-label-caps text-label-caps text-on-surface-variant">GLUCOSE LEVEL</label>
                    <span className="text-[10px] text-teal-accent">1=Norm, 3=High</span>
                  </div>
                  <select 
                    value={formData.gluc}
                    onChange={e => handleChange("gluc", e.target.value)}
                    className="w-full bg-surface-container-lowest border border-border rounded-lg p-4 text-primary focus:border-teal-accent outline-none"
                  >
                    <option value="1">Normal (&lt; 100 mg/dl)</option>
                    <option value="2">Above Normal (100-125)</option>
                    <option value="3">Well Above Normal (≥ 126)</option>
                  </select>
                </div>
              </div>
            </section>
          )}

          {/* Step 3: Lifestyle Factors */}
          {currentStep === 3 && (
            <section className="step-content space-y-8 animate-[fadeIn_0.4s_ease-out]">
              <div className="border-l-4 border-teal-accent pl-6">
                <h2 className="font-headline-section text-headline-section">Lifestyle Context</h2>
                <p className="text-text-muted mt-2">Behavioral variables that influence long-term cardiovascular health.</p>
              </div>
              <div className="space-y-6">
                <label className="block p-6 bg-surface-container rounded-lg border border-border hover:border-teal-accent/30 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-teal-accent">smoking_rooms</span>
                      <div>
                        <h4 className="font-title-card">Tobacco Usage</h4>
                        <p className="text-metadata text-on-surface-variant">Do you currently smoke or use tobacco products?</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={formData.smoke}
                      onChange={e => handleChange("smoke", e.target.checked)}
                      className="w-6 h-6 rounded border-border bg-surface-container-lowest text-teal-accent focus:ring-teal-accent/20 cursor-pointer" 
                    />
                  </div>
                </label>
                <label className="block p-6 bg-surface-container rounded-lg border border-border hover:border-teal-accent/30 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-teal-accent">local_bar</span>
                      <div>
                        <h4 className="font-title-card">Alcohol Consumption</h4>
                        <p className="text-metadata text-on-surface-variant">Regular intake exceeding 14 units per week?</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={formData.alco}
                      onChange={e => handleChange("alco", e.target.checked)}
                      className="w-6 h-6 rounded border-border bg-surface-container-lowest text-teal-accent focus:ring-teal-accent/20 cursor-pointer" 
                    />
                  </div>
                </label>
                <label className="block p-6 bg-surface-container rounded-lg border border-border hover:border-teal-accent/30 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-teal-accent">fitness_center</span>
                      <div>
                        <h4 className="font-title-card">Physical Activity</h4>
                        <p className="text-metadata text-on-surface-variant">Minimum 150 min of moderate activity per week?</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={formData.active}
                      onChange={e => handleChange("active", e.target.checked)}
                      className="w-6 h-6 rounded border-border bg-surface-container-lowest text-teal-accent focus:ring-teal-accent/20 cursor-pointer" 
                    />
                  </div>
                </label>
              </div>
            </section>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <section className="step-content space-y-8 animate-[fadeIn_0.4s_ease-out]">
              <div className="border-l-4 border-teal-accent pl-6">
                <h2 className="font-headline-section text-headline-section">Final Review</h2>
                <p className="text-text-muted mt-2">Verify all clinical inputs before generating AI risk prediction.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-component-gap">
                <div className="bg-surface-container-lowest p-5 rounded-lg border border-border">
                  <span className="font-label-caps text-[10px] text-on-surface-variant block mb-3">BIOMETRICS</span>
                  <div className="space-y-1">
                    <div className="flex justify-between text-metadata"><span className="text-on-surface-variant">Age</span><span className="text-primary">{formData.age_years || "--"}</span></div>
                    <div className="flex justify-between text-metadata"><span className="text-on-surface-variant">BMI</span><span className="text-teal-accent font-bold">{bmi ? bmi.toFixed(1) : "--"}</span></div>
                    <div className="flex justify-between text-metadata"><span className="text-on-surface-variant">Gender</span><span className="text-primary capitalize">{formData.gender === "2" ? "Male" : formData.gender === "1" ? "Female" : "--"}</span></div>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-5 rounded-lg border border-border">
                  <span className="font-label-caps text-[10px] text-on-surface-variant block mb-3">VITALS & LABS</span>
                  <div className="space-y-1">
                    <div className="flex justify-between text-metadata"><span className="text-on-surface-variant">BP</span><span className="text-primary">{formData.ap_hi && formData.ap_lo ? \`\${formData.ap_hi}/\${formData.ap_lo}\` : "--/--"}</span></div>
                    <div className="flex justify-between text-metadata"><span className="text-on-surface-variant">Pulse Press.</span><span className="text-primary font-bold">{pulsePressure !== null ? \`\${pulsePressure} mmHg\` : "--"}</span></div>
                    <div className="flex justify-between text-metadata"><span className="text-on-surface-variant">Cholesterol</span><span className="text-primary">Lvl {formData.cholesterol || "--"}</span></div>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-5 rounded-lg border border-border">
                  <span className="font-label-caps text-[10px] text-on-surface-variant block mb-3">LIFESTYLE</span>
                  <div className="space-y-1">
                    <div className="flex justify-between text-metadata"><span className="text-on-surface-variant">Smoker</span><span className="text-primary">{formData.smoke ? "Yes" : "No"}</span></div>
                    <div className="flex justify-between text-metadata"><span className="text-on-surface-variant">Alcohol</span><span className="text-primary">{formData.alco ? "Yes" : "No"}</span></div>
                    <div className="flex justify-between text-metadata"><span className="text-on-surface-variant">Active</span><span className="text-primary">{formData.active ? "Yes" : "No"}</span></div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-surface-container-high rounded-xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-headline-section text-primary mb-2">Predict Cardiovascular Risk</h3>
                  <p className="text-body-compact text-on-surface-variant mb-6 max-w-lg">Our ensemble AI models will process these 11 variables against clinical datasets to estimate your 10-year risk profile.</p>
                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-teal-accent text-white px-10 py-4 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-teal-accent/20 disabled:opacity-50"
                  >
                    {loading ? "Analyzing..." : "Predict Risk Now"}
                  </button>
                </div>
                <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                  <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>monitor_heart</span>
                </div>
              </div>
            </section>
          )}

          {/* Action Buttons */}
          <div className="mt-12 flex justify-between items-center border-t border-border pt-8">
            <button 
              onClick={handlePrev}
              className={\`flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors \${currentStep === 1 ? 'invisible' : ''}\`}
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span>Back</span>
            </button>
            <div className="flex-1"></div>
            {currentStep < totalSteps && (
              <button 
                onClick={handleNext}
                className="bg-primary text-on-primary px-8 py-3 rounded-lg font-semibold hover:opacity-90 active:opacity-80 transition-all flex items-center gap-2"
              >
                <span>Continue</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-section-gap bg-surface-container-low border-t border-border mt-section-gap">
        <div className="px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-component-gap">
          <div className="text-left">
            <div className="font-title-card text-title-card text-on-surface">CorMetrics</div>
            <p className="font-metadata text-metadata text-text-muted mt-2 max-w-md">© 2024 CorMetrics. For clinical decision support only. Not a replacement for professional medical advice.</p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="font-metadata text-metadata text-text-muted hover:text-on-surface transition-colors">Privacy Policy</a>
            <a href="#" className="font-metadata text-metadata text-text-muted hover:text-on-surface transition-colors">Terms of Service</a>
            <a href="#" className="font-metadata text-metadata text-text-muted hover:text-on-surface transition-colors">HIPAA Compliance</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
