"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import PredictionResult from "./result";
import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingScreen";
import ErrorBanner from "@/components/ErrorBanner";

type FormData = {
  age_years: string;
  gender: string; // 1=Female, 2=Male
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
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resultData, setResultData] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>({
    age_years: "45",
    gender: "1",
    height: "165",
    weight: "70",
    ap_hi: "120",
    ap_lo: "80",
    cholesterol: "1",
    gluc: "1",
    smoke: false,
    alco: false,
    active: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Auto computations
  const bmi = useMemo(() => {
    const h = parseFloat(formData.height) / 100;
    const w = parseFloat(formData.weight);
    if (h > 0 && w > 0) return w / (h * h);
    return 0;
  }, [formData.height, formData.weight]);

  const pulsePressure = useMemo(() => {
    const hi = parseFloat(formData.ap_hi);
    const lo = parseFloat(formData.ap_lo);
    if (!isNaN(hi) && !isNaN(lo)) return hi - lo;
    return 0;
  }, [formData.ap_hi, formData.ap_lo]);

  const bmiColor = bmi < 25 ? "bg-[var(--accent-green)]" : bmi < 30 ? "bg-yellow-500" : "bg-[var(--accent-red)]";

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (currentStep === 1) {
      if (parseFloat(formData.age_years) < 1 || parseFloat(formData.age_years) > 100) newErrors.age_years = "Must be between 1-100";
      if (parseFloat(formData.height) < 130 || parseFloat(formData.height) > 220) newErrors.height = "Must be between 130-220 cm";
      if (parseFloat(formData.weight) < 40 || parseFloat(formData.weight) > 200) newErrors.weight = "Must be between 40-200 kg";
    }
    if (currentStep === 2) {
      if (parseFloat(formData.ap_hi) < 60 || parseFloat(formData.ap_hi) > 250) newErrors.ap_hi = "Must be between 60-250";
      if (parseFloat(formData.ap_lo) < 40 || parseFloat(formData.ap_lo) > 200) newErrors.ap_lo = "Must be between 40-200";
      if (parseFloat(formData.ap_hi) <= parseFloat(formData.ap_lo)) {
        newErrors.ap_hi = "Systolic must be higher than Diastolic";
        newErrors.ap_lo = "Diastolic must be lower than Systolic";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep(s => Math.min(3, s + 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
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

      // Usually requires auth header depending on backend setup
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
      
      // Render the result component instead of redirecting
      setResultData(data);
      setLoading(false);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResultData(null);
    setStep(1);
    // Optionally reset formData here if desired
  };

  if (resultData) {
    return (
      <div className="min-h-screen flex flex-col relative">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4 mt-16">
          <PredictionResult 
            inputData={formData} 
            resultData={resultData} 
            onReset={handleReset} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-24 relative overflow-x-hidden">
      <Navbar />
      {loading && <LoadingScreen />}
      {errorMsg && <ErrorBanner message={errorMsg} onDismiss={() => setErrorMsg(null)} />}

      {/* Step Indicator */}
      <div className="w-full max-w-[560px] flex items-center justify-between mb-8 relative z-10">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[var(--border-color)] -z-10 -translate-y-1/2"></div>
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex flex-col items-center gap-2 bg-[var(--bg-color)] px-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              step > num ? "bg-[var(--interactive-teal)] text-white" :
              step === num ? "border-2 border-[var(--interactive-teal)] text-[var(--interactive-teal)] animate-pulse shadow-[0_0_10px_var(--interactive-teal)]" :
              "bg-[var(--border-color)] text-[var(--text-muted)]"
            }`}>
              {step > num ? "✓" : num}
            </div>
            <span className="text-xs font-semibold text-[var(--text-muted)] hidden sm:block">
              {num === 1 ? "Personal Details" : num === 2 ? "Clinical Data" : "Lifestyle"}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full max-w-[560px] bg-[var(--surface-color)] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] border border-[var(--border-color)] overflow-hidden relative min-h-[500px]">
          <div className="p-6 sm:p-8 flex flex-col h-full animate-[fadeIn_0.3s_ease-out]">
            <h2 className="text-[var(--text-xl)] font-[var(--font-display)] text-[var(--text-color)] mb-6">
              {step === 1 ? "Personal Details" : step === 2 ? "Blood Pressure & Labs" : "Lifestyle"}
            </h2>

            <div className="flex-1 space-y-6">
              {/* STEP 1 */}
              {step === 1 && (
                <>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-[var(--text-color)]">Age (Years)</label>
                    <div className="flex gap-4 items-center">
                      <input 
                        type="range" min="1" max="100" 
                        className="flex-1 accent-[var(--interactive-teal)]"
                        value={formData.age_years}
                        onChange={e => handleChange("age_years", e.target.value)}
                      />
                      <span className="w-12 text-center text-lg font-bold">{formData.age_years}</span>
                    </div>
                    {errors.age_years && <p className="text-xs text-[var(--accent-red)]">{errors.age_years}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-[var(--text-color)]">Gender</label>
                    <div className="flex gap-4">
                      <label className={`flex-1 p-3 border rounded-lg text-center cursor-pointer transition-colors ${formData.gender === "1" ? "border-[var(--interactive-teal)] bg-[var(--interactive-teal)]/10 text-[var(--interactive-teal)] font-bold" : "border-[var(--border-color)] text-[var(--text-muted)]"}`}>
                        <input type="radio" className="hidden" name="gender" value="1" checked={formData.gender === "1"} onChange={e => handleChange("gender", e.target.value)} />
                        Female
                      </label>
                      <label className={`flex-1 p-3 border rounded-lg text-center cursor-pointer transition-colors ${formData.gender === "2" ? "border-[var(--interactive-teal)] bg-[var(--interactive-teal)]/10 text-[var(--interactive-teal)] font-bold" : "border-[var(--border-color)] text-[var(--text-muted)]"}`}>
                        <input type="radio" className="hidden" name="gender" value="2" checked={formData.gender === "2"} onChange={e => handleChange("gender", e.target.value)} />
                        Male
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-[var(--text-color)]">Height (cm)</label>
                      <input 
                        type="number" 
                        className="w-full p-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg outline-none focus:border-[var(--interactive-teal)]"
                        value={formData.height}
                        onChange={e => handleChange("height", e.target.value)}
                      />
                      {errors.height && <p className="text-xs text-[var(--accent-red)]">{errors.height}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-[var(--text-color)]">Weight (kg)</label>
                      <input 
                        type="number" 
                        className="w-full p-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg outline-none focus:border-[var(--interactive-teal)]"
                        value={formData.weight}
                        onChange={e => handleChange("weight", e.target.value)}
                      />
                      {errors.weight && <p className="text-xs text-[var(--accent-red)]">{errors.weight}</p>}
                    </div>
                  </div>
                </>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-[var(--text-color)]">Systolic BP (ap_hi)</label>
                      <input 
                        type="number" 
                        className="w-full p-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg outline-none focus:border-[var(--interactive-teal)]"
                        value={formData.ap_hi}
                        onChange={e => handleChange("ap_hi", e.target.value)}
                      />
                      {errors.ap_hi && <p className="text-xs text-[var(--accent-red)]">{errors.ap_hi}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-[var(--text-color)]">Diastolic BP (ap_lo)</label>
                      <input 
                        type="number" 
                        className="w-full p-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg outline-none focus:border-[var(--interactive-teal)]"
                        value={formData.ap_lo}
                        onChange={e => handleChange("ap_lo", e.target.value)}
                      />
                      {errors.ap_lo && <p className="text-xs text-[var(--accent-red)]">{errors.ap_lo}</p>}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-[var(--text-color)]">Cholesterol</label>
                    <select 
                      className="w-full p-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg outline-none focus:border-[var(--interactive-teal)]"
                      value={formData.cholesterol}
                      onChange={e => handleChange("cholesterol", e.target.value)}
                    >
                      <option value="1">Normal</option>
                      <option value="2">Above Normal</option>
                      <option value="3">Well Above Normal</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-[var(--text-color)]">Glucose</label>
                    <select 
                      className="w-full p-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg outline-none focus:border-[var(--interactive-teal)]"
                      value={formData.gluc}
                      onChange={e => handleChange("gluc", e.target.value)}
                    >
                      <option value="1">Normal</option>
                      <option value="2">Above Normal</option>
                      <option value="3">Well Above Normal</option>
                    </select>
                  </div>
                </>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 border border-[var(--border-color)] rounded-lg cursor-pointer hover:border-[var(--interactive-teal)] transition-colors">
                      <span className="font-semibold">Smoker</span>
                      <input 
                        type="checkbox" 
                        className="w-6 h-6 accent-[var(--interactive-teal)]"
                        checked={formData.smoke}
                        onChange={e => handleChange("smoke", e.target.checked)}
                      />
                    </label>
                    <label className="flex items-center justify-between p-4 border border-[var(--border-color)] rounded-lg cursor-pointer hover:border-[var(--interactive-teal)] transition-colors">
                      <span className="font-semibold">Alcohol Intake</span>
                      <input 
                        type="checkbox" 
                        className="w-6 h-6 accent-[var(--interactive-teal)]"
                        checked={formData.alco}
                        onChange={e => handleChange("alco", e.target.checked)}
                      />
                    </label>
                    <label className="flex items-center justify-between p-4 border border-[var(--border-color)] rounded-lg cursor-pointer hover:border-[var(--interactive-teal)] transition-colors">
                      <span className="font-semibold">Physically Active</span>
                      <input 
                        type="checkbox" 
                        className="w-6 h-6 accent-[var(--interactive-teal)]"
                        checked={formData.active}
                        onChange={e => handleChange("active", e.target.checked)}
                      />
                    </label>
                  </div>
                </>
              )}
            </div>

            {/* Inline Computations displayed on steps 2 and 3 */}
            {step > 1 && (
              <div className="mt-6 p-4 rounded-lg bg-[var(--bg-color)] flex justify-between items-center border border-[var(--border-color)] shadow-[var(--shadow-sm)]">
                <div className="flex flex-col">
                  <span className="text-xs text-[var(--text-muted)] uppercase font-bold">Computed BMI</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{bmi.toFixed(1)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${bmiColor}`}>
                      {bmi < 25 ? "Healthy" : bmi < 30 ? "Overweight" : "Obese"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-xs text-[var(--text-muted)] uppercase font-bold">Pulse Pressure</span>
                  <span className="font-bold text-lg">{pulsePressure} <span className="text-xs font-normal">mmHg</span></span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex justify-between gap-4">
              {step > 1 ? (
                <button 
                  onClick={() => setStep(s => s - 1)}
                  className="px-6 py-3 rounded-[var(--radius-lg)] font-bold text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-[var(--border-color)] transition-colors"
                >
                  Back
                </button>
              ) : <div></div>}
              
              {step < 3 ? (
                <button 
                  onClick={handleNext}
                  className="px-8 py-3 rounded-[var(--radius-lg)] bg-[var(--interactive-teal)] hover:bg-[var(--interactive-hover)] text-white font-bold shadow-[var(--shadow-md)] transition-all hover:scale-105 active:scale-95"
                >
                  Next
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  className="px-8 py-3 rounded-[var(--radius-lg)] bg-[var(--accent-red)] hover:bg-red-600 text-white font-bold shadow-[var(--shadow-md)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  Predict Risk
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </button>
              )}
            </div>
          </div>
      </div>
    </div>
  );
}
