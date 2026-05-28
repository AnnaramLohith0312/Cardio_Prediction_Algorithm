from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.dependencies import get_db, get_current_user
from app.db import crud
from app.schemas import prediction as pred_schemas
from app.schemas import user as user_schemas

router = APIRouter()

@router.get("", response_model=List[pred_schemas.PredictionHistoryResponse])
def get_history(
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: user_schemas.UserResponse = Depends(get_current_user)
):
    return crud.get_user_predictions(db, user_id=current_user.id, limit=limit, offset=offset)

@router.get("/{record_id}", response_model=pred_schemas.PredictionHistoryResponse)
def get_history_by_id(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: user_schemas.UserResponse = Depends(get_current_user)
):
    prediction = crud.get_user_prediction_by_id(db, user_id=current_user.id, prediction_id=record_id)
    if not prediction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediction record not found"
        )
    return prediction
