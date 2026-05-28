export default function FeatureGrid() {
  const features = [
    {
      icon: "bolt",
      iconColor: "text-primary bg-primary/10",
      title: "Real-time Prediction",
      desc: "Instant risk score generation as you input your health data, allowing for immediate feedback and awareness."
    },
    {
      icon: "functions",
      iconColor: "text-secondary bg-secondary/10",
      title: "Auto-calculated Metrics",
      desc: "Automatically derives BMI, Pulse Pressure, and Mean Arterial Pressure from basic physiological inputs."
    },
    {
      icon: "verified_user",
      iconColor: "text-tertiary bg-tertiary-container/10",
      title: "Smart Validation",
      desc: "Inbuilt sanity checks prevent erroneous data entry, ensuring the highest reliability of results."
    },
    {
      icon: "psychology",
      iconColor: "text-primary bg-primary/10",
      title: "Explainable Insights",
      desc: "Our AI doesn't just give a number; it explains which factors contributed most to your risk profile."
    }
  ];

  return (
    <section className="py-section-padding bg-surface">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-headline-lg text-[32px] font-bold text-slate-text">Engineered for Accuracy</h2>
          <p className="font-body-md text-base text-on-surface-variant">Built on extensive medical datasets and predictive AI models.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-stack-lg">
          {features.map((feat) => (
            <div 
              key={feat.title} 
              className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/30 hover:border-primary/50 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 ${feat.iconColor} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined">{feat.icon}</span>
              </div>
              <h3 className="font-headline-md text-lg font-bold text-on-surface mb-2">{feat.title}</h3>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
