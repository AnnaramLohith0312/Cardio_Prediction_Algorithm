import { PredictionPayload, PredictionResponse } from "@/types/cardio";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getAuthHeader(): Record<string, string> {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("cardio_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  return {};
}

// --- Dashboard Typings ---

export interface KPIStats {
  total_predictions: number;
  high_risk_count: number;
  low_risk_count: number;
  avg_risk_probability: number;
}

export interface ModelStat {
  name: string;
  accuracy: number;
}

export interface RiskFactor {
  feature: string;
  importance: number;
}

export interface RecentPrediction {
  id: number;
  age_years: number;
  bmi: number;
  ap_hi: number;
  ap_lo: number;
  prediction: number;
  risk_probability: number;
  risk_level: string;
  model_name: string;
  created_at: string;
}

export interface DashboardStats {
  kpis: KPIStats;
  models: ModelStat[];
  risk_factors: RiskFactor[];
  recent: RecentPrediction[];
}

// --- Prediction Typings ---

export interface PredictRequest {
  age_years: number;
  gender: number;
  height: number;
  weight: number;
  ap_hi: number;
  ap_lo: number;
  cholesterol: number;
  gluc: number;
  smoke: number;
  alco: number;
  active: number;
}

export interface PredictResponse {
  prediction: number;
  probability: number;
  risk_level: string;
  model_used: string;
  
  // UI rendering compat fields
  risk_percentage: number;
  risk_label: string;
  advice: string;
  bmi: number;
  bmi_category: string;
  pulse_pressure: number;
  pp_hint: string;
  model_name: string;
  record_id: number;
  feature_impacts?: Record<string, number>;
}

// --- API Methods ---

/**
 * Fetches real-time prediction analytics and stats from the backend.
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/dashboard/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader()
      },
      cache: "no-store"
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.detail || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || "Failed to connect to dashboard statistics service.");
  }
}

/**
 * Submits patient data for cardiovascular risk prediction.
 */
export async function submitPrediction(data: PredictRequest): Promise<PredictResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader()
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.detail || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || "Failed to reach the prediction service.");
  }
}

// --- Legacy Compatibility Functions ---

let isSubmitting = false;

export async function predictCardioRisk(payload: PredictionPayload): Promise<PredictionResponse> {
  if (isSubmitting) {
    throw new Error("A prediction assessment is already in progress. Please wait.");
  }

  isSubmitting = true;

  try {
    const { bmi, pulse_pressure, ...backendPayload } = payload as any;
    const response = await submitPrediction(backendPayload);
    
    // Map PredictResponse to PredictionResponse fields
    return {
      prediction: response.prediction,
      risk_percentage: response.risk_percentage,
      risk_label: response.risk_label,
      advice: response.advice,
      model_name: response.model_name,
      bmi: response.bmi,
      bmi_category: response.bmi_category,
      pulse_pressure: response.pulse_pressure,
      pp_hint: response.pp_hint,
      record_id: response.record_id
    };
  } finally {
    isSubmitting = false;
  }
}

export async function getHistory(limit: number = 100, offset: number = 0): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/history?limit=${limit}&offset=${offset}`, {
      headers: {
        ...getAuthHeader()
      }
    });

    if (!response.ok) {
      throw new Error("Failed to retrieve prediction history.");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || "Network error fetching history.");
  }
}

export async function getHistoryById(recordId: number): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/history/${recordId}`, {
      headers: {
        ...getAuthHeader()
      }
    });

    if (!response.ok) {
      throw new Error("Failed to retrieve prediction record.");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || "Network error fetching prediction record.");
  }
}
