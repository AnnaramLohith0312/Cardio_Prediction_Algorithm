import { useMemo } from "react";
import { calculateBMI, calculatePulsePressure } from "@/lib/calculations";

interface MetricInputs {
  weight: number;
  height: number;
  ap_hi: number;
  ap_lo: number;
}

export function useDerivedMetrics({ weight, height, ap_hi, ap_lo }: MetricInputs) {
  const bmi = useMemo(() => calculateBMI(weight, height), [weight, height]);
  const pulsePressure = useMemo(() => calculatePulsePressure(ap_hi, ap_lo), [ap_hi, ap_lo]);

  return { bmi, pulsePressure };
}
