"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatProbability } from "@/lib/utils";
import TopNavBar from "@/components/shared/TopNavBar";
import RouteGuard from "@/components/shared/RouteGuard";
import { fetchDashboardStats, DashboardStats } from "@/lib/api";

function formatRelativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    if (isNaN(date.getTime())) return "Unknown time";
    
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? "s" : ""} ago`;
    if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
    return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  } catch {
    return dateStr;
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [animated, setAnimated] = useState<boolean>(false);

  const loadData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    
    setError(null);
    try {
      const data = await fetchDashboardStats();
      setStats(data);
      // Trigger animations shortly after data loads
      setTimeout(() => setAnimated(true), 150);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while loading dashboard statistics.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRetry = () => {
    loadData();
  };
  const handleRefresh = () => {
    setAnimated(false);
    loadData(true);
  };

  return (
    <RouteGuard>
    <div className="min-h-screen bg-[var(--bg-color)] animate-[fadeIn_0.3s_ease-out]">
      <TopNavBar />

      {/* Inject custom Shimmer CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-bg {
          background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
        }
      `}} />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 mt-16 space-y-12">
        
        {/* Header and Refresh Area */}
        <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-6">
          <div>
            <h1 className="text-[var(--text-xl)] font-[var(--font-display)] text-[var(--text-color)]">
              Prediction Analytics Dashboard
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Real-time monitoring of machine learning model execution and predictive factors.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading || refreshing}
              className="p-3 bg-[var(--surface-color)] hover:bg-[var(--border-color)] text-[var(--text-color)] border border-[var(--border-color)] rounded-full transition-all active:scale-90 disabled:opacity-50"
              title="Refresh Stats"
            >
              <svg 
                className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H16" />
              </svg>
            </button>
            <button 
              onClick={() => router.push("/assess")}
              className="px-6 py-3 bg-[var(--interactive-teal)] hover:bg-[var(--interactive-hover)] text-white rounded-[var(--radius-full)] font-bold shadow-[var(--shadow-md)] transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              New Prediction
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-white p-4 rounded-[var(--radius-lg)] flex justify-between items-center shadow-lg animate-[slideIn_0.3s_ease-out]">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-bold text-red-400">Database statistics loading failed</p>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">{error}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleRetry}
                className="px-4 py-1.5 bg-red-500 text-white rounded-[var(--radius-sm)] font-bold text-sm hover:bg-red-600 transition-colors"
              >
                Retry
              </button>
              <button 
                onClick={() => setError(null)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* 2. KPI Cards Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            // Shimmer KPIs
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-[var(--surface-color)] p-6 rounded-[var(--radius-lg)] border border-[var(--border-color)] shadow-[var(--shadow-sm)] flex flex-col gap-3 min-h-[120px]">
                <div className="w-32 h-4 shimmer-bg rounded"></div>
                <div className="w-20 h-8 shimmer-bg rounded"></div>
                <div className="w-16 h-3 shimmer-bg rounded"></div>
              </div>
            ))
          ) : (
            <>
              {/* Total Predictions */}
              <div className="bg-[var(--surface-color)] p-6 rounded-[var(--radius-lg)] border border-[var(--border-color)] shadow-[var(--shadow-sm)] flex flex-col gap-2">
                <div className="flex justify-between items-center text-[var(--text-muted)]">
                  <span className="font-semibold text-xs uppercase tracking-wider">Total Predictions</span>
                  <svg className="w-5 h-5 text-[var(--interactive-teal)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-[var(--text-2xl)] font-bold text-[var(--text-color)] font-mono tabular-nums">
                  {stats?.kpis.total_predictions.toLocaleString()}
                </span>
                <span className="text-xs text-[var(--text-muted)] font-medium">All recorded assessments</span>
              </div>
              
              {/* High Risk Count */}
              <div className="bg-[var(--surface-color)] p-6 rounded-[var(--radius-lg)] border border-[#ef4444]/20 shadow-[var(--shadow-sm)] flex flex-col gap-2">
                <div className="flex justify-between items-center text-[var(--text-muted)]">
                  <span className="font-semibold text-xs uppercase tracking-wider">High Risk Count</span>
                  <svg className="w-5 h-5 text-[#ef4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <span className="text-[var(--text-2xl)] font-bold text-[#ef4444] font-mono tabular-nums">
                  {stats?.kpis.high_risk_count.toLocaleString()}
                </span>
                <span className="text-xs text-[var(--text-muted)] font-medium">
                  {stats?.kpis.total_predictions ? ((stats.kpis.high_risk_count / stats.kpis.total_predictions) * 100).toFixed(1) : "0.0"}% of total
                </span>
              </div>

              {/* Low Risk Count */}
              <div className="bg-[var(--surface-color)] p-6 rounded-[var(--radius-lg)] border border-[#22c55e]/20 shadow-[var(--shadow-sm)] flex flex-col gap-2">
                <div className="flex justify-between items-center text-[var(--text-muted)]">
                  <span className="font-semibold text-xs uppercase tracking-wider">Low Risk Count</span>
                  <svg className="w-5 h-5 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-[var(--text-2xl)] font-bold text-[#22c55e] font-mono tabular-nums">
                  {stats?.kpis.low_risk_count.toLocaleString()}
                </span>
                <span className="text-xs text-[var(--text-muted)] font-medium">
                  {stats?.kpis.total_predictions ? ((stats.kpis.low_risk_count / stats.kpis.total_predictions) * 100).toFixed(1) : "0.0"}% of total
                </span>
              </div>

              {/* Average Probability */}
              <div className="bg-[var(--surface-color)] p-6 rounded-[var(--radius-lg)] border border-[var(--border-color)] shadow-[var(--shadow-sm)] flex flex-col gap-2">
                <div className="flex justify-between items-center text-[var(--text-muted)]">
                  <span className="font-semibold text-xs uppercase tracking-wider">Avg Risk Probability</span>
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-[var(--text-2xl)] font-bold text-[var(--text-color)] font-mono tabular-nums">
                  {stats ? (stats.kpis.avg_risk_probability * 100).toFixed(1) : "0.0"}%
                </span>
                <span className="text-xs text-[var(--text-muted)] font-medium">Mean probability distribution</span>
              </div>
            </>
          )}
        </section>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Model Performance */}
          <section className="bg-[var(--surface-color)] p-6 sm:p-8 rounded-[var(--radius-xl)] border border-[var(--border-color)] shadow-[var(--shadow-md)]">
            <h2 className="text-[var(--text-lg)] font-bold text-[var(--text-color)] mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--interactive-teal)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Model Execution & Accuracy
            </h2>
            
            {loading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between"><div className="w-24 h-4 shimmer-bg rounded"></div><div className="w-8 h-4 shimmer-bg rounded"></div></div>
                    <div className="w-full h-3 shimmer-bg rounded-full"></div>
                  </div>
                ))}
              </div>
            ) : !stats || stats.models.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-[var(--text-muted)]">
                <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                </svg>
                <p>No model execution statistics available yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {stats.models.map((model, idx) => (
                  <div key={model.name} className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <span className={idx === 0 ? "text-[var(--interactive-teal)]" : "text-[var(--text-color)]"}>
                        {model.name} {idx === 0 && "(Best)"}
                      </span>
                      <span className="text-[var(--text-muted)] font-mono">{formatProbability(model.accuracy)}</span>
                    </div>
                    <div className="w-full bg-[var(--bg-color)] h-3 rounded-full overflow-hidden border border-[var(--border-color)]">
                      <div 
                        className={`h-full rounded-full transition-all duration-[800ms] ease-out ${idx === 0 ? "bg-[var(--interactive-teal)]" : "bg-slate-600"}`}
                        style={{ width: animated ? `${model.accuracy * 100}%` : "0%" }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Risk Factors Pearson Importance */}
          <section className="bg-[var(--surface-color)] p-6 sm:p-8 rounded-[var(--radius-xl)] border border-[var(--border-color)] shadow-[var(--shadow-md)]">
            <h2 className="text-[var(--text-lg)] font-bold text-[var(--text-color)] mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#f97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Predictive Feature Correlation (Pearson)
            </h2>

            {loading ? (
              <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between"><div className="w-24 h-4 shimmer-bg rounded"></div><div className="w-8 h-4 shimmer-bg rounded"></div></div>
                    <div className="w-full h-3 shimmer-bg rounded-full"></div>
                  </div>
                ))}
              </div>
            ) : !stats || stats.risk_factors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-[var(--text-muted)]">
                <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                </svg>
                <p>No feature impact metrics calculated yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {stats.risk_factors.map((factor) => {
                  // Map database feature keys to friendly names
                  const friendlyNames: Record<string, string> = {
                    ap_hi: "Systolic BP (ap_hi)",
                    age_years: "Patient Age (age)",
                    bmi: "Body Mass Index (BMI)",
                    cholesterol: "Cholesterol level",
                    gluc: "Glucose level",
                    pulse_pressure: "Pulse Pressure (ap_hi - ap_lo)"
                  };
                  const label = friendlyNames[factor.feature] || factor.feature;

                  return (
                    <div key={factor.feature} className="space-y-2">
                      <div className="flex justify-between items-center text-sm font-semibold">
                        <span className="text-[var(--text-color)]">{label}</span>
                        <span className="text-[#f97316] font-mono">r: {factor.importance.toFixed(3)}</span>
                      </div>
                      <div className="w-full bg-[var(--bg-color)] h-3 rounded-full overflow-hidden border border-[var(--border-color)]">
                        <div 
                          className="h-full rounded-full bg-[#f97316] transition-all duration-[800ms] ease-out"
                          style={{ width: animated ? `${factor.importance * 100}%` : "0%", opacity: 0.3 + (factor.importance * 0.7) }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Recent Predictions Table / Cards */}
        <section className="bg-[var(--surface-color)] rounded-[var(--radius-xl)] border border-[var(--border-color)] shadow-[var(--shadow-md)] overflow-hidden">
          <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
            <h2 className="text-[var(--text-lg)] font-bold text-[var(--text-color)]">
              Recent Patient Transactions
            </h2>
            <span className="text-xs bg-[var(--bg-color)] px-3 py-1 border border-[var(--border-color)] rounded-full text-[var(--text-muted)] font-semibold font-mono">
              Live SQLite Database
            </span>
          </div>

          {loading ? (
            // Shimmer Rows
            <div className="w-full p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-1 h-6 shimmer-bg rounded"></div>
                  <div className="flex-1 h-6 shimmer-bg rounded"></div>
                  <div className="flex-1 h-6 shimmer-bg rounded"></div>
                  <div className="flex-1 h-6 shimmer-bg rounded"></div>
                </div>
              ))}
            </div>
          ) : !stats || stats.recent.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-16 text-[var(--text-muted)] bg-[var(--surface-color)]">
              <svg className="w-16 h-16 text-[#ef4444] animate-pulse mb-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <p className="font-bold text-lg text-[var(--text-color)]">No predictions logged yet</p>
              <p className="text-sm mt-1">Complete your first patient checkup in the Predict screen.</p>
              <button 
                onClick={() => router.push("/assess")}
                className="mt-6 px-6 py-2.5 bg-[var(--interactive-teal)] hover:bg-[var(--interactive-hover)] text-white font-bold rounded-full text-sm transition-all"
              >
                Assess Patient Now
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block w-full overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[var(--bg-color)] text-[var(--text-muted)] border-b border-[var(--border-color)] uppercase tracking-wider text-xs">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Transaction ID</th>
                      <th className="px-6 py-4 font-semibold">Age</th>
                      <th className="px-6 py-4 font-semibold">BMI</th>
                      <th className="px-6 py-4 font-semibold">BP (Systolic/Diastolic)</th>
                      <th className="px-6 py-4 font-semibold">Risk Level</th>
                      <th className="px-6 py-4 font-semibold">Probability</th>
                      <th className="px-6 py-4 font-semibold">Model Pipeline</th>
                      <th className="px-6 py-4 font-semibold">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {stats.recent.map((row, idx) => {
                      // Color coding based on probability thresholds
                      const p = row.risk_probability;
                      const probColor = p > 0.7 ? "text-[#ef4444]" : p >= 0.4 ? "text-yellow-500" : "text-[#22c55e]";

                      return (
                        <tr 
                          key={row.id} 
                          className={idx % 2 === 0 ? "bg-[var(--surface-color)]" : "bg-[var(--bg-color)]/30 hover:bg-[var(--border-color)]/20 transition-colors"}
                        >
                          <td className="px-6 py-4 font-bold text-[var(--text-color)] font-mono">TX-{row.id}</td>
                          <td className="px-6 py-4 text-[var(--text-muted)] font-mono">{row.age_years} yrs</td>
                          <td className="px-6 py-4 text-[var(--text-muted)] font-mono">{row.bmi.toFixed(1)}</td>
                          <td className="px-6 py-4 text-[var(--text-muted)] font-mono">{row.ap_hi}/{row.ap_lo} mmHg</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.risk_level === "HIGH" ? "bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30" : "bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30"}`}>
                              {row.risk_level} RISK
                            </span>
                          </td>
                          <td className={`px-6 py-4 font-bold font-mono ${probColor}`}>{formatProbability(row.risk_probability)}</td>
                          <td className="px-6 py-4 text-xs text-[var(--text-muted)] font-semibold">{row.model_name}</td>
                          <td className="px-6 py-4 text-[var(--text-muted)] text-xs font-medium">{formatRelativeTime(row.created_at)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden flex flex-col divide-y divide-[var(--border-color)]">
                {stats.recent.map((row) => {
                  const p = row.risk_probability;
                  const probColor = p > 0.7 ? "text-[#ef4444]" : p >= 0.4 ? "text-yellow-500" : "text-[#22c55e]";

                  return (
                    <div key={row.id} className="p-5 space-y-3 bg-[var(--surface-color)]">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[var(--text-color)] font-mono text-sm">TX-{row.id}</span>
                        <span className="text-xs text-[var(--text-muted)] font-medium">{formatRelativeTime(row.created_at)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.risk_level === "HIGH" ? "bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30" : "bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30"}`}>
                          {row.risk_level} RISK
                        </span>
                        <span className={`font-bold font-mono text-sm ${probColor}`}>{formatProbability(row.risk_probability)} Prob</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-xs text-[var(--text-muted)] bg-[var(--bg-color)] p-2.5 rounded-lg text-center font-mono">
                        <div>
                          <div className="text-[10px] uppercase font-bold tracking-wider">Age</div>
                          <div className="text-[var(--text-color)] font-semibold mt-0.5">{row.age_years}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-bold tracking-wider">BMI</div>
                          <div className="text-[var(--text-color)] font-semibold mt-0.5">{row.bmi.toFixed(1)}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-bold tracking-wider">BP</div>
                          <div className="text-[var(--text-color)] font-semibold mt-0.5">{row.ap_hi}/{row.ap_lo}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--interactive-teal)]">Model</div>
                          <div className="text-[var(--interactive-teal)] font-bold mt-0.5 truncate max-w-[50px]" title={row.model_name}>
                            {row.model_name.replace("Classifier", "")}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
    </RouteGuard>
  );
}
