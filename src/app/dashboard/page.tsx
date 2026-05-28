"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import HealthTipsCarousel from "@/components/shared/HealthTipsCarousel";
import RouteGuard from "@/components/auth/RouteGuard";
import { getHistory } from "@/lib/api";

export default function DashboardPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getHistory()
      .then((data) => {
        if (active) {
          setHistory(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Failed to load history.");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <RouteGuard>
      <Navbar />

      <main className="max-w-container-max mx-auto px-gutter py-stack-lg flex-1">
        <h1 className="font-headline-lg text-3xl font-extrabold text-on-surface mb-6">Patient Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* History Table */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/30">
                <h2 className="font-headline-md text-lg font-bold text-slate-text">Assessment History</h2>
              </div>
              <div className="p-6">
                {error && (
                  <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                    <span className="material-symbols-outlined text-sm mt-px flex-shrink-0">error</span>
                    <span>{error}</span>
                  </div>
                )}

                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-outline-variant/30">
                      <th className="py-3 text-xs font-bold text-on-surface-variant">Date</th>
                      <th className="py-3 text-xs font-bold text-on-surface-variant">Risk Score</th>
                      <th className="py-3 text-xs font-bold text-on-surface-variant">Status</th>
                      <th className="py-3 text-xs font-bold text-on-surface-variant">Blood Pressure</th>
                      <th className="py-3 text-xs font-bold text-on-surface-variant">BMI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-on-surface-variant text-sm">
                          <div className="flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                            Loading history...
                          </div>
                        </td>
                      </tr>
                    ) : history.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-on-surface-variant text-sm">
                          <span className="material-symbols-outlined text-4xl opacity-40 mb-2 block">database</span>
                          No assessment history found.
                          <a href="/assessment" className="block mt-2 text-primary font-bold hover:underline">
                            Take your first assessment
                          </a>
                        </td>
                      </tr>
                    ) : (
                      history.map((row, idx) => {
                        const isHigh = row.risk_percentage >= 50;
                        return (
                          <tr key={idx} className="border-b border-outline-variant/10 text-sm hover:bg-slate-50/50">
                            <td className="py-4 text-on-surface font-medium">
                              {new Date(row.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-4 text-primary font-semibold">
                              {row.risk_percentage.toFixed(1)}%
                            </td>
                            <td className="py-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                isHigh 
                                  ? "bg-risk-high/10 text-risk-high border-risk-high/10" 
                                  : "bg-risk-low/10 text-risk-low border-risk-low/10"
                              }`}>
                                {row.risk_label}
                              </span>
                            </td>
                            <td className="py-4 text-on-surface-variant">{row.ap_hi}/{row.ap_lo}</td>
                            <td className="py-4 text-on-surface-variant">{row.bmi.toFixed(1)}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <HealthTipsCarousel />
            
            {/* Action Card */}
            <div className="bg-white border border-outline-variant/30 rounded-xl p-6 shadow-sm">
              <h3 className="font-label-md text-sm font-semibold mb-3">Assessment Quick Link</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                Has your blood pressure or weight changed? Reassess your cardiovascular metrics to update your profile.
              </p>
              <a href="/assessment">
                <button className="w-full bg-primary hover:bg-primary-container text-white py-3 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                  New Assessment
                </button>
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </RouteGuard>
  );
}
