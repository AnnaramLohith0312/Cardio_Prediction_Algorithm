export default function ResultPreview() {
  return (
    <section className="py-section-padding bg-surface">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-outline-variant/20 shadow-lg overflow-hidden relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-risk-low/10 text-risk-low px-4 py-2 rounded-full font-label-md text-xs font-semibold border border-risk-low/20">
                <span className="material-symbols-outlined text-sm">shield_moon</span>
                Assessment Complete
              </div>
              <h3 className="font-headline-lg text-[28px] font-bold text-slate-text">Your Cardiac Health Summary</h3>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                Based on your clinical markers, your 10-year risk of cardiovascular event is categorized as <strong>minimal</strong>.
              </p>
              <table className="w-full text-left">
                <thead className="border-b border-outline-variant/30">
                  <tr>
                    <th className="py-4 font-label-md text-xs font-semibold text-on-surface">Marker</th>
                    <th className="py-4 font-label-md text-xs font-semibold text-on-surface text-right">Observation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-outline-variant/10">
                    <td className="py-4 font-body-md text-sm text-on-surface-variant">Blood Pressure</td>
                    <td className="py-4 font-body-md text-sm text-on-surface text-right font-medium">Optimal</td>
                  </tr>
                  <tr className="border-b border-outline-variant/10">
                    <td className="py-4 font-body-md text-sm text-on-surface-variant">Weight Management</td>
                    <td className="py-4 font-body-md text-sm text-on-surface text-right font-medium">In-Range</td>
                  </tr>
                  <tr className="border-b border-outline-variant/10">
                    <td className="py-4 font-body-md text-sm text-on-surface-variant">Lifestyle Balance</td>
                    <td className="py-4 font-body-md text-sm text-on-surface text-right font-medium">Excellent</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex flex-col items-center justify-center p-12 bg-surface-container-low rounded-2xl relative border border-outline-variant/20">
              {/* Circular Gauge Placeholder (SVG) */}
              <div className="relative w-60 h-60">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="transparent" r="40" stroke="#e2e8f0" strokeWidth="8"></circle>
                  <circle cx="50" cy="50" fill="transparent" r="40" stroke="#005c55" strokeDasharray="251.2" strokeDashoffset="221" strokeLinecap="round" strokeWidth="8"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center rotate-90">
                  <span className="text-[44px] font-black text-primary leading-none">12%</span>
                  <span className="text-[10px] text-on-surface-variant tracking-widest font-bold uppercase mt-1">TOTAL RISK</span>
                </div>
              </div>
              <div className="mt-8 text-center">
                <span className="bg-risk-low text-white px-6 py-2 rounded-full font-label-md text-xs font-semibold tracking-wider">
                  LOW RISK CATEGORY
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
