import { CardioFormInput } from "@/types/cardio";

interface PatientSummaryTableProps {
  data: CardioFormInput;
  recordId?: number;
}

export default function PatientSummaryTable({ data, recordId }: PatientSummaryTableProps) {
  const genderLabel = data.gender === 1 ? "Female" : "Male";
  const smokeLabel = data.smoke === 1 ? "Smoker" : "Non-Smoker";
  const activeLabel = data.active === 1 ? "Active" : "Sedentary";
  const levelLabels = { 1: "Normal", 2: "Above Normal", 3: "Well Above" };

  return (
    <section className="mt-8">
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center">
          <h2 className="font-headline-md text-lg font-bold text-slate-text">Input Data Recap</h2>
          <span className="font-label-sm text-xs font-semibold text-outline">
            Ref ID: {recordId ? `CR-${recordId}` : "Pending..."}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y divide-outline-variant/20">
          <div className="p-6">
            <p className="text-xs text-on-surface-variant uppercase tracking-tighter mb-1 font-semibold">Age</p>
            <p className="text-lg font-bold text-primary">{data.age_years} yr</p>
          </div>
          <div className="p-6">
            <p className="text-xs text-on-surface-variant uppercase tracking-tighter mb-1 font-semibold">Gender</p>
            <p className="text-lg font-bold text-primary">{genderLabel}</p>
          </div>
          <div className="p-6">
            <p className="text-xs text-on-surface-variant uppercase tracking-tighter mb-1 font-semibold">Cholesterol</p>
            <p className="text-lg font-bold text-primary">{levelLabels[data.cholesterol]}</p>
          </div>
          <div className="p-6">
            <p className="text-xs text-on-surface-variant uppercase tracking-tighter mb-1 font-semibold">Systolic BP</p>
            <p className="text-lg font-bold text-primary">{data.ap_hi} mmHg</p>
          </div>
          <div className="p-6 border-t-0">
            <p className="text-xs text-on-surface-variant uppercase tracking-tighter mb-1 font-semibold">Height/Weight</p>
            <p className="text-lg font-bold text-primary">{data.height}cm / {data.weight}kg</p>
          </div>
          <div className="p-6">
            <p className="text-xs text-on-surface-variant uppercase tracking-tighter mb-1 font-semibold">Smoking</p>
            <p className="text-lg font-bold text-primary">{smokeLabel}</p>
          </div>
          <div className="p-6">
            <p className="text-xs text-on-surface-variant uppercase tracking-tighter mb-1 font-semibold">Physical Act.</p>
            <p className="text-lg font-bold text-primary">{activeLabel}</p>
          </div>
          <div className="p-6">
            <p className="text-xs text-on-surface-variant uppercase tracking-tighter mb-1 font-semibold">Glucose</p>
            <p className="text-lg font-bold text-primary">{levelLabels[data.gluc]}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
