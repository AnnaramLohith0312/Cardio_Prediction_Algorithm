import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Cardio Risk Predictor API"
    API_V1_STR: str = "/api/v1"
    
    # Credentials & Security (Read from env with sensible fallbacks)
    SECRET_KEY: str = "your-super-secret-jwt-signing-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    GOOGLE_CLIENT_ID: str = ""
    
    # DB URL
    DATABASE_URL: str = "sqlite:///./cardio.db"

    # ML Model Configs
    MODEL_PATH: str = "models/cardio_final_model.pkl"
    SCALER_PATH: str = "models/cardio_scaler.pkl"

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
