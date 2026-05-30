from app.db.session import engine
from app.db.base import Base

def create_tables() -> None:
    """
    Creates all database tables defined in the Base metadata (User, PredictionHistory, Prediction)
    if they do not exist yet in the SQLite database.
    """
    Base.metadata.create_all(bind=engine)
