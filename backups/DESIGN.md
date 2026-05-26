---
name: Vitalis Intelligence
colors:
  surface: '#f7faf8'
  surface-dim: '#d7dbd9'
  surface-bright: '#f7faf8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f3'
  surface-container: '#ebefed'
  surface-container-high: '#e5e9e7'
  surface-container-highest: '#e0e3e1'
  on-surface: '#181c1c'
  on-surface-variant: '#3e4947'
  inverse-surface: '#2d3130'
  inverse-on-surface: '#eef1f0'
  outline: '#6e7977'
  outline-variant: '#bdc9c6'
  surface-tint: '#006a63'
  primary: '#005c55'
  on-primary: '#ffffff'
  primary-container: '#0f766e'
  on-primary-container: '#a3faef'
  inverse-primary: '#80d5cb'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#7f4025'
  on-tertiary: '#ffffff'
  tertiary-container: '#9c573a'
  on-tertiary-container: '#ffe5db'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9cf2e8'
  primary-fixed-dim: '#80d5cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#00504a'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb598'
  on-tertiary-fixed: '#370e00'
  on-tertiary-fixed-variant: '#72361b'
  background: '#f7faf8'
  on-background: '#181c1c'
  surface-variant: '#e0e3e1'
  slate-text: '#0F172A'
  risk-high: '#EF4444'
  risk-low: '#10B981'
  surface-glass: rgba(255, 255, 255, 0.7)
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 1.5rem
  section-padding: 5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

# Cardio Risk Predictor – Frontend Design Specification
## 1. Project Overview & Aesthetic
**Goal:** Build a premium, conversion-quality front-end for a cardiovascular disease prediction system. The UI must feel like a polished healthcare SaaS product—responsive, accessible, clean, and visually impressive.
**Design Style & Visual Tone:**
* **Theme:** Modern healthcare + AI dashboard. Professional, calm, premium, and intelligent.
* **Palette:** White backgrounds, Slate text, Soft Blue/Teal primary actions, with Red accents reserved strictly for high-risk states or errors.
* **UI Elements:** Rounded cards, soft shadows, subtle glassmorphism (e.g., sticky headers or floating insight panels).
* **Typography:** Clean, sans-serif, spacious layout with a strong visual hierarchy.
* **Data Visualization:** Tasteful charts, progress indicators, animated number counters, and icon-driven sections.
## 2. Tech Stack Requirements
* **Framework:** React + Next.js with TypeScript.
* **Styling:** Tailwind CSS.
* **Components:** shadcn/ui.
* **Animations:** Framer Motion (page transitions, input focus, result reveal).
* **Icons:** lucide-react.
* **Charts:** Recharts (for gauges and trend placeholders).
## 3. Data & State Management
The form relies on strict state management to handle user inputs, auto-calculate metrics, and enforce validation rules before submission.
**User Inputs & Validation Ranges:**
* **age_years:** Number (1–100)
* **gender:** Pill selector (1 = Female, 2 = Male)
* **height:** Number in cm (130–220)
* **weight:** Number in kg (40–200)
* **ap_hi (Systolic BP):** Number (60–250)
* **ap_lo (Diastolic BP):** Number (40–200). *Rule: Submission blocked if ap_hi <= ap_lo.*
* **cholesterol:** Segmented control (1 = Normal, 2 = Above Normal, 3 = Well Above Normal)
* **gluc (Glucose):** Segmented control (1 = Normal, 2 = Above Normal, 3 = Well Above Normal)
* **smoke:** Toggle/Chip (0 = No, 1 = Yes)
* **alco (Alcohol):** Toggle/Chip (0 = No, 1 = Yes)
* **active (Physical Activity):** Toggle/Chip (0 = No, 1 = Yes)
**Derived Metrics (Auto-calculated, strictly no manual entry):**
* **bmi:** `weight / (height / 100)^2`
* **pulse_pressure:** `ap_hi - ap_lo`
## 4. UI Architecture & Page Sections
### 4.1 Hero Section
* **Headline:** "Predict Cardiovascular Risk in Seconds."
* **Subheadline:** "Empower your health decisions with our AI-assisted screening, analyzing your vitals and lifestyle factors in real-time."
* **CTAs:** Primary button "Start Assessment", Secondary button "View Demo".
* **Visuals:** A right-aligned floating hero graphic or 3D illustration of a health analytics dashboard card.
### 4.2 Features Section
* **Grid Layout:** 3-column or 2-column grid.
* **Key Highlights:** Real-time risk prediction, Auto-calculated BMI & pulse pressure, Smart form validation, Explainable health metrics.
* **Icons:** Use lucide-react icons (e.g., Activity, ShieldCheck, Zap).
### 4.3 Interactive Assessment Form (The Core Experience)
* **Layout:** A smart single-page layout with smooth vertical scrolling, or a horizontal wizard stepper.
* **Groupings:**
    * **Personal Info:** Age, Gender (elegant card selectors).
    * **Body Metrics:** Height, Weight (sliders with number input fallbacks).
    * **Blood Pressure:** Systolic, Diastolic (inline validation alerts if ap_hi <= ap_lo).
    * **Health Indicators:** Cholesterol, Glucose (human-readable labels, no raw numbers).
    * **Lifestyle Habits:** Smoke, Alcohol, Active (modern toggle chips).
* **Micro-interactions:** Fields glow blue on focus; checkmarks appear on valid blur.
### 4.4 Live Insights Panel (Side or Sticky Bottom)
* **Behavior:** Updates instantly as the user types in the form.
* **Content:**
    * **Live BMI:** Displays the value alongside a category badge (Underweight, Normal, Overweight, Obese).
    * **Pulse Pressure:** Displays the calculated value with a "Healthy/Elevated" hint.
    * **Progress:** A circular percentage indicator showing form completion.
* **Aesthetic:** Glassmorphic background, sticky on desktop, collapsible bottom-sheet on mobile.
### 4.5 Prediction Result Screen
* **Transition:** Show a skeleton loader and a "Analyzing health signals..." message for 1.5 seconds after submission.
* **Result Card:** Large, premium card.
    * **Risk Badge:** Red for "High Risk", Teal/Green for "Low Risk".
    * **Gauge:** A Recharts circular progress gauge showing the exact risk percentage.
    * **Advice Section:** Dynamic text based on risk tier (e.g., "Strongly recommend consulting a cardiologist immediately" vs "Maintain healthy habits").
* **Recap Panel:** A clean table summarizing the inputs and derived metrics.
* **Explainability:** "Key contributing signals" highlighting factors like Blood Pressure or Age that heavily influenced the model (extracted from backend feature importance).
* **Actions:** "Reassess", "Download Report" (PDF icon), "Save Result".
### 4.6 Dashboard Extras
* **Health Tips Carousel:** Small swipeable cards with heart-healthy advice.
* **Recent Assessments:** A placeholder table showing past fictional checkups.
* **API Status:** A small green dot in the footer indicating "Model Status: Online (Random Forest v1.0)".
## 5. API Integration Expectations
The UI must be wired to send and receive the following JSON payloads to the `/api/predict` endpoint.
**POST Request Payload:**
```json
{
  "age_years": 45,
  "gender": 2,
  "height": 175,
  "weight": 80,
  "ap_hi": 130,
  "ap_lo": 85,
  "cholesterol": 1,
  "gluc": 1,
  "smoke": 0,
  "alco": 0,
  "active": 1,
  "bmi": 26.12,
  "pulse_pressure": 45
}
Expected Response 
{
  "prediction": 1,
  "risk_percentage": 68.5,
  "risk_label": "High Risk",
  "advice": "Consider lifestyle changes and schedule a medical checkup.",
  "model_name": "Random Forest"
}