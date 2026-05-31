import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
import os

# Append paths so tests run properly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from app.db.session import Base
from app.core.dependencies import get_db

from sqlalchemy.pool import StaticPool

# Create temporary in-memory database for testing using StaticPool to share connection
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_health(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_auth_and_prediction(client):
    # 1. Sign Up
    signup_data = {
        "email": "test@cardio.com",
        "username": "test_user",
        "password": "Testpassword123",
        "full_name": "Test User"
    }
    response = client.post("/api/v1/auth/signup", json=signup_data)
    assert response.status_code == 200
    assert response.json()["username"] == "test_user"
    assert "access_token" in response.json()

    # 2. Login
    login_data = {
        "username": "test@cardio.com",
        "password": "Testpassword123"
    }
    response = client.post("/api/v1/auth/login", data=login_data)
    assert response.status_code == 200
    token = response.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}

    # 3. Predict (Valid case)
    predict_payload = {
        "age_years": 45.0,
        "gender": 2,
        "height": 175.0,
        "weight": 75.0,
        "ap_hi": 120.0,
        "ap_lo": 80.0,
        "cholesterol": 1,
        "gluc": 1,
        "smoke": 0,
        "alco": 0,
        "active": 1
    }
    response = client.post("/api/v1/predict", json=predict_payload, headers=headers)
    assert response.status_code == 200
    res_data = response.json()
    assert "prediction" in res_data
    assert "risk_percentage" in res_data
    assert "risk_label" in res_data
    assert res_data["bmi"] == 24.49
    assert res_data["bmi_category"] == "Normal"
    assert res_data["pulse_pressure"] == 40.0
    assert res_data["pp_hint"] == "Healthy range"
    assert "record_id" in res_data

    # 4. Fetch History
    response = client.get("/api/v1/history?limit=10&offset=0", headers=headers)
    assert response.status_code == 200
    history = response.json()
    assert len(history) == 1
    record_id = res_data["record_id"]
    assert history[0]["record_id"] == record_id

    # 5. Fetch single record by ID
    response = client.get(f"/api/v1/history/{record_id}", headers=headers)
    assert response.status_code == 200
    single_record = response.json()
    assert single_record["record_id"] == record_id
    assert single_record["bmi"] == 24.49

    # 6. Fetch non-existent record ID
    response = client.get("/api/v1/history/9999", headers=headers)
    assert response.status_code == 404
