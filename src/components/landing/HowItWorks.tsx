export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Data Input",
      desc: "Provide age, BMI, blood pressure, and key lifestyle markers."
    },
    {
      num: "02",
      title: "AI Analysis",
      desc: "Our specialized models process your vitals against clinical benchmarks."
    },
    {
      num: "03",
      title: "Risk Guidance",
      desc: "Receive an actionable report and recommended next steps."
    }
  ];

  return (
    <section className="py-section-padding bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/3">
            <h2 className="font-headline-lg text-[32px] font-bold text-slate-text mb-6">Simple 3-Step Analysis</h2>
            <p className="font-body-md text-base text-on-surface-variant mb-8">
              Comprehensive heart health screening that fits into your daily routine.
            </p>
            <button className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-sm font-semibold hover:shadow-md cursor-pointer transition-shadow">
              Learn the Methodology
            </button>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {steps.map((step) => (
              <div key={step.num} className="relative p-6 bg-white rounded-xl shadow-sm border border-outline-variant/20">
                <div className="text-primary/20 text-6xl font-black absolute top-2 right-4 select-none">{step.num}</div>
                <h4 className="font-headline-md text-lg font-bold text-on-surface mt-8 mb-4">{step.title}</h4>
                <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
