export default function AssessmentPreview() {
  return (
    <section className="py-section-padding bg-surface-container-low">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Form Side */}
          <div className="lg:w-2/3 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-outline-variant/20">
            <h3 className="font-headline-lg text-[24px] font-bold text-slate-text mb-8">Cardio Assessment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="font-label-md text-sm font-semibold text-on-surface">Age</label>
                <input
                  className="w-full p-3 rounded-lg border border-outline focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-surface"
                  placeholder="e.g., 45"
                  type="number"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-md text-sm font-semibold text-on-surface">Height (cm)</label>
                <input
                  className="w-full p-3 rounded-lg border border-outline focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-surface"
                  placeholder="e.g., 175"
                  type="number"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-md text-sm font-semibold text-on-surface">Systolic BP</label>
                <input
                  className="w-full p-3 rounded-lg border border-outline focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-surface"
                  placeholder="e.g., 120"
                  type="number"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-md text-sm font-semibold text-on-surface">Diastolic BP</label>
                <input
                  className="w-full p-3 rounded-lg border border-outline focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-surface"
                  placeholder="e.g., 80"
                  type="number"
                  disabled
                />
              </div>
              <div className="md:col-span-2 space-y-4">
                <label className="font-label-md text-sm font-semibold text-on-surface">Lifestyle Factors</label>
                <div className="flex flex-wrap gap-3">
                  <button className="px-6 py-2 rounded-full border border-primary bg-primary/10 text-primary font-label-sm text-xs font-medium cursor-not-allowed" disabled>
                    Non-smoker
                  </button>
                  <button className="px-6 py-2 rounded-full border border-outline text-on-surface-variant font-label-sm text-xs font-medium hover:bg-surface-container transition-all cursor-not-allowed" disabled>
                    Active Lifestyle
                  </button>
                  <button className="px-6 py-2 rounded-full border border-outline text-on-surface-variant font-label-sm text-xs font-medium hover:bg-surface-container transition-all cursor-not-allowed" disabled>
                    Low Stress
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Live Insight Sidebar */}
          <div className="lg:w-1/3 flex flex-col gap-6">
            <div className="glass-panel p-8 rounded-2xl shadow-xl space-y-8 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-label-md text-xs font-bold text-primary uppercase tracking-widest mb-6">Live Metrics</h4>
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-outline-variant/30">
                    <span className="font-body-md text-sm text-on-surface-variant">BMI</span>
                    <span className="font-headline-md text-lg font-bold text-on-surface">24.5</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-outline-variant/30">
                    <span className="font-body-md text-sm text-on-surface-variant">Pulse Pressure</span>
                    <span className="font-headline-md text-lg font-bold text-secondary">40</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-outline-variant/30">
                    <span className="font-body-md text-sm text-on-surface-variant">MAP</span>
                    <span className="font-headline-md text-lg font-bold text-on-surface">93.3</span>
                  </div>
                </div>
              </div>
              <div className="bg-risk-low/10 p-4 rounded-xl flex items-center gap-3 border border-risk-low/20 mt-6">
                <span className="material-symbols-outlined text-risk-low">check_circle</span>
                <span className="font-label-md text-xs font-semibold text-risk-low">Currently within healthy ranges</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
