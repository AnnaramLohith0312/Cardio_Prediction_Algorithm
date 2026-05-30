from pydantic import BaseModel, Field, model_validator, ConfigDict
from datetime import datetime
from typing import Optional, Dict

class PredictRequest(BaseModel):
    age_years: int = Field(..., ge=1, le=100)
    gender: int = Field(..., ge=1, le=2)
    height: float = Field(..., ge=130, le=220)
    weight: float = Field(..., ge=40, le=200)
    ap_hi: int = Field(..., ge=60, le=250)
    ap_lo: int = Field(..., ge=40, le=200)
    cholesterol: int = Field(..., ge=1, le=3)
    gluc: int = Field(..., ge=1, le=3)
    smoke: int = Field(..., ge=0, le=1)
    alco: int = Field(..., ge=0, le=1)
    active: int = Field(..., ge=0, le=1)

    @model_validator(mode="after")
    def validate_blood_pressure(self) -> "PredictRequest":
        if self.ap_hi <= self.ap_lo:
            raise ValueError("Systolic BP (ap_hi) must be strictly greater than Diastolic BP (ap_lo).")
        return self

class PredictResponse(BaseModel):
    prediction: int
    probability: float
    risk_level: str  # "LOW" or "HIGH"
    model_used: str
    
    # Compatibility fields for UI/Result rendering
    risk_percentage: float
    risk_label: str
    advice: str
    bmi: float
    bmi_category: str
    pulse_pressure: float
    pp_hint: str
    model_name: str
    record_id: int
    feature_impacts: Optional[Dict[str, float]] = None

class PredictionRecord(BaseModel):
    id: int
    age_years: int
    gender: int
    height: float
    weight: float
    ap_hi: int
    ap_lo: int
    cholesterol: int
    gluc: int
    smoke: int
    alco: int
    active: int
    bmi: float
    pulse_pressure: float
    prediction: int
    risk_probability: float
    model_name: str
    risk_level: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# --- Backward Compatibility Schemas ---

class PredictionInput(PredictRequest):
    pass

class PredictionOutput(PredictResponse):
    pass

class PredictionHistoryResponse(BaseModel):
    id: int
    age_years: float
    gender: int
    height: float
    weight: float
    ap_hi: float
    ap_lo: float
    cholesterol: int
    gluc: int
    smoke: int
    alco: int
    active: int
    bmi: float
    pulse_pressure: float
    prediction: int
    risk_percentage: float
    risk_label: str
    advice: str
    model_name: str
    bmi_category: str
    pp_hint: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
