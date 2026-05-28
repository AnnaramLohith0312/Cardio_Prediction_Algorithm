import { useState } from "react";
import { CardioFormInput, PredictionResponse } from "@/types/cardio";
import { predictCardioRisk } from "@/lib/api";

export function usePrediction() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getPrediction = async (payload: CardioFormInput) => {
    setLoading(true);
    setError(null);
    try {
      const data = await predictCardioRisk(payload as any);
      setResult(data);
      return data;
    } catch (e: any) {
      const msg = e.message || "Failed to get a prediction. Please try again.";
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    result,
    error,
    getPrediction,
  };
}
