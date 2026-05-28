export interface CardioFormInput {
  age_years: number;
  gender: 1 | 2; // 1 = Female, 2 = Male
  height: number;
  weight: number;
  ap_hi: number;
  ap_lo: number;
  cholesterol: 1 | 2 | 3;
  gluc: 1 | 2 | 3;
  smoke: 0 | 1;
  alco: 0 | 1;
  active: 0 | 1;
}

export interface DerivedMetrics {
  bmi: number;
  pulse_pressure: number;
}

export interface PredictionPayload extends CardioFormInput, DerivedMetrics {}

export interface PredictionResponse {
  prediction: number;
  risk_percentage: number;
  risk_label: string;
  advice: string;
  model_name: string;
  bmi?: number;
  bmi_category?: string;
  pulse_pressure?: number;
  pp_hint?: string;
  record_id?: number;
}

export interface HealthTip {
  title: string;
  description: string;
  category: string;
}
