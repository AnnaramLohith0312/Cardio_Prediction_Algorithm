from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
import pandas as pd
from datetime import datetime, timezone

from app.db.session import get_db
from app.schemas.prediction import PredictRequest, PredictResponse
from app.models.prediction import Prediction

router = APIRouter()

@router.post("", response_model=PredictResponse, status_code=status.HTTP_200_OK)
def predict_cardio_risk(
    payload: PredictRequest,
    request: Request,
    db: Session = Depends(get_db)
) -> PredictResponse:
    """
    Accepts clinical patient data, runs a risk assessment model loaded at startup,
    stores the full prediction transaction into the database, and returns the risk level.
    """
    # Retrieve the model and scaler from the app state
    model = getattr(request.app.state, "model", None)
    scaler = getattr(request.app.state, "scaler", None)
    
    if model is None or scaler is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_AVAILABLE,
            detail="Machine Learning models are currently unavailable on the server."
        )

    # Compute derived clinical metrics server-side
    bmi = payload.weight / ((payload.height / 100) ** 2)
    pulse_pressure = float(payload.ap_hi - payload.ap_lo)

    # Map category tags for BMI and Pulse Pressure
    if bmi < 18.5:
        bmi_category = "Underweight"
    elif bmi <= 24.9:
        bmi_category = "Normal"
    elif bmi <= 29.9:
        bmi_category = "Overweight"
    else:
        bmi_category = "Obese"

    if pulse_pressure < 40:
        pp_hint = "Low - consult a doctor"
    elif pulse_pressure <= 60:
        pp_hint = "Healthy range"
    elif pulse_pressure <= 80:
        pp_hint = "Slightly elevated"
    else:
        pp_hint = "Elevated - review values"

    # Create model input
    input_dict = {
        "age_years": payload.age_years,
        "gender": payload.gender,
        "height": payload.height,
        "weight": payload.weight,
        "ap_hi": payload.ap_hi,
        "ap_lo": payload.ap_lo,
        "cholesterol": payload.cholesterol,
        "gluc": payload.gluc,
        "smoke": payload.smoke,
        "alco": payload.alco,
        "active": payload.active,
        "bmi": bmi,
        "pulse_pressure": pulse_pressure
    }

    feature_cols = [
        "age_years", "gender", "height", "weight",
        "ap_hi", "ap_lo", "cholesterol", "gluc",
        "smoke", "alco", "active", "bmi", "pulse_pressure"
    ]
    
    df = pd.DataFrame([input_dict])[feature_cols]
    model_name = type(model).__name__

    # Tree-based classifiers do not require standard scaling
    is_tree = any(name in model_name for name in ["Forest", "Tree", "Boosting", "XGB"])
    
    try:
        pred_input = df if is_tree else scaler.transform(df)
        prediction = int(model.predict(pred_input)[0])
        
        # Extract probability if supported
        if hasattr(model, "predict_proba"):
            probability = float(model.predict_proba(pred_input)[0][1])
        else:
            probability = 0.7000 if prediction == 1 else 0.1500
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing prediction model pipeline: {str(e)}"
        )

    probability_rounded = round(probability, 4)
    risk_level = "HIGH" if prediction == 1 else "LOW"

    # Calculate advice advice string
    advice = "Strongly recommend consulting a cardiologist immediately." if probability_rounded >= 0.7 else (
        "Consider lifestyle changes and schedule a medical checkup." if probability_rounded >= 0.4 else
        "Maintain healthy habits. Annual checkups advised."
    )

    # Save to database
    db_prediction = Prediction(
        age_years=payload.age_years,
        gender=payload.gender,
        height=payload.height,
        weight=payload.weight,
        ap_hi=payload.ap_hi,
        ap_lo=payload.ap_lo,
        cholesterol=payload.cholesterol,
        gluc=payload.gluc,
        smoke=payload.smoke,
        alco=payload.alco,
        active=payload.active,
        bmi=round(bmi, 4),
        pulse_pressure=pulse_pressure,
        prediction=prediction,
        risk_probability=probability_rounded,
        model_name=model_name,
        risk_level=risk_level,
        created_at=datetime.now(timezone.utc)
    )

    try:
        db.add(db_prediction)
        db.commit()
        db.refresh(db_prediction)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database save operation failed: {str(e)}"
        )

    # Calculate feature importances / impacts for the UI response
    feature_impacts = {}
    try:
        if hasattr(model, "feature_importances_") and model.feature_importances_ is not None:
            importances = model.feature_importances_
            for col, imp in zip(feature_cols, importances):
                feature_impacts[col] = round(float(imp) * 100, 1)
        elif hasattr(model, "coef_") and model.coef_ is not None:
            coefs = model.coef_[0]
            abs_coefs = [abs(c) for c in coefs]
            total = sum(abs_coefs) if sum(abs_coefs) > 0 else 1
            for col, val in zip(feature_cols, abs_coefs):
                feature_impacts[col] = round((val / total) * 100, 1)
        else:
            fallback = {
                "age_years": 12.0, "gender": 2.0, "height": 4.0, "weight": 6.0,
                "ap_hi": 30.0, "ap_lo": 15.0, "cholesterol": 10.0, "gluc": 5.0,
                "smoke": 3.0, "alco": 2.0, "active": 3.0, "bmi": 8.0, "pulse_pressure": 15.0
            }
            feature_impacts = fallback
    except Exception:
        feature_impacts = {col: 10.0 for col in feature_cols}

    return PredictResponse(
        prediction=prediction,
        probability=probability_rounded,
        risk_level=risk_level,
        model_used=model_name,
        risk_percentage=round(probability_rounded * 100, 1),
        risk_label="High Risk" if prediction == 1 else "Low Risk",
        advice=advice,
        bmi=round(bmi, 2),
        bmi_category=bmi_category,
        pulse_pressure=pulse_pressure,
        pp_hint=pp_hint,
        model_name=model_name,
        record_id=db_prediction.id,
        feature_impacts=feature_impacts
    )
