export function calculateBMI(weight: number, height: number): number {
  if (!weight || !height) return 0;
  return parseFloat((weight / Math.pow(height / 100, 2)).toFixed(2));
}

export function calculatePulsePressure(apHi: number, apLo: number): number {
  return apHi - apLo;
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi <= 24.9) return "Normal";
  if (bmi <= 29.9) return "Overweight";
  return "Obese";
}

export function getPulsePressureHint(pp: number): string {
  if (pp < 40) return "Low - consult a doctor";
  if (pp <= 60) return "Healthy range";
  if (pp <= 80) return "Slightly elevated";
  return "Elevated - review values";
}

