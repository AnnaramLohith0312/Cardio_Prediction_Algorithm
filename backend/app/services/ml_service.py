import os
import joblib
import pandas as pd
from app.core.config import settings
from app.core.logger import logger

class MLService:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.load_model()

    def load_model(self):
        # Resolve paths dynamically
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
        
        # Try configured setting first, then search fallback directories
        model_paths = [
            os.path.join(base_dir, settings.MODEL_PATH),
            os.path.join(base_dir, "backend", "models", "cardio_final_model.pkl"),
            os.path.join(base_dir, "backend", "cardio_final_model.pkl"),
            os.path.join(base_dir, "cardio_final_model.pkl")
        ]
        
        scaler_paths = [
            os.path.join(base_dir, settings.SCALER_PATH),
            os.path.join(base_dir, "backend", "models", "cardio_scaler.pkl"),
            os.path.join(base_dir, "backend", "cardio_scaler.pkl"),
            os.path.join(base_dir, "cardio_scaler.pkl")
        ]
        
        model_path = None
        for p in model_paths:
            if os.path.exists(p):
                model_path = p
                break
                
        scaler_path = None
        for p in scaler_paths:
            if os.path.exists(p):
                scaler_path = p
                break

        if not model_path or not scaler_path:
            logger.error("Model binary files could not be found.")
            return

        try:
            self.model = joblib.load(model_path)
            self.scaler = joblib.load(scaler_path)
            logger.info(f"Successfully loaded ML model from {model_path}")
        except Exception as e:
            logger.error(f"Error loading model binaries: {str(e)}")

    def predict(self, data: dict) -> dict:
        if self.model is None or self.scaler is None:
            raise RuntimeError("ML model is not initialized.")
            
        # Calculate derived metrics from raw parameters
        bmi = round(data["weight"] / (data["height"] / 100) ** 2, 2)
        pulse_pressure = float(data["ap_hi"] - data["ap_lo"])
        
        # Inject derived features into dictionary for prediction inputs
        pred_data = data.copy()
        pred_data["bmi"] = bmi
        pred_data["pulse_pressure"] = pulse_pressure

        feature_cols = [
            "age_years", "gender", "height", "weight",
            "ap_hi", "ap_lo", "cholesterol", "gluc",
            "smoke", "alco", "active", "bmi", "pulse_pressure"
        ]
        
        df = pd.DataFrame([pred_data])[feature_cols]
        model_name = type(self.model).__name__
        
        if model_name in ["RandomForestClassifier", "DecisionTreeClassifier"]:
            pred_input = df
        else:
            pred_input = self.scaler.transform(df)
            
        prediction = int(self.model.predict(pred_input)[0])
        
        try:
            probability = float(self.model.predict_proba(pred_input)[0][1])
            risk_percentage = round(probability * 100, 1)
        except Exception:
            risk_percentage = 70.0 if prediction == 1 else 15.0
            
        risk_label = "High Risk" if prediction == 1 else "Low Risk"
        advice = "Strongly recommend consulting a cardiologist immediately." if risk_percentage >= 70 else (
            "Consider lifestyle changes and schedule a medical checkup." if risk_percentage >= 40 else
            "Maintain healthy habits. Annual checkups advised."
        )

        # Map category tags
        if bmi < 18.5:
            bmi_category = "Underweight"
        elif bmi <= 24.9:
            bmi_category = "Normal"
        elif bmi <= 29.9:
            bmi_category = "Overweight"
        else:
            bmi_category = "Obese"

        if pulse_pressure < 40:
            pp_hint = "Low - consult a doctor"
        elif pulse_pressure <= 60:
            pp_hint = "Healthy range"
        elif pulse_pressure <= 80:
            pp_hint = "Slightly elevated"
        else:
            pp_hint = "Elevated - review values"
        
        # Calculate feature importances / impacts
        feature_impacts = {}
        try:
            if hasattr(self.model, "feature_importances_") and self.model.feature_importances_ is not None:
                importances = self.model.feature_importances_
                for col, imp in zip(feature_cols, importances):
                    feature_impacts[col] = round(float(imp) * 100, 1)
            elif hasattr(self.model, "coef_") and self.model.coef_ is not None:
                coefs = self.model.coef_[0]
                abs_coefs = [abs(c) for c in coefs]
                total = sum(abs_coefs) if sum(abs_coefs) > 0 else 1
                for col, val in zip(feature_cols, abs_coefs):
                    feature_impacts[col] = round((val / total) * 100, 1)
            else:
                fallback = {
                    "age_years": 12.0,
                    "gender": 2.0,
                    "height": 4.0,
                    "weight": 6.0,
                    "ap_hi": 30.0,
                    "ap_lo": 15.0,
                    "cholesterol": 10.0,
                    "gluc": 5.0,
                    "smoke": 3.0,
                    "alco": 2.0,
                    "active": 3.0,
                    "bmi": 8.0,
                    "pulse_pressure": 15.0
                }
                feature_impacts = fallback
        except Exception as e:
            logger.error(f"Error calculating feature impacts: {str(e)}")
            feature_impacts = {col: 10.0 for col in feature_cols}

        return {
            "prediction": prediction,
            "risk_percentage": risk_percentage,
            "risk_label": risk_label,
            "advice": advice,
            "model_name": model_name,
            "bmi": bmi,
            "bmi_category": bmi_category,
            "pulse_pressure": pulse_pressure,
            "pp_hint": pp_hint,
            "feature_impacts": feature_impacts
        }


ml_service = MLService()
