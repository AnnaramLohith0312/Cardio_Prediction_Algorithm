from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime, timezone
from app.db.base import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    age_years = Column(Integer, nullable=False)
    gender = Column(Integer, nullable=False)
    height = Column(Float, nullable=False)
    weight = Column(Float, nullable=False)
    ap_hi = Column(Integer, nullable=False)
    ap_lo = Column(Integer, nullable=False)
    cholesterol = Column(Integer, nullable=False)
    gluc = Column(Integer, nullable=False)
    smoke = Column(Integer, nullable=False)
    alco = Column(Integer, nullable=False)
    active = Column(Integer, nullable=False)
    bmi = Column(Float, nullable=False)
    pulse_pressure = Column(Float, nullable=False)
    prediction = Column(Integer, nullable=False)  # 0=low risk, 1=high risk
    risk_probability = Column(Float, nullable=False)  # 0.0–1.0
    model_name = Column(String(100), nullable=False)
    risk_level = Column(String(10), nullable=False)  # "LOW" or "HIGH"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
