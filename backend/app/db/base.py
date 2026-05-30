from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Import models so they register with Base.metadata
from app.models.prediction import Prediction
from app.db.models import User, PredictionHistory
