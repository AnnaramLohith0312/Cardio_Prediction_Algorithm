from fastapi import APIRouter
from app.services.ml_service import ml_service

router = APIRouter()

@router.get("")
def health_check():
    model_loaded = ml_service.model is not None
    return {
        "status": "healthy",
        "model_loaded": model_loaded,
        "services": {
            "prediction_engine": "active" if model_loaded else "inactive"
        }
    }
