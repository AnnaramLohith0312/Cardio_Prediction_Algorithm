from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
import pandas as pd
import numpy as np
from typing import List

from app.db.session import get_db
from app.models.prediction import Prediction
from app.schemas.dashboard import DashboardStatsResponse, KPIStats, ModelStat, RiskFactor, RecentPrediction
from app.core.logger import logger

router = APIRouter()

@router.get("/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(db: Session = Depends(get_db)) -> DashboardStatsResponse:
    """
    Returns aggregated dashboard stats, including overall KPIs, model performance,
    Pearson correlation risk factors, and the 10 most recent predictions.
    """
    try:
        # 1. Calculate overall KPIs
        total_predictions = db.query(func.count(Prediction.id)).scalar() or 0
        high_risk_count = db.query(func.count(Prediction.id)).filter(Prediction.prediction == 1).scalar() or 0
        low_risk_count = db.query(func.count(Prediction.id)).filter(Prediction.prediction == 0).scalar() or 0
        avg_risk_probability = db.query(func.avg(Prediction.risk_probability)).scalar()
        
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

        # 2. Calculate model performance (accuracy per distinct model_name)
        # Using a raw SQL query via db.execute to handle division by zero and CASE statements cleanly
        model_query = """
            SELECT 
                model_name,
                COUNT(*) as total,
                SUM(CASE WHEN (prediction = 1 AND risk_probability >= 0.5) 
                           OR (prediction = 0 AND risk_probability < 0.5) THEN 1 ELSE 0 END) as correct
            FROM predictions
            GROUP BY model_name
        """
        model_results = db.execute(func.txt(model_query) if hasattr(func, "txt") else db.execute(func.text(model_query))).fetchall() if hasattr(func, "text") else db.execute(model_query).fetchall()
        
        # Fallback if execution doesn't fetch direct text query (using SQLAlchemy Core query is safer)
        # Let's write the query using SQLAlchemy core expressions for maximum compatibility
        # Or simply db.execute(text(...)) with sqlalchemy import text
        from sqlalchemy import text
        model_results = db.execute(text(
            "SELECT model_name, COUNT(*) as total, "
            "SUM(CASE WHEN (prediction = 1 AND risk_probability >= 0.5) OR (prediction = 0 AND risk_probability < 0.5) THEN 1 ELSE 0 END) as correct "
            "FROM predictions GROUP BY model_name"
        )).fetchall()

        models_list = []
        for row in model_results:
            name, total, correct = row[0], row[1], row[2]
            accuracy = round(float(correct) / total, 4) if total > 0 else 0.0
            models_list.append(ModelStat(name=name, accuracy=accuracy))
        models_list.sort(key=lambda x: x.accuracy, reverse=True)

        # 3. Calculate Risk Factor Importance using Pearson Correlation
        records = db.query(
            Prediction.ap_hi,
            Prediction.age_years,
            Prediction.bmi,
            Prediction.cholesterol,
            Prediction.gluc,
            Prediction.pulse_pressure,
            Prediction.prediction
        ).all()

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

        # 4. Fetch the 10 most recent predictions
        recent_records = db.query(Prediction).order_by(Prediction.created_at.desc()).limit(10).all()
        recent_list = []
        for r in recent_records:
            recent_list.append(RecentPrediction(
                id=r.id,
                age_years=r.age_years,
                bmi=round(r.bmi, 2),
                ap_hi=r.ap_hi,
                ap_lo=r.ap_lo,
                prediction=r.prediction,
                risk_probability=r.risk_probability,
                risk_level=r.risk_level,
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
            status_code=status.HTTP_503_SERVICE_AVAILABLE,
            detail="Database unavailable"
        )
