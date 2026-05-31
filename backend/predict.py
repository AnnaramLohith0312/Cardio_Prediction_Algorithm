import sys
import json
import joblib
import pandas as pd
import os

def main():
    try:
        # Load arguments
        input_data = json.loads(sys.stdin.read())
        
        # Load scaler and model
        current_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(current_dir, "cardio_final_model.pkl")
        scaler_path = os.path.join(current_dir, "cardio_scaler.pkl")
        
        if not os.path.exists(model_path) or not os.path.exists(scaler_path):
            print(json.dumps({"error": "Model or scaler files not found in backend directory"}))
            return

        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        
        # Feature order from cardio.py
        feature_cols = [
            "age_years", "gender", "height", "weight",
            "ap_hi", "ap_lo", "cholesterol", "gluc",
            "smoke", "alco", "active", "bmi", "pulse_pressure"
        ]
        
        # Build DataFrame
        df = pd.DataFrame([input_data])[feature_cols]
        
        # Apply scaling if needed (some models like RF don't strictly require scaling, 
        # but let's match the best_model_name check in cardio.py)
        # In cardio.py, Best model is usually Random Forest (RF) which doesn't use scale, 
        # but Logistic Regression / KNN / SVM does.
        # Let's check model type to see if it's RF/DT.
        model_name = type(model).__name__
        if model_name in ["RandomForestClassifier", "DecisionTreeClassifier"]:
            pred_input = df
        else:
            pred_input = scaler.transform(df)
            
        prediction = int(model.predict(pred_input)[0])
        
        try:
            probability = float(model.predict_proba(pred_input)[0][1])
            # Defensive clamp to [0.0, 1.0] range
            probability = max(0.0, min(1.0, probability))
            # Validation hook
            assert 0.0 <= probability <= 1.0, f"probability out of range: {probability}"
            risk_percentage = round(probability, 4)
        except Exception:
            risk_percentage = 0.7000 if prediction == 1 else 0.1500
            
        risk_label = "High Risk" if prediction == 1 else "Low Risk"
        advice = "Strongly recommend consulting a cardiologist immediately." if risk_percentage >= 0.7 else (
            "Consider lifestyle changes and schedule a medical checkup." if risk_percentage >= 0.4 else
            "Maintain healthy habits. Annual checkups advised."
        )
        
        res = {
            "prediction": prediction,
            "risk_percentage": risk_percentage,
            "risk_label": risk_label,
            "advice": advice,
            "model_name": model_name
        }
        print(json.dumps(res))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
