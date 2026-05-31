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

    # Determine dynamic paths for models folder fallback
    base_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(base_dir, "models")
    if not os.path.exists(models_dir):
        models_dir = os.path.join(base_dir, "app", "models")
    if not os.path.exists(models_dir):
        models_dir = base_dir

    def load_bin(filename):
        path = os.path.join(models_dir, filename)
        if not os.path.exists(path):
            path = os.path.join(base_dir, filename)
        return joblib.load(path)

    try:
        app.state.model_lr = load_bin("logistic_regression_model.pkl")
        app.state.model_svm = load_bin("svm_model.pkl")
        app.state.model_knn = load_bin("knn_model.pkl")
        app.state.model_dt = load_bin("decision_tree_model.pkl")
        app.state.model_rf = load_bin("random_forest_model.pkl")
        app.state.scaler = load_bin("cardio_scaler.pkl")
        
        # Backward compatibility fallback
        app.state.model = app.state.model_rf
    except Exception as e:
        app.state.model_lr = None
        app.state.model_svm = None
        app.state.model_knn = None
        app.state.model_dt = None
        app.state.model_rf = None
        app.state.scaler = None
        app.state.model = None
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
