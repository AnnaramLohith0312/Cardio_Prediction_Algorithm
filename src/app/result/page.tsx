"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ResultCard from "@/components/result/ResultCard";
import ContributingSignals from "@/components/result/ContributingSignals";
import PatientSummaryTable from "@/components/result/PatientSummaryTable";
import RouteGuard from "@/components/auth/RouteGuard";
import { usePrediction } from "@/hooks/usePrediction";
import { CardioFormInput } from "@/types/cardio";

const DEFAULT_PAYLOAD: CardioFormInput = {
  age_years: 45,
  gender: 2,
  height: 175,
  weight: 75,
  ap_hi: 120,
  ap_lo: 80,
  cholesterol: 1,
  gluc: 1,
  smoke: 0,
  alco: 0,
  active: 1,
};

export default function ResultPage() {
  const { loading: apiLoading, result: apiResult, error: apiError, getPrediction } = usePrediction();
  const [payload, setPayload] = useState<CardioFormInput | null>(null);
  const [localResult, setLocalResult] = useState<any | null>(null);
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const rawPayload = sessionStorage.getItem("cardio_assessment_payload");
    const data: CardioFormInput = rawPayload ? JSON.parse(rawPayload) : DEFAULT_PAYLOAD;
    setPayload(data);

    const rawResult = sessionStorage.getItem("cardio_prediction_result");
    if (rawResult) {
      setLocalResult(JSON.parse(rawResult));
      setLocalLoading(false);
    } else {
      setLocalLoading(true);
      getPrediction(data)
        .then((res) => {
          setLocalResult(res);
          sessionStorage.setItem("cardio_prediction_result", JSON.stringify(res));
        })
        .catch((err) => {
          setLocalError(err.message || "Failed to retrieve cardiac prediction.");
        })
        .finally(() => {
          setLocalLoading(false);
        });
    }
  }, []);

  const loading = localLoading || apiLoading;
  const result = localResult || apiResult;
  const error = localError || apiError;

  if (!payload || loading) {
    return (
      <RouteGuard>
        <Navbar />
        <main className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <span className="material-symbols-outlined text-primary text-5xl animate-spin">
              progress_activity
            </span>
            <p className="font-label-md text-on-surface-variant font-semibold">Running cardiac risk prediction model...</p>
          </div>
        </main>
        <Footer />
      </RouteGuard>
    );
  }

  if (error || !result) {
    return (
      <RouteGuard>
        <Navbar />
        <main className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4 max-w-sm">
            <span className="material-symbols-outlined text-red-500 text-5xl">error</span>
            <p className="font-label-md text-on-surface-variant font-semibold">Prediction failed</p>
            <p className="text-sm text-outline">{error || "Unable to reach prediction service. Please try again."}</p>
            <Link href="/assessment" className="inline-block mt-4 bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-container transition-colors">
              Try Again
            </Link>
          </div>
        </main>
        <Footer />
      </RouteGuard>
    );
  }

  const rawBp = result.feature_impacts?.ap_hi ?? 30.0;
  const rawBmi = result.feature_impacts?.bmi ?? 8.0;
  const rawPp = result.feature_impacts?.pulse_pressure ?? 15.0;
  const rawAge = result.feature_impacts?.age_years ?? 12.0;

  const totalRaw = rawBp + rawBmi + rawPp + rawAge;
  const bpImpact = Math.round((rawBp / totalRaw) * 100);
  const bmiImpact = Math.round((rawBmi / totalRaw) * 100);
  const ppImpact = Math.round((rawPp / totalRaw) * 100);
  const ageImpact = 100 - (bpImpact + bmiImpact + ppImpact);

  const signals = [
    { label: "Systolic Blood Pressure", impact: bpImpact, value: `${payload.ap_hi} mmHg` },
    { 
      label: `BMI (${result.bmi_category || "Calculated"})`, 
      impact: bmiImpact, 
      value: result.bmi ? `${Number(result.bmi).toFixed(1)} kg/m²` : `${(payload.weight / Math.pow(payload.height / 100, 2)).toFixed(1)} kg/m²` 
    },
    { 
      label: `Pulse Pressure (${result.pp_hint || "Calculated"})`, 
      impact: ppImpact, 
      value: result.pulse_pressure ? `${result.pulse_pressure} mmHg` : `${payload.ap_hi - payload.ap_lo} mmHg` 
    },
    { label: "Age", impact: ageImpact, value: `${payload.age_years} yrs` },
  ];


  return (
    <RouteGuard>
      <Navbar />
      <main className="max-w-container-max mx-auto px-gutter py-stack-lg flex-1">
        {/* Results layout split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-stack-lg">
          <section className="lg:col-span-7 flex">
            <ResultCard
              percentage={result.risk_percentage}
              label={result.risk_label}
              advice={result.advice}
              modelName={result.model_name}
            />
          </section>

          <aside className="lg:col-span-5 flex flex-col gap-6">
            <ContributingSignals signals={signals} />

            {/* Actions panel */}
            <div className="bg-primary-container text-on-primary-container rounded-xl p-6 shadow-md">
              <h4 className="font-headline-md text-lg font-bold mb-4 text-white">Next Steps</h4>
              <div className="flex flex-col gap-3">
                <Link href="/dashboard" className="w-full">
                  <button className="w-full bg-white text-primary font-label-md text-sm font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-95 cursor-pointer shadow-sm">
                    <span className="material-symbols-outlined text-lg">dashboard</span>
                    View Dashboard
                  </button>
                </Link>
                <button onClick={() => window.print()} className="bg-primary text-white border border-white/20 font-label-md text-sm font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-95 cursor-pointer shadow-sm">
                  <span className="material-symbols-outlined text-lg">download</span>
                  Download Medical Report
                </button>
                <Link href="/assessment" className="w-full">
                  <button className="w-full bg-transparent border border-white/30 text-white font-label-md text-sm font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-all cursor-pointer">
                    <span className="material-symbols-outlined text-lg">refresh</span>
                    Reassess Parameters
                  </button>
                </Link>
              </div>
            </div>

            {/* AI Disclaimer */}
            <div className="flex gap-3 px-2 text-outline">
              <span className="material-symbols-outlined text-[18px]">info</span>
              <p className="font-label-sm text-xs leading-tight font-medium">
                This prediction is generated by a clinical-grade AI model. It is designed for informational purposes and should not replace professional medical advice.
              </p>
            </div>
          </aside>
        </div>

        <PatientSummaryTable data={payload} recordId={result?.record_id} />

        {/* Wearable integrations ribbon */}
        <div className="mt-12 rounded-2xl overflow-hidden relative h-64 w-full shadow-lg border border-outline-variant/20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-transparent flex items-center px-12 z-10">
            <div className="max-w-md text-white space-y-2">
              <h3 className="font-headline-lg text-2xl font-bold">Wearable Integration</h3>
              <p className="font-body-md text-sm opacity-90 leading-relaxed">
                Connect your wearable devices (Apple Health, Fitbit, Garmin) to automate these assessments and receive real-time cardiovascular risk tracking.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </RouteGuard>
  );
}

