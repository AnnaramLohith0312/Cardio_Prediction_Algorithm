"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import AssessmentStepper from "@/components/assessment/AssessmentStepper";
import LiveInsightsPanel from "@/components/insights/LiveInsightsPanel";
import RouteGuard from "@/components/auth/RouteGuard";
import { useCardioForm } from "@/hooks/useCardioForm";
import { useDerivedMetrics } from "@/hooks/useDerivedMetrics";
import { usePrediction } from "@/hooks/usePrediction";

export default function AssessmentPage() {
  const router = useRouter();
  const { form, errors, updateField, completionPercentage } = useCardioForm();
  const { loading, error: apiError, getPrediction } = usePrediction();
  const { bmi, pulsePressure } = useDerivedMetrics({
    weight: form.weight,
    height: form.height,
    ap_hi: form.ap_hi,
    ap_lo: form.ap_lo,
  });

  const handleSubmit = async () => {
    if (errors.length > 0) return;

    try {
      // Call real prediction API endpoint
      const resultData = await getPrediction(form);
      
      // Save both inputs and prediction outputs in sessionStorage
      sessionStorage.setItem("cardio_assessment_payload", JSON.stringify(form));
      sessionStorage.setItem("cardio_prediction_result", JSON.stringify(resultData));

      // Redirect to result page which will read directly from storage without calling api again
      router.push("/result");
    } catch (e) {
      console.error("Prediction submission failed:", e);
    }
  };

  return (
    <RouteGuard>
      <Navbar />
      <main className="max-w-container-max mx-auto px-gutter py-stack-lg flex flex-col md:flex-row gap-8 flex-1">
        <div className="flex-1">
          <AssessmentStepper
            form={form}
            errors={errors}
            onChange={updateField}
            onSubmit={handleSubmit}
            loading={loading}
            apiError={apiError}
          />
        </div>
        <LiveInsightsPanel
          bmi={bmi}
          pulsePressure={pulsePressure}
          completionPercentage={completionPercentage}
        />
      </main>
      <Footer />
    </RouteGuard>
  );
}

