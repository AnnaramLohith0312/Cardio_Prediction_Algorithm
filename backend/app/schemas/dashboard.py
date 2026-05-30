from pydantic import BaseModel, ConfigDict
from typing import List
from datetime import datetime

class KPIStats(BaseModel):
    total_predictions: int
    high_risk_count: int
    low_risk_count: int
    avg_risk_probability: float

class ModelStat(BaseModel):
    name: str
    accuracy: float

class RiskFactor(BaseModel):
    feature: str
    importance: float

class RecentPrediction(BaseModel):
    id: int
    age_years: int
    bmi: float
    ap_hi: int
    ap_lo: int
    prediction: int
    risk_probability: float
    risk_level: str
    model_name: str
    created_at: str  # ISO 8601 string format

    model_config = ConfigDict(from_attributes=True)

class DashboardStatsResponse(BaseModel):
    kpis: KPIStats
    models: List[ModelStat]
    risk_factors: List[RiskFactor]
    recent: List[RecentPrediction]
