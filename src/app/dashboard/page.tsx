"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

// --- Mock Data ---
const MOCK_KPIS = {
  total: 1248,
  highRisk: 432,
  lowRisk: 816,
  avgProb: 47.3
};

const MOCK_MODELS = [
  { name: "Logistic Regression", accuracy: 71.5 },
  { name: "SVM", accuracy: 72.8 },
  { name: "Decision Tree", accuracy: 69.4 },
  { name: "KNN", accuracy: 68.2 },
  { name: "Random Forest", accuracy: 73.6 },
].sort((a, b) => b.accuracy - a.accuracy);

const MOCK_RISK_FACTORS = [
  { feature: "Systolic BP (ap_hi)", impact: 85 },
  { feature: "Age (age_years)", impact: 78 },
  { feature: "Cholesterol", impact: 65 },
  { feature: "BMI", impact: 52 },
  { feature: "Pulse Pressure", impact: 45 },
];

const MOCK_RECENT = [
  { id: "P-10492", age: 54, bmi: 28.4, bp: "140/90", riskLabel: "HIGH RISK", prob: 82.5, time: "2 mins ago" },
  { id: "P-10491", age: 42, bmi: 24.1, bp: "120/80", riskLabel: "LOW RISK", prob: 15.2, time: "15 mins ago" },
  { id: "P-10490", age: 61, bmi: 31.0, bp: "135/85", riskLabel: "HIGH RISK", prob: 76.8, time: "1 hour ago" },
  { id: "P-10489", age: 35, bmi: 22.5, bp: "115/75", riskLabel: "LOW RISK", prob: 8.4, time: "3 hours ago" },
  { id: "P-10488", age: 49, bmi: 26.8, bp: "128/82", riskLabel: "LOW RISK", prob: 34.1, time: "5 hours ago" },
];
// -----------------

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--bg-color)] animate-[fadeIn_0.3s_ease-out]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 mt-16 space-y-12">
        {/* 2. KPI Cards Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total */}
          <div className="bg-[var(--surface-color)] p-6 rounded-[var(--radius-lg)] border border-[var(--border-color)] shadow-[var(--shadow-sm)] flex flex-col gap-2">
            <div className="flex justify-between items-center text-[var(--text-muted)]">
              <span className="font-semibold text-sm uppercase tracking-wider">Total Predictions</span>
              <svg className="w-6 h-6 text-[var(--interactive-teal)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <span className="text-[var(--text-2xl)] font-bold text-[var(--text-color)]">{MOCK_KPIS.total.toLocaleString()}</span>
            <span className="text-xs text-[var(--accent-green)] font-bold flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              12% this week
            </span>
          </div>
          
          {/* High Risk */}
          <div className="bg-[var(--surface-color)] p-6 rounded-[var(--radius-lg)] border border-[var(--accent-red)]/30 shadow-[var(--shadow-sm)] flex flex-col gap-2">
            <div className="flex justify-between items-center text-[var(--text-muted)]">
              <span className="font-semibold text-sm uppercase tracking-wider">High Risk Count</span>
              <svg className="w-6 h-6 text-[var(--accent-red)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <span className="text-[var(--text-2xl)] font-bold text-[var(--accent-red)]">{MOCK_KPIS.highRisk.toLocaleString()}</span>
            <span className="text-xs text-[var(--text-muted)] font-bold">
              {((MOCK_KPIS.highRisk / MOCK_KPIS.total) * 100).toFixed(1)}% of total
            </span>
          </div>

          {/* Low Risk */}
          <div className="bg-[var(--surface-color)] p-6 rounded-[var(--radius-lg)] border border-[var(--accent-green)]/30 shadow-[var(--shadow-sm)] flex flex-col gap-2">
            <div className="flex justify-between items-center text-[var(--text-muted)]">
              <span className="font-semibold text-sm uppercase tracking-wider">Low Risk Count</span>
              <svg className="w-6 h-6 text-[var(--accent-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <span className="text-[var(--text-2xl)] font-bold text-[var(--accent-green)]">{MOCK_KPIS.lowRisk.toLocaleString()}</span>
            <span className="text-xs text-[var(--text-muted)] font-bold">
              {((MOCK_KPIS.lowRisk / MOCK_KPIS.total) * 100).toFixed(1)}% of total
            </span>
          </div>

          {/* Avg Risk */}
          <div className="bg-[var(--surface-color)] p-6 rounded-[var(--radius-lg)] border border-[var(--border-color)] shadow-[var(--shadow-sm)] flex flex-col gap-2">
            <div className="flex justify-between items-center text-[var(--text-muted)]">
              <span className="font-semibold text-sm uppercase tracking-wider">Avg Probability</span>
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="text-[var(--text-2xl)] font-bold text-[var(--text-color)]">{MOCK_KPIS.avgProb}%</span>
            <span className="text-xs text-yellow-500 font-bold flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              2.1% this week
            </span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3. Model Performance Section */}
          <section className="bg-[var(--surface-color)] p-6 rounded-[var(--radius-xl)] border border-[var(--border-color)] shadow-[var(--shadow-md)]">
            <h2 className="text-[var(--text-lg)] font-bold text-[var(--text-color)] mb-6">Model Performance Metrics</h2>
            <div className="space-y-6">
              {MOCK_MODELS.map((model, idx) => (
                <div key={model.name} className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className={idx === 0 ? "text-[var(--interactive-teal)]" : "text-[var(--text-color)]"}>
                      {model.name} {idx === 0 && "(Best)"}
                    </span>
                    <span className="text-[var(--text-muted)]">{model.accuracy.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-[var(--bg-color)] h-3 rounded-full overflow-hidden border border-[var(--border-color)]">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${idx === 0 ? "bg-[var(--interactive-teal)]" : "bg-[var(--border-color)]"}`}
                      style={{ width: `${model.accuracy}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Top Risk Factors */}
          <section className="bg-[var(--surface-color)] p-6 rounded-[var(--radius-xl)] border border-[var(--border-color)] shadow-[var(--shadow-md)]">
            <h2 className="text-[var(--text-lg)] font-bold text-[var(--text-color)] mb-6">Top Predictive Features</h2>
            <div className="space-y-6">
              {MOCK_RISK_FACTORS.map((factor) => (
                <div key={factor.feature} className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-[var(--text-color)]">{factor.feature}</span>
                    <span className="text-[var(--accent-red)]">Impact: {factor.impact}</span>
                  </div>
                  <div className="w-full bg-[var(--bg-color)] h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-[var(--accent-red)] transition-all duration-1000 ease-out"
                      style={{ width: `${factor.impact}%`, opacity: factor.impact / 100 }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 5. Recent Predictions Table */}
        <section className="bg-[var(--surface-color)] rounded-[var(--radius-xl)] border border-[var(--border-color)] shadow-[var(--shadow-md)] overflow-hidden">
          <div className="p-6 border-b border-[var(--border-color)]">
            <h2 className="text-[var(--text-lg)] font-bold text-[var(--text-color)]">Recent Predictions</h2>
          </div>
          
          {/* Desktop Table View */}
          <div className="hidden md:block w-full overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[var(--bg-color)] text-[var(--text-muted)] border-b border-[var(--border-color)] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Patient ID</th>
                  <th className="px-6 py-4 font-semibold">Age</th>
                  <th className="px-6 py-4 font-semibold">BMI</th>
                  <th className="px-6 py-4 font-semibold">BP</th>
                  <th className="px-6 py-4 font-semibold">Risk Level</th>
                  <th className="px-6 py-4 font-semibold">Probability</th>
                  <th className="px-6 py-4 font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {MOCK_RECENT.map((row, idx) => (
                  <tr key={row.id} className={idx % 2 === 0 ? "bg-[var(--surface-color)]" : "bg-[var(--bg-color)]/30 hover:bg-[var(--border-color)]/20 transition-colors"}>
                    <td className="px-6 py-4 font-bold text-[var(--text-color)]">{row.id}</td>
                    <td className="px-6 py-4 text-[var(--text-muted)]">{row.age} yrs</td>
                    <td className="px-6 py-4 text-[var(--text-muted)]">{row.bmi}</td>
                    <td className="px-6 py-4 text-[var(--text-muted)]">{row.bp}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.riskLabel === 'HIGH RISK' ? 'bg-[var(--accent-red)]/10 text-[var(--accent-red)] border border-[var(--accent-red)]/30' : 'bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/30'}`}>
                        {row.riskLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[var(--text-color)]">{row.prob}%</td>
                    <td className="px-6 py-4 text-[var(--text-muted)]">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col divide-y divide-[var(--border-color)]">
            {MOCK_RECENT.map((row) => (
              <div key={row.id} className="p-4 space-y-3 bg-[var(--surface-color)]">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[var(--text-color)]">{row.id}</span>
                  <span className="text-xs text-[var(--text-muted)]">{row.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.riskLabel === 'HIGH RISK' ? 'bg-[var(--accent-red)]/10 text-[var(--accent-red)] border border-[var(--accent-red)]/30' : 'bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/30'}`}>
                    {row.riskLabel}
                  </span>
                  <span className="font-bold text-[var(--text-color)]">{row.prob}% Prob</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm text-[var(--text-muted)] bg-[var(--bg-color)] p-2 rounded-lg text-center">
                  <div>
                    <div className="text-xs uppercase font-semibold">Age</div>
                    <div>{row.age}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase font-semibold">BMI</div>
                    <div>{row.bmi}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase font-semibold">BP</div>
                    <div>{row.bp}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
