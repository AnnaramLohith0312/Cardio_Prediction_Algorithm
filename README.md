# CorMetrics

## 1. Overview
CorMetrics is a clinical decision support platform designed for cardiovascular risk prediction. It combines a premium, fully-responsive frontend (built with Next.js and Tailwind CSS) with a robust FastAPI Python backend. The core of the platform is an ensemble Machine Learning model, built from a comprehensive cardiovascular disease dataset, which evaluates patient data to predict the probability of cardiovascular risk.

## 2. Features
- **Authenticated Clinician Dashboard**: Secure access to patient analytics and system-wide key performance indicators (KPIs).
- **Multi-step Risk Assessment**: A guided, intuitive flow for capturing demographics, clinical vitals, and lifestyle metrics before a final review.
- **Ensemble Prediction Pipeline**: Leverages 5 distinct machine learning models (Logistic Regression, SVM, KNN, Decision Tree, Random Forest) through a soft-voting ensemble for highly accurate predictions.
- **Explainable Risk Breakdown**: Provides transparency by showing per-model predictions and per-feature impact percentages.
- **Downloadable Reports**: Generate and download comprehensive text/PDF reports of patient assessments.
- **Strict Data Isolation**: Assessment history is strictly scoped to the authenticated user to ensure privacy and security.

## 3. Tech Stack
- **Frontend**: Next.js (React), Tailwind CSS, with a premium UI generated via Stitch.
- **Backend**: FastAPI, Python, SQLAlchemy (SQLite).
- **Machine Learning**: `scikit-learn`, `pandas`, `numpy` (built via `cardio.py`).
- **Authentication**: JWT-based authentication via FastAPI OAuth2.

## 4. Machine Learning Pipeline (cardio.py)
The predictive engine of CorMetrics was built, trained, and evaluated using the `cardio.py` pipeline.

- **Dataset**:
  - Based on the Cardiovascular Disease dataset, containing approximately 70,000 records.
- **Preprocessing**:
  - Cleaned outliers (e.g., implausible blood pressure, height, and weight values).
  - Converted age from raw days to `age_years`.
  - Engineered derived clinical features:
    - `bmi = weight / (height/100)^2`
    - `pulse_pressure = ap_hi - ap_lo`
- **Feature Set**:
  - The final 13 features used for prediction are: `age_years`, `gender`, `height`, `weight`, `ap_hi`, `ap_lo`, `cholesterol`, `gluc`, `smoke`, `alco`, `active`, `bmi`, `pulse_pressure`.
- **Train/Validation Split**:
  - An 80/20 train/test split was used, with stratification on the target label to ensure balanced class representation.
- **Models**:
  - **Logistic Regression**: A baseline linear model.
  - **Support Vector Machine (SVM)**: Uses `LinearSVC` wrapped in a `CalibratedClassifierCV` for accurate probability estimates.
  - **K-Nearest Neighbors (KNN)**: Tuned to find the optimal *k* neighbors.
  - **Decision Tree**: Pruned (`max_depth=7`) to prevent overfitting.
  - **Random Forest**: An ensemble of 200 trees (`max_depth=12`) for high generalisation.
- **Scaling**:
  - Distance-based and linear models (LR, SVM, KNN) receive data scaled via `StandardScaler`.
  - Tree-based models (Decision Tree, Random Forest) receive unscaled data.
- **Ensemble Logic**:
  - The API uses a **Soft-Voting Ensemble**.
  - For a given patient, each of the 5 models computes a probability of cardiovascular disease (from 0.0 to 1.0).
  - These 5 probabilities are averaged to produce the final ensemble probability.
  - The system predicts **HIGH RISK** if the ensemble probability is ≥ 0.5, and **LOW RISK** otherwise.
- **Evaluation**:
  - The models exhibit strong predictive power, with Random Forest and Logistic Regression typically leading in accuracy (~73-74%) and AUC. Blood pressure (`ap_hi`, `ap_lo`) and `age_years` are identified as the strongest predictive features.

## 5. API Endpoints
All API endpoints are securely served by FastAPI. Assessment and dashboard endpoints are user-scoped and require an `Authorization: Bearer <token>` header.

- `POST /api/v1/auth/register` - Register a new clinician account.
- `POST /api/v1/auth/login` - Authenticate and receive a JWT token.
- `POST /api/v1/predict` - Accepts the 11 base clinical features. For security, `bmi` and `pulse_pressure` are recomputed server-side. Returns the ensemble risk probability and logs the assessment to the user's history.
- `GET /api/v1/assessments` - Retrieves the authenticated user's historical risk assessments.
- `GET /api/v1/dashboard/stats` - Returns aggregate statistics (KPIs, model accuracy, risk factors) strictly scoped to the current authenticated user's patient data.

## 6. Frontend Flows
- **Sign In / Sign Up**: Clinicians authenticate to access the platform.
- **Run a New Assessment**: Navigating to `/assess` triggers a step-by-step wizard to input demographic, clinical, and lifestyle data.
- **View Results**: The result page displays the final ensemble probability, risk drivers (feature impacts), a breakdown of how each model voted, and actionable lifestyle guidance.
- **Dashboard & History**: The `/dashboard` route provides aggregate analytics and a table of the clinician's recent patient assessments.
- **Download Report**: Clinicians can download a fully interpolated, plain-text report of the assessment results for their records.

## 7. Setup & Running Locally

### Prerequisites
- Python 3.9+
- Node.js 18+

### Backend Setup
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```
   *The backend will be available at http://localhost:8000. API docs at http://localhost:8000/docs.*

### Frontend Setup
1. Open a new terminal and navigate to the root directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure your `.env.local` file contains the API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The frontend will be available at http://localhost:3000.*

## 8. Security & Privacy Notes
- **Data Isolation**: The CorMetrics API enforces strict horizontal privilege protection. A user can only view, query, and aggregate prediction histories that belong to their own account. 
- **Intended Use**: CorMetrics is designed as a **clinical decision support tool**, not a diagnostic tool. It is meant to assist healthcare professionals in identifying at-risk patients.
- **Demo Data**: When running in test mode or demo environments, never input real patient identifiers (PHI/PII).

## 9. Limitations & Future Work
- **Dataset Limitations**: The current ensemble is trained on a single, static dataset. External validation across diverse clinical populations is required before production medical use.
- **Future Improvements**:
  - Implement continuous model calibration pipelines.
  - Integrate additional predictive models (e.g., XGBoost, Deep Neural Networks).
  - Add administrative and clinic-wide dashboard views with strict Role-Based Access Control (RBAC) to allow shared team insights.
