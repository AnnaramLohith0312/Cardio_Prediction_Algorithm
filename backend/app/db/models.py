from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)

    predictions = relationship("PredictionHistory", back_populates="user", cascade="all, delete-orphan")


class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Input features
    age_years = Column(Float, nullable=False)
    gender = Column(Integer, nullable=False)
    height = Column(Float, nullable=False)
    weight = Column(Float, nullable=False)
    ap_hi = Column(Float, nullable=False)
    ap_lo = Column(Float, nullable=False)
    cholesterol = Column(Integer, nullable=False)
    gluc = Column(Integer, nullable=False)
    smoke = Column(Integer, nullable=False)
    alco = Column(Integer, nullable=False)
    active = Column(Integer, nullable=False)
    bmi = Column(Float, nullable=False)
    pulse_pressure = Column(Float, nullable=False)
    
    # Prediction outputs
    prediction = Column(Integer, nullable=False)
    risk_percentage = Column(Float, nullable=False)
    risk_label = Column(String, nullable=False)
    advice = Column(String, nullable=False)
    model_name = Column(String, nullable=False)
    bmi_category = Column(String, nullable=False)
    pp_hint = Column(String, nullable=False)


    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="predictions")

    @property
    def record_id(self) -> int:
        return self.id
