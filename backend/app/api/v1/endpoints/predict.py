from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_user
from app.db import crud
from app.schemas import prediction as pred_schemas
from app.schemas import user as user_schemas
from app.services.ml_service import ml_service

router = APIRouter()

@router.post("", response_model=pred_schemas.PredictionOutput)
def predict_cardio_risk(
    payload: pred_schemas.PredictionInput,
    db: Session = Depends(get_db),
    current_user: user_schemas.UserResponse = Depends(get_current_user)
):
    try:
        # Run inference using ML Service
        result = ml_service.predict(payload.model_dump())
        
        # Log to db history
        db_record = crud.create_prediction(
            db, user_id=current_user.id, payload=payload.model_dump(), result=result
        )
        
        # Inject record_id into the response dict
        result["record_id"] = db_record.id
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error: {str(e)}"
        )
