"use client";

import React, { useEffect, useState } from "react";

type ResultProps = {
  inputData: any;
  resultData: any;
  onReset: () => void;
};

const formatProbability = (probability: number): string => {
  const clamped = Math.min(Math.max(probability, 0), 1);
  return (clamped * 100).toFixed(1) + "%";
};

export default function PredictionResult({ inputData, resultData, onReset }: ResultProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small delay to trigger mount animations
    const timer = setTimeout(() => setMounted(true), 100);

    // Validation check for probability range
    const rawProb = resultData.probability !== undefined ? resultData.probability : resultData.risk_percentage;
    if (rawProb < 0 || rawProb > 1) {
      console.warn("Probability out of [0,1] range", rawProb);
    }

    return () => clearTimeout(timer);
  }, [resultData]);

  const isHighRisk = resultData.prediction === 1;
  const riskColor = isHighRisk ? "var(--accent-red)" : "var(--accent-green)";
  const riskBg = isHighRisk ? "bg-[var(--accent-red)]/10" : "bg-[var(--accent-green)]/10";
  
  // Normalize exactly once
  const rawProb = resultData.probability !== undefined ? resultData.probability : resultData.risk_percentage;
  const normalizedProb = rawProb > 1 ? rawProb / 100 : rawProb;
  const percentageStr = formatProbability(normalizedProb);

  // Semicircular SVG Gauge Logic
  // Arc length = PI * r. For r=40, PI*40 ~ 125.6
  const gaugeRadius = 40;
  const gaugeCircumference = Math.PI * gaugeRadius;
  const strokeDashoffset = mounted ? gaugeCircumference - normalizedProb * gaugeCircumference : gaugeCircumference;

  const downloadReport = () => {
    const probClamp = Math.min(Math.max(normalizedProb, 0), 1);
    const formattedReportProb = (probClamp * 100).toFixed(1) + "%";

    const breakdownText = resultData.model_breakdown && resultData.model_breakdown.length > 0
      ? `\nMODEL CONSENSUS BREAKDOWN:\n` + resultData.model_breakdown.map((item: any) => {
          const itemProb = (item.probability * 100).toFixed(1) + "%";
          const itemRisk = item.prediction === 1 ? "HIGH RISK" : "LOW RISK";
          return `- ${item.name}: ${itemRisk} (Probability: ${itemProb})`;
        }).join("\n")
      : "";

    const reportText = `
CARDIOVASCULAR RISK PREDICTION REPORT
---------------------------------------
Date: ${new Date().toLocaleString()}
Risk Level: ${isHighRisk ? "HIGH RISK" : "LOW RISK"}
Risk probability: ${formattedReportProb}
Model Used: ${resultData.model_name}
${breakdownText}

PATIENT PROFILE:
Age: ${inputData.age_years} years
BMI: ${resultData.bmi.toFixed(1)} (${resultData.bmi_category})
Blood Pressure: ${inputData.ap_hi}/${inputData.ap_lo} mmHg
Cholesterol Level: ${inputData.cholesterol === 1 ? 'Normal' : inputData.cholesterol === 2 ? 'Above Normal' : 'Well Above Normal'}
Glucose Level: ${inputData.gluc === 1 ? 'Normal' : inputData.gluc === 2 ? 'Above Normal' : 'Well Above Normal'}
Smoker: ${inputData.smoke ? 'Yes' : 'No'}
Alcohol: ${inputData.alco ? 'Yes' : 'No'}
Active: ${inputData.active ? 'Yes' : 'No'}

ADVICE:
${resultData.advice}
    `.trim();

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cardio_report_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const breakdown = resultData.model_breakdown || [];
  const highRiskCount = breakdown.reduce((acc: number, item: any) => acc + (item.prediction === 1 ? 1 : 0), 0);
  const totalModels = breakdown.length || 5;
  const consensusString = breakdown.length > 0
    ? `${highRiskCount} of ${totalModels} models predict High Risk (${(highRiskCount / totalModels * 100).toFixed(0)}% consensus)`
    : "Ensemble Soft-Voting Prediction";

  return (
    <div className="w-full max-w-[600px] mx-auto animate-[fadeIn_0.5s_ease-out]">
      <div className={`p-8 rounded-[var(--radius-xl)] bg-[var(--surface-color)] border border-[var(--border-color)] shadow-[var(--shadow-lg)] flex flex-col items-center text-center transition-all ${isHighRisk ? 'border-[var(--accent-red)]/50' : 'border-[var(--accent-green)]/50'}`}>
        
        {/* 1. Large Animated Risk Indicator */}
        <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 relative ${riskBg}`}>
          <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${isHighRisk ? 'bg-[var(--accent-red)]' : 'bg-[var(--accent-green)]'}`}></div>
          {isHighRisk ? (
            <svg className="w-16 h-16 text-[var(--accent-red)] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg className="w-16 h-16 text-[var(--accent-green)] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        
        <h2 className={`text-[var(--text-xl)] font-[var(--font-display)] mb-2 ${isHighRisk ? 'text-[var(--accent-red)]' : 'text-[var(--accent-green)]'}`}>
          {isHighRisk ? "⚠ High Cardiovascular Risk Detected" : "✅ Low Cardiovascular Risk"}
        </h2>
        <p className="text-[var(--text-lg)] font-bold mb-8">
          Probability: <span style={{ color: riskColor }}>{percentageStr}</span>
        </p>

        {/* 3. Risk Probability Gauge */}
        <div className="w-full flex flex-col items-center mb-8 relative">
          <svg className="w-48 h-24 overflow-visible" viewBox="0 0 100 50">
            {/* Background track */}
            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="var(--border-color)" strokeWidth="12" strokeLinecap="round" />
            
            {/* Color segments */}
            <path 
              d="M 10 50 A 40 40 0 0 1 90 50" 
              fill="none" 
              stroke="url(#gauge-gradient)" 
              strokeWidth="12" 
              strokeLinecap="round" 
              strokeDasharray={gaugeCircumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
            
            <defs>
              <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--accent-green)" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="var(--accent-red)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute bottom-0 text-[var(--text-xl)] font-bold" style={{ color: riskColor }}>
            {mounted ? (normalizedProb * 100).toFixed(0) : 0}%
          </div>
        </div>

        {/* 4. Model Info Row */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">Model Used:</span>
          <span className="px-3 py-1 bg-[var(--interactive-teal)]/10 text-[var(--interactive-teal)] rounded-full text-sm font-bold border border-[var(--interactive-teal)]/20">
            {resultData.model_name}
          </span>
          <span className="px-3 py-1 bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--text-muted)] rounded-full text-sm font-bold">
            AUC: 0.82
          </span>
        </div>

        {/* Ensemble Model Breakdown */}
        {breakdown.length > 0 && (
          <div className="w-full text-left mb-8 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-5">
            <div className="flex items-center justify-between mb-4 border-b border-[var(--border-color)] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[var(--text-color)]">Ensemble Model Consensus</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{consensusString}</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isHighRisk 
                  ? "bg-[var(--accent-red)]/10 text-[var(--accent-red)] border border-[var(--accent-red)]/20" 
                  : "bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/20"
              }`}>
                {isHighRisk ? "High Risk Alert" : "Low Risk Alert"}
              </span>
            </div>

            <div className="space-y-4">
              {breakdown.map((item: any, idx: number) => {
                const itemIsHigh = item.prediction === 1;
                const itemProbPercent = (item.probability * 100).toFixed(1);
                
                return (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-[var(--text-color)]">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          itemIsHigh 
                            ? "bg-[var(--accent-red)]/10 text-[var(--accent-red)]" 
                            : "bg-[var(--accent-green)]/10 text-[var(--accent-green)]"
                        }`}>
                          {itemIsHigh ? "High Risk" : "Low Risk"}
                        </span>
                        <span className="font-mono font-bold text-[var(--text-muted)]">{itemProbPercent}%</span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          itemIsHigh ? "bg-[var(--accent-red)]" : "bg-[var(--accent-green)]"
                        }`}
                        style={{ width: `${itemProbPercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <hr className="w-full border-[var(--border-color)] mb-8" />

        {/* 2. Summary Grid */}
        <div className="w-full text-left mb-8">
          <h3 className="text-[var(--text-base)] font-bold text-[var(--text-color)] mb-4">Patient Profile Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col p-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-[var(--radius-md)]">
              <span className="text-xs text-[var(--text-muted)] uppercase font-semibold">Age</span>
              <span className="font-bold text-[var(--text-color)]">{inputData.age_years} yrs</span>
            </div>
            <div className="flex flex-col p-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-[var(--radius-md)]">
              <span className="text-xs text-[var(--text-muted)] uppercase font-semibold">BMI</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[var(--text-color)]">{resultData.bmi.toFixed(1)}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-white ${resultData.bmi < 25 ? 'bg-[var(--accent-green)]' : resultData.bmi < 30 ? 'bg-yellow-500' : 'bg-[var(--accent-red)]'}`}>
                  {resultData.bmi_category}
                </span>
              </div>
            </div>
            <div className="flex flex-col p-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-[var(--radius-md)]">
              <span className="text-xs text-[var(--text-muted)] uppercase font-semibold">Blood Pressure</span>
              <span className="font-bold text-[var(--text-color)]">{inputData.ap_hi}/{inputData.ap_lo} mmHg</span>
            </div>
            <div className="flex flex-col p-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-[var(--radius-md)]">
              <span className="text-xs text-[var(--text-muted)] uppercase font-semibold">Cholesterol</span>
              <span className="font-bold text-[var(--text-color)]">{inputData.cholesterol === 1 ? 'Normal' : inputData.cholesterol === 2 ? 'Elevated' : 'High'}</span>
            </div>
            <div className="col-span-2 flex flex-col p-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-[var(--radius-md)]">
              <span className="text-xs text-[var(--text-muted)] uppercase font-semibold mb-1">Lifestyle Factors</span>
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 rounded text-xs font-bold border ${inputData.smoke ? 'border-[var(--accent-red)] text-[var(--accent-red)] bg-[var(--accent-red)]/10' : 'border-[var(--accent-green)] text-[var(--accent-green)] bg-[var(--accent-green)]/10'}`}>
                  {inputData.smoke ? 'Smoker' : 'Non-smoker'}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-bold border ${inputData.alco ? 'border-[var(--accent-red)] text-[var(--accent-red)] bg-[var(--accent-red)]/10' : 'border-[var(--accent-green)] text-[var(--accent-green)] bg-[var(--accent-green)]/10'}`}>
                  {inputData.alco ? 'Drinks Alcohol' : 'No Alcohol'}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-bold border ${!inputData.active ? 'border-[var(--accent-red)] text-[var(--accent-red)] bg-[var(--accent-red)]/10' : 'border-[var(--accent-green)] text-[var(--accent-green)] bg-[var(--accent-green)]/10'}`}>
                  {inputData.active ? 'Physically Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-4">
          <button 
            onClick={onReset}
            className="flex-1 py-3 px-4 border border-[var(--border-color)] rounded-[var(--radius-lg)] text-[var(--text-color)] font-bold hover:bg-[var(--border-color)] transition-colors active:scale-95"
          >
            Check Another Patient
          </button>
          <button 
            onClick={downloadReport}
            className="flex-1 py-3 px-4 bg-[var(--interactive-teal)] hover:bg-[var(--interactive-hover)] text-white rounded-[var(--radius-lg)] font-bold shadow-[var(--shadow-md)] transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download Report
          </button>
        </div>

      </div>
    </div>
  );
}
