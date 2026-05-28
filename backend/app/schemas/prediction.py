from pydantic import BaseModel, Field, model_validator
from datetime import datetime
from typing import Literal, Dict, Optional

class PredictionInput(BaseModel):
    age_years: float = Field(..., ge=1, le=100)
    gender: Literal[1, 2] = Field(..., description="1 = Female, 2 = Male")
    height: float = Field(..., ge=130, le=220)
    weight: float = Field(..., ge=40, le=200)
    ap_hi: float = Field(..., ge=60, le=250)
    ap_lo: float = Field(..., ge=40, le=200)
    cholesterol: Literal[1, 2, 3] = Field(..., description="1 = Normal, 2 = Above Normal, 3 = Well Above Normal")
    gluc: Literal[1, 2, 3] = Field(..., description="1 = Normal, 2 = Above Normal, 3 = Well Above Normal")
    smoke: Literal[0, 1] = Field(..., description="0 = Non-smoker, 1 = Smoker")
    alco: Literal[0, 1] = Field(..., description="0 = No alcohol, 1 = Alcohol intake")
    active: Literal[0, 1] = Field(..., description="0 = Inactive, 1 = Active")

    @model_validator(mode="after")
    def validate_blood_pressure(self) -> "PredictionInput":
        if self.ap_hi <= self.ap_lo:
            raise ValueError("Systolic pressure must be higher than diastolic pressure.")
        return self

class PredictionOutput(BaseModel):
    prediction: int
    risk_percentage: float
    risk_label: str
    advice: str
    model_name: str
    bmi: float
    bmi_category: str
    pulse_pressure: float
    pp_hint: str
    record_id: int
    feature_impacts: Optional[Dict[str, float]] = None


class PredictionHistoryResponse(PredictionInput, PredictionOutput):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
