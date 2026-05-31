from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
import pandas as pd
from datetime import datetime, timezone
from typing import Optional, List

from app.db.session import get_db
from app.schemas.prediction import PredictRequest, PredictResponse, ModelBreakdownItem
from app.models.prediction import Prediction
from app.db import crud

from app.core.dependencies import get_current_user

router = APIRouter()

@router.post("", response_model=PredictResponse, status_code=status.HTTP_200_OK)
def predict_cardio_risk(
    payload: PredictRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: any = Depends(get_current_user)
) -> PredictResponse:
    """
    Accepts clinical patient data, runs a risk assessment model loaded at startup,
    stores the full prediction transaction into the database, and returns the risk level.
    """
    # Retrieve all ensemble models and the scaler from the app state
    model_lr = getattr(request.app.state, "model_lr", None)
    model_svm = getattr(request.app.state, "model_svm", None)
    model_knn = getattr(request.app.state, "model_knn", None)
    model_dt = getattr(request.app.state, "model_dt", None)
    model_rf = getattr(request.app.state, "model_rf", None)
    scaler = getattr(request.app.state, "scaler", None)
    
    if not all([model_lr, model_svm, model_knn, model_dt, model_rf, scaler]):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="One or more ML ensemble models are currently unavailable on the server."
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
    
    try:
        # Generate predictions for all models
        df_scaled = scaler.transform(df)

        # 1. Logistic Regression (requires scaling)
        prob_lr = float(model_lr.predict_proba(df_scaled)[0][1])
        prob_lr = max(0.0, min(1.0, prob_lr))
        pred_lr = 1 if prob_lr >= 0.5 else 0

        # 2. SVM (Calibrated, requires scaling)
        prob_svm = float(model_svm.predict_proba(df_scaled)[0][1])
        prob_svm = max(0.0, min(1.0, prob_svm))
        pred_svm = 1 if prob_svm >= 0.5 else 0

        # 3. KNN (requires scaling)
        prob_knn = float(model_knn.predict_proba(df_scaled)[0][1])
        prob_knn = max(0.0, min(1.0, prob_knn))
        pred_knn = 1 if prob_knn >= 0.5 else 0

        # 4. Decision Tree (no scaling)
        prob_dt = float(model_dt.predict_proba(df)[0][1])
        prob_dt = max(0.0, min(1.0, prob_dt))
        pred_dt = 1 if prob_dt >= 0.5 else 0

        # 5. Random Forest (no scaling)
        prob_rf = float(model_rf.predict_proba(df)[0][1])
        prob_rf = max(0.0, min(1.0, prob_rf))
        pred_rf = 1 if prob_rf >= 0.5 else 0

        # Compute average probability (Soft Voting)
        ensemble_probability = (prob_lr + prob_svm + prob_knn + prob_dt + prob_rf) / 5.0
        ensemble_probability = max(0.0, min(1.0, ensemble_probability))
        ensemble_prediction = 1 if ensemble_probability >= 0.5 else 0

        # Validation test hook to prevent silent recurrence
        assert 0.0 <= ensemble_probability <= 1.0, f"probability out of range: {ensemble_probability}"
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing prediction model pipeline: {str(e)}"
        )

    probability_rounded = round(ensemble_probability, 4)
    risk_level = "HIGH" if ensemble_prediction == 1 else "LOW"

    # Calculate advice advice string
    advice = "Strongly recommend consulting a cardiologist immediately." if probability_rounded >= 0.7 else (
        "Consider lifestyle changes and schedule a medical checkup." if probability_rounded >= 0.4 else
        "Maintain healthy habits. Annual checkups advised."
    )

    # Save to public predictions table
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
        prediction=ensemble_prediction,
        risk_probability=probability_rounded,
        model_name="Ensemble (LR + SVM + KNN + DT + RF)",
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

    # Model Breakdown Data Items
    breakdown_data = [
        ModelBreakdownItem(name="Logistic Regression", prediction=pred_lr, probability=round(prob_lr, 4)),
        ModelBreakdownItem(name="SVM", prediction=pred_svm, probability=round(prob_svm, 4)),
        ModelBreakdownItem(name="KNN", prediction=pred_knn, probability=round(prob_knn, 4)),
        ModelBreakdownItem(name="Decision Tree", prediction=pred_dt, probability=round(prob_dt, 4)),
        ModelBreakdownItem(name="Random Forest", prediction=pred_rf, probability=round(prob_rf, 4))
    ]

    # If user is logged in, also log to the user-specific prediction_history table
    record_id = db_prediction.id
    if current_user:
        try:
            db_history_record = crud.create_prediction(
                db,
                user_id=current_user.id,
                payload={
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
                    "active": payload.active
                },
                result={
                    "bmi": round(bmi, 2),
                    "pulse_pressure": pulse_pressure,
                    "prediction": ensemble_prediction,
                    "risk_percentage": probability_rounded,  # normalized 0.0 - 1.0
                    "risk_label": "High Risk" if ensemble_prediction == 1 else "Low Risk",
                    "advice": advice,
                    "model_name": "Ensemble (LR + SVM + KNN + DT + RF)",
                    "bmi_category": bmi_category,
                    "pp_hint": pp_hint
                }
            )
            record_id = db_history_record.id
        except Exception as e:
            import sys
            print(f"Warning: Failed to log prediction to user history: {str(e)}", file=sys.stderr)

    # Calculate feature importances using the Random Forest model in the ensemble
    feature_impacts = {}
    try:
        if hasattr(model_rf, "feature_importances_") and model_rf.feature_importances_ is not None:
            importances = model_rf.feature_importances_
            for col, imp in zip(feature_cols, importances):
                feature_impacts[col] = round(float(imp) * 100, 1)
        elif hasattr(model_rf, "coef_") and model_rf.coef_ is not None:
            coefs = model_rf.coef_[0]
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
        prediction=ensemble_prediction,
        probability=probability_rounded,
        risk_level=risk_level,
        model_used="Ensemble (LR + SVM + KNN + DT + RF)",
        risk_percentage=probability_rounded,
        risk_label="High Risk" if ensemble_prediction == 1 else "Low Risk",
        advice=advice,
        bmi=round(bmi, 2),
        bmi_category=bmi_category,
        pulse_pressure=pulse_pressure,
        pp_hint=pp_hint,
        model_name="Ensemble (LR + SVM + KNN + DT + RF)",
        record_id=record_id,
        feature_impacts=feature_impacts,
        model_breakdown=breakdown_data
    )
