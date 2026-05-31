"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopNavBar from "@/components/shared/TopNavBar";
import Footer from "@/components/shared/Footer";
import RouteGuard from "@/components/shared/RouteGuard";

const formatProbability = (probability: number): string => {
  const clamped = Math.min(Math.max(probability, 0), 1);
  return (clamped * 100).toFixed(1) + "%";
};

export default function PredictionResult() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [inputData, setInputData] = useState<any>(null);
  const [resultData, setResultData] = useState<any>(null);

  useEffect(() => {
    const rawResult = sessionStorage.getItem("cormetrics_result");
    const rawInput = sessionStorage.getItem("cormetrics_input");

    if (!rawResult || !rawInput) {
      router.replace("/assess");
      return;
    }

    try {
      const parsedResult = JSON.parse(rawResult);
      setResultData(parsedResult);
      setInputData(JSON.parse(rawInput));
      
      const timer = setTimeout(() => setMounted(true), 100);
      const rawProb = parsedResult.probability !== undefined ? parsedResult.probability : parsedResult.risk_percentage;
      if (rawProb < 0 || rawProb > 1) {
        console.warn("Probability out of [0,1] range", rawProb);
      }
      return () => clearTimeout(timer);
    } catch (e) {
      router.replace("/assess");
    }
  }, [router]);

  if (!resultData || !inputData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isHighRisk = resultData.prediction === 1;
  const rawProb = resultData.probability !== undefined ? resultData.probability : resultData.risk_percentage;
  const normalizedProb = rawProb > 1 ? rawProb / 100 : rawProb;
  const percentageStr = formatProbability(normalizedProb);

  const riskColor = isHighRisk ? "text-risk-high" : "text-risk-low";
  const riskBorder = isHighRisk ? "border-risk-high" : "border-risk-low";
  const riskBg = isHighRisk ? "bg-risk-high" : "bg-risk-low";
  const riskBgLight = isHighRisk ? "bg-risk-high/10" : "bg-risk-low/10";
  
  // Arc length for SVG Gauge (r=40)
  const gaugeRadius = 40;
  const gaugeCircumference = Math.PI * gaugeRadius;
  const strokeDashoffset = mounted ? gaugeCircumference - (normalizedProb * gaugeCircumference) : gaugeCircumference;

  const downloadReport = () => {
    const probClamp = Math.min(Math.max(normalizedProb, 0), 1);
    const formattedReportProb = (probClamp * 100).toFixed(1) + "%";

    const breakdownText = resultData.model_breakdown && resultData.model_breakdown.length > 0
      ? "\nMODEL CONSENSUS BREAKDOWN:\n" + resultData.model_breakdown.map((item: any) => {
          const itemProb = (item.probability * 100).toFixed(1) + "%";
          const itemRisk = item.prediction === 1 ? "HIGH RISK" : "LOW RISK";
          return `- ${item.name}: ${itemRisk} (Probability: ${itemProb})`;
        }).join("\n")
      : "";

    const reportText = `
CARDIOVASCULAR RISK PREDICTION REPORT (CorMetrics)
----------------------------------------------------
Date: ${new Date().toLocaleString()}
Risk Level: ${isHighRisk ? "HIGH RISK" : "LOW RISK"}
Risk probability: ${formattedReportProb}
Model Used: ${resultData.model_name}
${breakdownText}

PATIENT PROFILE:
Age: ${inputData.age_years} years
BMI: ${resultData.bmi?.toFixed(1) || "--"} (${resultData.bmi_category || "--"})
Blood Pressure: ${inputData.ap_hi}/${inputData.ap_lo} mmHg
Cholesterol Level: ${inputData.cholesterol === "1" ? 'Normal' : inputData.cholesterol === "2" ? 'Above Normal' : 'Well Above Normal'}
Glucose Level: ${inputData.gluc === "1" ? 'Normal' : inputData.gluc === "2" ? 'Above Normal' : 'Well Above Normal'}
Smoker: ${inputData.smoke ? 'Yes' : 'No'}
Alcohol: ${inputData.alco ? 'Yes' : 'No'}
Active: ${inputData.active ? 'Yes' : 'No'}

CLINICAL ADVICE:
${resultData.advice}
    `.trim();

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cormetrics_report_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const breakdown = resultData.model_breakdown || [];
  const highRiskCount = breakdown.reduce((acc: number, item: any) => acc + (item.prediction === 1 ? 1 : 0), 0);
  const totalModels = breakdown.length || 5;
  const consensusString = breakdown.length > 0
    ? `${highRiskCount} of ${totalModels} models indicate elevated risk (${(highRiskCount / totalModels * 100).toFixed(0)}% consensus)`
    : "Ensemble Prediction Details";

  return (
    <RouteGuard>
      <div className="bg-background text-on-surface font-body-main selection:bg-teal-accent/30 min-h-screen">
      <style dangerouslySetInnerHTML={{__html: `
        .ecg-grid {
            background-size: 40px 40px;
            background-image: linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
        }
        .glass-panel {
            background: rgba(28, 32, 32, 0.7);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }
      `}} />
      
      <TopNavBar />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 relative flex-grow">
        <div className="absolute inset-0 ecg-grid opacity-10 pointer-events-none -z-10"></div>
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 blur-[120px] rounded-full pointer-events-none -z-10 ${isHighRisk ? 'bg-risk-high/10' : 'bg-risk-low/10'}`}></div>

        <div className="text-center mb-12 animate-[fadeIn_0.5s_ease-out]">
          <span className="font-label-caps text-label-caps text-teal-accent uppercase tracking-widest">Diagnostic Report</span>
          <h1 className="font-headline-page text-[40px] md:text-display-hero mt-2 mb-4">Risk Assessment Results</h1>
          <p className="text-on-surface-variant max-w-2xl mx-auto">Patient ID: <span className="font-mono text-primary">PT-{Math.floor(Math.random() * 100000).toString().padStart(5, '0')}</span> • Processed by Neural Ensemble Engine v4.2</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter max-w-6xl mx-auto">
          
          {/* Main Hero Card (Risk Indicator) */}
          <div className={`lg:col-span-7 glass-panel rounded-[24px] p-8 md:p-12 relative overflow-hidden flex flex-col items-center justify-center text-center ${riskBorder} shadow-2xl`}>
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${riskBg} animate-pulse`}></div>
              <span className="font-label-caps text-[10px] text-on-surface-variant tracking-wider">LIVE STATUS</span>
            </div>
            
            <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 relative ${riskBgLight}`}>
              <div className={`absolute inset-0 rounded-full animate-ping opacity-30 ${riskBg}`}></div>
              {isHighRisk ? (
                <span className="material-symbols-outlined text-[64px] text-risk-high relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              ) : (
                <span className="material-symbols-outlined text-[64px] text-risk-low relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>health_and_safety</span>
              )}
            </div>

            <h2 className={`font-headline-page text-[36px] mb-2 ${riskColor}`}>
              {isHighRisk ? "Elevated Risk Detected" : "Optimal Cardiovascular Health"}
            </h2>
            <p className="text-text-muted mb-10 max-w-md">
              {isHighRisk 
                ? "The predictive model indicates a high probability of cardiovascular event risk within the next 10 years based on provided biometrics." 
                : "The predictive model indicates low probability of cardiovascular event risk. Encourage continued maintenance of healthy lifestyle factors."}
            </p>

            <div className="relative w-full max-w-[300px]">
              <svg className="w-full h-auto overflow-visible" viewBox="0 0 100 50">
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="var(--color-border)" strokeWidth="10" strokeLinecap="round" />
                <path 
                  d="M 10 50 A 40 40 0 0 1 90 50" 
                  fill="none" 
                  stroke="url(#gauge-gradient)" 
                  strokeWidth="10" 
                  strokeLinecap="round" 
                  strokeDasharray={gaugeCircumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
                <defs>
                  <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--color-risk-low)" />
                    <stop offset="50%" stopColor="var(--color-risk-medium)" />
                    <stop offset="100%" stopColor="var(--color-risk-high)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <span className={`text-[48px] font-bold leading-none ${riskColor}`}>
                  {mounted ? (normalizedProb * 100).toFixed(0) : 0}%
                </span>
                <span className="font-label-caps text-[10px] text-on-surface-variant">PROBABILITY</span>
              </div>
            </div>
          </div>

          {/* Right Column: Actions & Summary */}
          <div className="lg:col-span-5 flex flex-col gap-gutter">
            
            {/* Actions Card */}
            <div className="bg-surface-container rounded-[20px] border border-border p-8">
              <h3 className="font-title-card text-primary mb-6">Clinical Actions</h3>
              <div className="space-y-4">
                <button 
                  onClick={downloadReport}
                  className="w-full bg-teal-accent hover:bg-teal-accent/90 text-white py-4 px-6 rounded-xl font-bold flex items-center justify-between group transition-all"
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined">download</span>
                    Download PDF Report
                  </span>
                  <span className="material-symbols-outlined group-hover:translate-y-1 transition-transform">arrow_downward</span>
                </button>
                <button 
                  onClick={() => window.print()}
                  className="w-full bg-surface-container-low hover:bg-surface-container-high border border-border text-on-surface py-4 px-6 rounded-xl font-bold flex items-center justify-between transition-all"
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined">print</span>
                    Print Summary
                  </span>
                </button>
                <button 
                  onClick={() => router.push("/assess")}
                  className="w-full bg-surface-container-low hover:bg-surface-container-high border border-border text-on-surface py-4 px-6 rounded-xl font-bold flex items-center justify-between transition-all"
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined">person_add</span>
                    New Patient Assessment
                  </span>
                </button>
              </div>
            </div>

            {/* AI Breakdown Card */}
            {breakdown.length > 0 && (
              <div className="bg-surface-container rounded-[20px] border border-border p-8 flex-1">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-title-card text-primary">Ensemble Consensus</h3>
                    <p className="text-metadata text-text-muted mt-1">{consensusString}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold border ${isHighRisk ? 'border-risk-high/30 bg-risk-high/10 text-risk-high' : 'border-risk-low/30 bg-risk-low/10 text-risk-low'}`}>
                    {resultData.model_name}
                  </div>
                </div>

                <div className="space-y-5">
                  {breakdown.map((item: any, idx: number) => {
                    const itemIsHigh = item.prediction === 1;
                    const itemProbPercent = (item.probability * 100).toFixed(1);
                    return (
                      <div key={idx} className="group">
                        <div className="flex justify-between text-xs mb-2">
                          <span className="font-semibold text-on-surface group-hover:text-teal-accent transition-colors">{item.name}</span>
                          <span className={`font-mono font-bold ${itemIsHigh ? 'text-risk-high' : 'text-risk-low'}`}>{itemProbPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-container-lowest rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${itemIsHigh ? 'bg-risk-high' : 'bg-risk-low'}`}
                            style={{ width: `${mounted ? itemProbPercent : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Full Width Profile Summary Grid */}
          <div className="col-span-1 lg:col-span-12 bg-surface-container border border-border rounded-[20px] p-8 overflow-hidden relative">
            <div className="absolute -right-12 -top-12 opacity-5 pointer-events-none">
              <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>assignment_ind</span>
            </div>
            
            <h3 className="font-title-card text-primary mb-6">Biometric Inputs</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-border/50">
                <span className="font-label-caps text-[10px] text-on-surface-variant block mb-1">AGE / GENDER</span>
                <span className="text-lg font-bold text-primary">{inputData.age_years} <span className="text-sm font-normal text-text-muted capitalize">{inputData.gender === "2" ? "M" : "F"}</span></span>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-border/50">
                <span className="font-label-caps text-[10px] text-on-surface-variant block mb-1">BMI</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">{resultData.bmi?.toFixed(1) || "--"}</span>
                  {resultData.bmi_category && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${resultData.bmi < 25 ? 'bg-risk-low/20 text-risk-low' : resultData.bmi < 30 ? 'bg-risk-medium/20 text-risk-medium' : 'bg-risk-high/20 text-risk-high'}`}>
                      {resultData.bmi_category.split(' ')[0]}
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-border/50">
                <span className="font-label-caps text-[10px] text-on-surface-variant block mb-1">BLOOD PRESSURE</span>
                <span className="text-lg font-bold text-primary">{inputData.ap_hi}/{inputData.ap_lo}</span>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-border/50">
                <span className="font-label-caps text-[10px] text-on-surface-variant block mb-1">CHOLESTEROL / GLUCOSE</span>
                <span className="text-sm font-bold text-primary block leading-tight truncate">C: {inputData.cholesterol === "1" ? 'Norm' : inputData.cholesterol === "2" ? 'Elev' : 'High'}</span>
                <span className="text-sm font-bold text-primary block leading-tight mt-1 truncate">G: {inputData.gluc === "1" ? 'Norm' : inputData.gluc === "2" ? 'Elev' : 'High'}</span>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-border/50 col-span-2 md:col-span-4 lg:col-span-1">
                <span className="font-label-caps text-[10px] text-on-surface-variant block mb-2">LIFESTYLE</span>
                <div className="flex flex-wrap gap-1.5">
                <span className={`text-[10px] px-2 py-1 rounded border ${inputData.smoke ? 'border-risk-high/30 text-risk-high' : 'border-risk-low/30 text-risk-low'}`}>Smoke</span>
                  <span className={`text-[10px] px-2 py-1 rounded border ${inputData.alco ? 'border-risk-high/30 text-risk-high' : 'border-risk-low/30 text-risk-low'}`}>Alcohol</span>
                  <span className={`text-[10px] px-2 py-1 rounded border ${!inputData.active ? 'border-risk-high/30 text-risk-high' : 'border-risk-low/30 text-risk-low'}`}>Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Clinical Advice & Risk Drivers */}
          <div className="col-span-1 lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-gutter mt-8">
            
            {/* Clinical Advice Card */}
            <div className="bg-surface-container border border-border rounded-[20px] p-8">
              <h3 className="font-title-card text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-accent">healing</span>
                Lifestyle Guidance
              </h3>
              {resultData.advice ? (
                <div className="text-on-surface-variant leading-relaxed">
                  <p className="whitespace-pre-line">{resultData.advice}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-text-muted">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-20">hourglass_empty</span>
                  <p>No specific guidance available.</p>
                </div>
              )}
            </div>

            {/* Critical Risk Drivers Card */}
            <div className="bg-surface-container border border-border rounded-[20px] p-8">
              <h3 className="font-title-card text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-risk-high">trending_up</span>
                Critical Risk Drivers
              </h3>
              {resultData.feature_impacts && Object.keys(resultData.feature_impacts).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(resultData.feature_impacts)
                    .sort(([, a], [, b]) => Math.abs(b as number) - Math.abs(a as number))
                    .slice(0, 5)
                    .map(([feature, impact], idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-on-surface capitalize">{feature.replace('_', ' ')}</span>
                        <span className="text-text-muted">{(Number(impact) * 100).toFixed(1)}% impact</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container-lowest rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-risk-high opacity-80"
                          style={{ width: `${Math.min(Math.abs(Number(impact)) * 100 * 2, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-text-muted">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-20">analytics</span>
                  <p>Feature importance data not available for this model.</p>
                  <p className="text-xs mt-1">(Mapped to feature_impacts if provided)</p>
                </div>
              )}
            </div>
            
          </div>

        </div>
      </main>

      <Footer />
    </div>
    </RouteGuard>
  );
}
