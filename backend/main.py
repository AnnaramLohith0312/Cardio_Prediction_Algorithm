import uvicorn
import joblib
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.db.init_db import create_tables
from app.api.v1.endpoints import health, auth, predict, history, dashboard

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles application startup and shutdown events:
    - Verifies or creates database schemas.
    - Loads the trained Machine Learning model and scaler into application state memory.
    """
    # Initialize database tables
    create_tables()

    # Determine dynamic path to load model/scaler
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, "models", "cardio_final_model.pkl")
    scaler_path = os.path.join(base_dir, "models", "cardio_scaler.pkl")

    # Fallbacks if running from a nested directory structure
    if not os.path.exists(model_path):
        model_path = os.path.join(base_dir, "app", "models", "cardio_final_model.pkl")
    if not os.path.exists(scaler_path):
        scaler_path = os.path.join(base_dir, "app", "models", "cardio_scaler.pkl")

    # Final settings backup fallbacks
    if not os.path.exists(model_path):
        model_path = settings.MODEL_PATH
    if not os.path.exists(scaler_path):
        scaler_path = settings.SCALER_PATH

    try:
        app.state.model = joblib.load(model_path)
        app.state.scaler = joblib.load(scaler_path)
    except Exception as e:
        app.state.model = None
        app.state.scaler = None
        # Print to stderr for tracking during dev/startup
        import sys
        print(f"CRITICAL: Failed to load machine learning models on startup: {str(e)}", file=sys.stderr)

    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# CORS configurations matching strict frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route mappings
app.include_router(health.router, prefix=f"{settings.API_V1_STR}/health", tags=["Health"])
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Auth"])
app.include_router(predict.router, prefix=f"{settings.API_V1_STR}/predict", tags=["Prediction"])
app.include_router(history.router, prefix=f"{settings.API_V1_STR}/history", tags=["History"])
app.include_router(dashboard.router, prefix=f"{settings.API_V1_STR}/dashboard", tags=["Dashboard"])

@app.get("/")
def read_root():
    """
    Root endpoint serving basic service metadata.
    """
    return {
        "status": "ok",
        "service": "CardioSense AI Backend",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
