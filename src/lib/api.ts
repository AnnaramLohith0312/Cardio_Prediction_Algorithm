import { PredictionPayload, PredictionResponse } from "@/types/cardio";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getAuthHeader(): Record<string, string> {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("cardio_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  return {};
}

let isSubmitting = false;

export async function predictCardioRisk(payload: PredictionPayload): Promise<PredictionResponse> {
  if (isSubmitting) {
    throw new Error("A prediction assessment is already in progress. Please wait.");
  }

  isSubmitting = true;

  try {
    // Exclude bmi and pulse_pressure from payload sent to backend
    const { bmi, pulse_pressure, ...backendPayload } = payload as any;

    const response = await fetch(`${API_BASE_URL}/api/v1/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader()
      },
      body: JSON.stringify(backendPayload),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.detail || "Server error: Failed to get prediction results.");
    }

    return await response.json();
  } catch (error: any) {
    if (error.message && !error.message.includes("fetch")) {
      throw error;
    }
    throw new Error("Network connection error: Unable to reach the cardiovascular prediction service.");
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
