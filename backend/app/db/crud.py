from sqlalchemy.orm import Session
from app.db import models
from app.core.security import get_password_hash

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, email: str, username: str, password_plain: str, full_name: str):
    hashed = get_password_hash(password_plain)
    db_user = models.User(email=email, username=username, hashed_password=hashed, full_name=full_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_prediction(db: Session, user_id: int, payload: dict, result: dict):
    db_prediction = models.PredictionHistory(
        user_id=user_id,
        # Inputs
        age_years=payload["age_years"],
        gender=payload["gender"],
        height=payload["height"],
        weight=payload["weight"],
        ap_hi=payload["ap_hi"],
        ap_lo=payload["ap_lo"],
        cholesterol=payload["cholesterol"],
        gluc=payload["gluc"],
        smoke=payload["smoke"],
        alco=payload["alco"],
        active=payload["active"],
        bmi=result["bmi"],
        pulse_pressure=result["pulse_pressure"],
        # Outputs
        prediction=result["prediction"],
        risk_percentage=result["risk_percentage"],
        risk_label=result["risk_label"],
        advice=result["advice"],
        model_name=result["model_name"],
        bmi_category=result["bmi_category"],
        pp_hint=result["pp_hint"]
    )
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    return db_prediction

def get_user_predictions(db: Session, user_id: int, limit: int = 100, offset: int = 0):
    return (
        db.query(models.PredictionHistory)
        .filter(models.PredictionHistory.user_id == user_id)
        .order_by(models.PredictionHistory.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

def get_user_prediction_by_id(db: Session, user_id: int, prediction_id: int):
    return (
        db.query(models.PredictionHistory)
        .filter(
            models.PredictionHistory.id == prediction_id,
            models.PredictionHistory.user_id == user_id
        )
        .first()
    )
