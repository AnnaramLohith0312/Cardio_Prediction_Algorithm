import pytest
from pydantic import ValidationError
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.schemas.prediction import PredictionInput

def test_prediction_input_validation():
    # Valid schema payload
    valid_data = {
        "age_years": 45,
        "gender": 2,
        "height": 175,
        "weight": 75,
        "ap_hi": 120,
        "ap_lo": 80,
        "cholesterol": 1,
        "gluc": 1,
        "smoke": 0,
        "alco": 0,
        "active": 1
    }
    input_obj = PredictionInput(**valid_data)
    assert input_obj.age_years == 45.0

    # Invalid blood pressure rule: ap_hi <= ap_lo
    invalid_bp = valid_data.copy()
    invalid_bp["ap_hi"] = 110
    invalid_bp["ap_lo"] = 110
    
    with pytest.raises(ValidationError) as exc_info:
        PredictionInput(**invalid_bp)
    assert "Systolic pressure must be higher than diastolic pressure" in str(exc_info.value)

    # Invalid age limits
    invalid_age = valid_data.copy()
    invalid_age["age_years"] = 120
    
    with pytest.raises(ValidationError) as exc_info:
        PredictionInput(**invalid_age)
    assert "Input should be less than or equal to 100" in str(exc_info.value)

    # Invalid gender options
    invalid_gender = valid_data.copy()
    invalid_gender["gender"] = 3
    with pytest.raises(ValidationError) as exc_info:
        PredictionInput(**invalid_gender)
    assert "Input should be 1 or 2" in str(exc_info.value)

from app.schemas.user import UserRegister

def test_user_register_validation():
    # Valid register data
    valid_register = {
        "email": "test@vitalis.com",
        "username": "vitalis_user_1",
        "password": "Password123",
        "full_name": "Vitalis User"
    }
    obj = UserRegister(**valid_register)
    assert obj.username == "vitalis_user_1"

    # Invalid username format (contains space)
    invalid_username = valid_register.copy()
    invalid_username["username"] = "vitalis user"
    with pytest.raises(ValidationError) as exc_info:
        UserRegister(**invalid_username)
    assert "Username must contain only alphanumeric characters and underscores" in str(exc_info.value)

    # Invalid password strength (no uppercase)
    invalid_password_upper = valid_register.copy()
    invalid_password_upper["password"] = "password123"
    with pytest.raises(ValidationError) as exc_info:
        UserRegister(**invalid_password_upper)
    assert "Password must contain at least one uppercase letter" in str(exc_info.value)

    # Invalid password strength (no digit)
    invalid_password_digit = valid_register.copy()
    invalid_password_digit["password"] = "Password"
    with pytest.raises(ValidationError) as exc_info:
        UserRegister(**invalid_password_digit)
    assert "Password must contain at least one digit" in str(exc_info.value)

