export default function TrustSection() {
  const securityItems = [
    {
      icon: "lock_person",
      title: "Secure Access",
      desc: "Multi-factor authentication and encrypted data transmission protect your sensitive health records."
    },
    {
      icon: "policy",
      title: "Data Privacy",
      desc: "Full HIPAA compliance ensures your data is never shared without explicit clinical consent."
    },
    {
      icon: "medical_services",
      title: "Medical Reliability",
      desc: "Our algorithms are regularly validated by cardiology experts and updated with new clinical research."
    }
  ];

  return (
    <section className="py-section-padding">
      <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-100 flex items-center justify-center h-[350px] border border-outline-variant/30">
            {/* Security Interface Illustration Placeholder */}
            <div className="text-center p-8">
              <span className="material-symbols-outlined text-primary text-7xl animate-pulse">
                shield
              </span>
              <p className="font-label-md text-primary mt-4 font-bold">HIPAA Secure Server Active</p>
              <p className="text-xs text-on-surface-variant mt-1">256-bit Encryption Enabled</p>
            </div>
          </div>
        </div>
        <div className="order-1 md:order-2 space-y-8">
          <h2 className="font-headline-lg text-[32px] font-bold text-slate-text leading-tight">
            Medical Grade Reliability &amp; Privacy
          </h2>
          <div className="space-y-6">
            {securityItems.map((item) => (
              <div key={item.title} className="flex gap-4">
                <span className="material-symbols-outlined text-primary shrink-0 text-2xl">{item.icon}</span>
                <div>
                  <h4 className="font-label-md text-sm font-semibold text-on-surface mb-1">{item.title}</h4>
                  <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
