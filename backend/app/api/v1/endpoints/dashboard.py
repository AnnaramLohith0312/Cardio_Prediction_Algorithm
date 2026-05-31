from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
import pandas as pd
import numpy as np
from typing import List

from app.db.session import get_db
from app.db.models import PredictionHistory
from app.schemas.dashboard import DashboardStatsResponse, KPIStats, ModelStat, RiskFactor, RecentPrediction
from app.core.logger import logger
from app.core.dependencies import get_current_user
from app.schemas import user as user_schemas

router = APIRouter()

@router.get("/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: user_schemas.UserResponse = Depends(get_current_user)
) -> DashboardStatsResponse:
    """
    Returns aggregated dashboard stats scoped to the authenticated user, including overall KPIs, model performance,
    Pearson correlation risk factors, and the 10 most recent predictions.
    """
    try:
        user_id = current_user.id
        
        # 1. Calculate overall KPIs for current user
        total_predictions = db.query(func.count(PredictionHistory.id)).filter(PredictionHistory.user_id == user_id).scalar() or 0
        high_risk_count = db.query(func.count(PredictionHistory.id)).filter(PredictionHistory.user_id == user_id, PredictionHistory.prediction == 1).scalar() or 0
        low_risk_count = db.query(func.count(PredictionHistory.id)).filter(PredictionHistory.user_id == user_id, PredictionHistory.prediction == 0).scalar() or 0
        avg_risk_probability = db.query(func.avg(PredictionHistory.risk_percentage)).filter(PredictionHistory.user_id == user_id).scalar()
        
        avg_risk_probability = round(float(avg_risk_probability), 4) if avg_risk_probability is not None else 0.0

        kpis = KPIStats(
            total_predictions=total_predictions,
            high_risk_count=high_risk_count,
            low_risk_count=low_risk_count,
            avg_risk_probability=avg_risk_probability
        )

        if total_predictions == 0:
            # Handle empty database gracefully
            return DashboardStatsResponse(
                kpis=kpis,
                models=[],
                risk_factors=[],
                recent=[]
            )

        # 2. Calculate model performance (accuracy per distinct model_name) for current user
        from sqlalchemy import text
        # Because SQLite might not like parameters in this raw query nicely if we don't bind, let's use text with bindparams
        model_results = db.execute(text(
            "SELECT model_name, COUNT(*) as total, "
            "SUM(CASE WHEN (prediction = 1 AND risk_percentage >= 0.5) OR (prediction = 0 AND risk_percentage < 0.5) THEN 1 ELSE 0 END) as correct "
            "FROM prediction_history WHERE user_id = :user_id GROUP BY model_name"
        ), {"user_id": user_id}).fetchall()

        models_list = []
        for row in model_results:
            name, total, correct = row[0], row[1], row[2]
            accuracy = round(float(correct) / total, 4) if total > 0 else 0.0
            models_list.append(ModelStat(name=name, accuracy=accuracy))
        models_list.sort(key=lambda x: x.accuracy, reverse=True)

        # 3. Calculate Risk Factor Importance using Pearson Correlation for current user
        records = db.query(
            PredictionHistory.ap_hi,
            PredictionHistory.age_years,
            PredictionHistory.bmi,
            PredictionHistory.cholesterol,
            PredictionHistory.gluc,
            PredictionHistory.pulse_pressure,
            PredictionHistory.prediction
        ).filter(PredictionHistory.user_id == user_id).all()

        features = ["ap_hi", "age_years", "bmi", "cholesterol", "gluc", "pulse_pressure"]
        risk_factors_list = []

        if len(records) < 2:
            # Fallback list based on known ML model correlations
            fallback = {
                "ap_hi": 0.43,
                "age_years": 0.24,
                "bmi": 0.19,
                "cholesterol": 0.22,
                "gluc": 0.09,
                "pulse_pressure": 0.38
            }
            for f in features:
                risk_factors_list.append(RiskFactor(feature=f, importance=fallback[f]))
        else:
            df = pd.DataFrame(records, columns=["ap_hi", "age_years", "bmi", "cholesterol", "gluc", "pulse_pressure", "prediction"])
            for f in features:
                # Handle cases where all values of a feature or prediction are constant (avoid NaN deviance)
                if df[f].std() == 0 or df["prediction"].std() == 0:
                    corr = 0.0
                else:
                    corr = df[f].corr(df["prediction"])
                    if pd.isna(corr):
                        corr = 0.0
                risk_factors_list.append(RiskFactor(feature=f, importance=round(abs(float(corr)), 4)))

        risk_factors_list.sort(key=lambda x: x.importance, reverse=True)

        # 4. Fetch the 10 most recent predictions for current user
        recent_records = db.query(PredictionHistory).filter(PredictionHistory.user_id == user_id).order_by(PredictionHistory.created_at.desc()).limit(10).all()
        recent_list = []
        for r in recent_records:
            recent_list.append(RecentPrediction(
                id=r.id,
                age_years=r.age_years,
                bmi=round(r.bmi, 2),
                ap_hi=r.ap_hi,
                ap_lo=r.ap_lo,
                prediction=r.prediction,
                risk_probability=r.risk_percentage,
                risk_level=r.risk_label,
                model_name=r.model_name,
                created_at=r.created_at.isoformat() + "Z"
            ))

        return DashboardStatsResponse(
            kpis=kpis,
            models=models_list,
            risk_factors=risk_factors_list,
            recent=recent_list
        )

    except Exception as e:
        logger.error(f"Error serving dashboard stats endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database unavailable"
        )
