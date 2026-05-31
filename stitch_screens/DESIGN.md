# CardioSense AI — Premium UI/UX Master Spec for Stitch
> Objective: Design and generate a visually exceptional, premium, medically trustworthy web application for the `cardio.py` cardiovascular ML algorithm. The product must feel like a world-class healthcare AI platform, not a student dashboard or generic form app.
---
## Core Mission
Create a complete multi-page web experience for **CardioSense AI**, a cardiovascular risk screening platform powered by the `cardio.py` ensemble ML pipeline.
The experience must transform the raw machine learning workflow into a polished, reassuring, highly usable product that helps users:
- enter cardiovascular health data confidently
- receive an ensemble prediction from all ML models
- understand why the risk score was generated
- get lifestyle improvement suggestions and next steps
- trust the product visually and functionally
This should feel like the UI/UX standard of a premium health-tech SaaS product funded by top investors and used in real preventive healthcare environments.
---
## Non-Negotiable Experience Goals
The final UI must feel:
- premium, not template-like
- medical, but not cold
- intelligent, but not overly technical
- calm, but not boring
- modern, but not flashy
- elegant, but still highly usable
- trustworthy enough for health-related decision support
Avoid anything that feels:
- generic AI startup
- purple-gradient SaaS template
- glassmorphism-heavy
- over-decorated
- childish, cartoonish, or playful
- sterile hospital software from 2010
- dashboard clutter with too many widgets
---
## Design Direction
### Product Personality
CardioSense AI is:
- clinical
- intelligent
- reassuring
- data-driven
- refined
- futuristic in a subtle way
### Emotional Tone
The user should feel:
- “This looks credible.”
- “This is advanced, but understandable.”
- “I trust this result.”
- “This app takes my health seriously.”
- “This feels more like a real product than a student project.”
---
## Visual Art Direction
### Brand Style
Design CorMetrics as a **premium healthcare intelligence platform**.
Blend these inspirations:
- high-end healthcare SaaS
- modern AI diagnostics platform
- executive dashboard clarity
- clean editorial typography
- subtle medical data visualization
- intelligent dark-mode product aesthetics
### Visual Language
Use:
- strong layout structure
- deep contrast
- sophisticated spacing
- restrained motion
- clear hierarchy
- elegant typography
- subtle medical visuals such as ECG traces, pulse lines, grid overlays, structured data cards, and diagnostic motifs
Do not use:
- loud neon
- random blobs
- cheap gradients
- bright startup colors
- decorative icons everywhere
- card overload
- excessive rounded pills on every element
---
## Color System
Use a refined premium medical palette.
### Primary Palette
- Background primary: `#08111f`
- Background secondary: `#0f172a`
- Surface: `#111827`
- Elevated surface: `#1f2937`
- Card highlight: `#0b1220`
- Text primary: `#f8fafc`
- Text secondary: `#cbd5e1`
- Text muted: `#94a3b8`
- Border: `rgba(255,255,255,0.08)`
### Semantic Colors
- Primary teal: `#0f766e`
- Bright teal accent: `#14b8a6`
- High risk red: `#dc2626`
- Medium risk amber: `#f59e0b`
- Low risk green: `#16a34a`
- Accent blue for charts: `#38bdf8`
### Color Rules
- Base UI should be mostly dark navy/slate neutrals
- Teal should represent intelligence, calmness, and trusted action
- Red should appear only for actual elevated risk or urgent warnings
- Green should be used sparingly for healthy ranges and low-risk outcomes
- Never oversaturate the screen with too many strong colors at once
---
## Typography
### Font Pairing
Use a premium serif + modern sans combination:
- Display / headings: elegant serif style similar to Instrument Serif
- UI / body / data / labels: clean modern sans similar to Inter or Satoshi
### Type Hierarchy
- Hero heading: 48–64px desktop, 34–42px mobile
- Page heading: 28–36px
- Section heading: 20–24px
- Card title: 16–18px
- Body text: 15–16px
- Labels / metadata: 12–13px
### Typography Rules
- Headings should feel editorial and premium
- Body text should remain clean and clinical
- Numeric risk values should use highly legible weight and spacing
- Do not overuse large text
- Use whitespace and scale to create importance instead of excessive boldness
---
## Layout Principles
### Overall Structure
Build a full multi-page application with strong visual rhythm and premium spacing.
Use:
- generous horizontal breathing room
- layered sections with depth
- consistent max-width containers
- asymmetry in hero sections
- clean card grids for content-heavy pages
- strong section separation through background shifts, borders, and spacing
### Spacing
- roomy, premium spacing
- no cramped cards
- no giant empty dead space without purpose
- every section should feel intentionally composed
### Shape Language
- cards: 16px radius
- inputs: 12px radius
- buttons: 12px radius
- pills/badges: full radius
- avoid mixing too many radius styles
---
## Product Architecture
Create these pages:
1. Landing Page `/`
2. Risk Assessment `/assess`
3. Results Page `/assess/result`
4. Analytics Dashboard `/dashboard`
5. About Methodology `/about`
6. Sign In `/signin`
7. Sign Up `/signup`
The application must feel coherent across all pages, not like separate designs.
---
## Landing Page
### Goal
Immediately communicate:
- what the platform does
- why it matters
- why it is trustworthy
- what the user should do next
### Hero Section
Create a cinematic but restrained hero.
Left side:
- brand mark + CorMetrics
- eyebrow text: “AI-powered cardiovascular screening”
- headline: “Detect heart risk earlier with intelligent clinical screening.”
- supporting copy: concise and trustworthy
- CTA buttons:
  - Primary: Start Assessment
  - Secondary: View Dashboard
Right side:
- premium visual composition including:
  - ECG line motif
  - floating risk summary card
  - structured diagnostic panels
  - subtle chart blocks
  - faint medical grid background
  - soft radial illumination in teal/red at low opacity
### Supporting Sections
1. How it works
2. Why clinicians trust it
3. Ensemble model intelligence
4. Health guidance after prediction
5. CTA footer
### Landing Page Rule
It must look like a real health-tech company homepage, not a hackathon landing page.
---
## Sign In / Sign Up
### Objective
Make auth pages feel premium, elegant, and trustworthy.
### Layout
Desktop:
- split layout
- left panel: brand storytelling, ECG visual, trust statements
- right panel: clean form
Mobile:
- simplified single-column version with compact header
### Form Experience
- clean input fields with clear labels
- remove browser autofill ugliness
- strong contrast
- polished error states
- visible CTA
- optional Google sign-in button
- subtle trust note about encrypted health data
### Tone
The auth experience must feel like a premium medical product, not a generic login screen.
---
## Assessment Flow
### Objective
Make clinical data entry feel guided, calm, and intelligent.
### Structure
Multi-step form with progress indicator:
- Step 1: Demographics
- Step 2: Clinical values
- Step 3: Lifestyle factors
- Step 4: Review and submit
### Input Design
Fields:
- age
- gender
- height
- weight
- systolic BP
- diastolic BP
- cholesterol
- glucose
- smoking
- alcohol
- physical activity
### Smart UI Behavior
- auto-calculate BMI in real time
- auto-calculate pulse pressure
- show helper labels for normal ranges
- validate gently, not aggressively
- provide microcopy that explains what each field means
- disable progression if step is invalid
### Assessment UX
The form must feel lighter than a hospital intake form and more guided than a raw admin panel.
---
## Results Page
### This is the hero product page.
The results page must be the most visually impressive and most useful part of the entire application.
### Page Structure
#### 1. Prediction Hero Card
Show:
- HIGH RISK / LOW RISK badge
- main probability number
- ensemble explanation
- model count used
- confidence framing
The result card should feel premium, serious, and visually dominant.
#### 2. Model Breakdown
Show all five models:
- Logistic Regression
- SVM
- KNN
- Decision Tree
- Random Forest
For each:
- prediction
- probability
- compact status chip
- optional confidence bar
Also show:
- consensus summary
- “4 of 5 models indicate elevated cardiovascular risk”
This section should make the ML system feel transparent and reliable.
#### 3. Key Factors
Turn model reasoning into understandable UI:
- high blood pressure
- elevated BMI
- cholesterol
- glucose
- inactivity
- age
- smoking / alcohol where relevant
Represent them as:
- structured factor cards
- each with current value
- explanation line
- positive or negative contribution styling
#### 4. Lifestyle Improvements
This section must feel actionable and supportive.
Generate tailored cards for:
- blood pressure management
- cholesterol improvement
- glucose management
- physical activity
- smoking cessation
- alcohol reduction
- weight management
- preventive screening follow-up
Each card should include:
- icon
- title
- short explanation
- 3–4 concrete suggestions
- priority level
#### 5. 7-Day Action Plan
Create a practical checklist:
- walk daily
- reduce sodium
- monitor BP
- book consultation if needed
- review smoking/alcohol habits
- improve meal quality
#### 6. Medical Guidance
Show a clear but calm section:
- when to seek urgent medical help
- when to schedule a routine check-up
- disclaimer that this is not a diagnosis
#### 7. Download / Share
Include premium action buttons:
- Download Report
- Print Summary
- Save Result
### Results Page Rule
The results page should feel worthy of the ML algorithm.
It must transform raw prediction output into clarity, confidence, and action.
---
## Dashboard
### Objective
Present analytics with honesty and elegance.
### Sections
- KPI row
- model performance chart
- feature importance chart
- recent prediction table
- risk distribution chart
- patient trend overview
### Dashboard Rules
- avoid clutter
- prioritize readability
- use charts only where useful
- never make it feel like a random analytics panel
- use strong layout hierarchy
### Chart Style
- dark theme charts
- subtle grids
- clean axis labels
- no rainbow palettes
- teal/blue/amber/red only when meaningful
---
## About / Methodology
This page should increase trust.
Include:
- what the platform does
- which features are used
- how the ensemble works
- why multiple models improve reliability
- what feature engineering is used (`age_years`, `bmi`, `pulse_pressure`)
- limitations
- disclaimer
Tone:
- transparent
- readable
- clear
- not overly academic
---
## Motion Design
Use subtle, premium motion:
- fade-up on page load
- smooth route transitions
- hover elevation on cards
- button hover with tiny lift
- step progress animation
- loading shimmer
- chart reveal animations
Do not use:
- bouncing
- dramatic spins
- flashy morphs
- distracting loops
Motion should reinforce confidence and smoothness.
---
## Accessibility & Usability
Must include:
- WCAG AA contrast
- strong keyboard navigation
- visible focus states
- clear labels
- supportive validation messages
- clear hierarchy for screen readers
- touch-friendly sizing on mobile
Must feel:
- easy to scan
- easy to complete
- easy to trust
---
## Trust Signals
Integrate subtle but strong trust cues throughout:
- “Based on an ensemble of 5 models”
- “Designed for early screening support”
- “Your health data is securely handled”
- “Supports healthier lifestyle decisions”
- “Not a replacement for professional diagnosis”
These should appear naturally, not like marketing spam.
---
## Stitch Output Instructions
Generate this as a polished **Next.js + Tailwind** multi-page app design.
Important:
- prioritize visual excellence
- do not generate generic placeholder layouts
- do not use weak low-contrast forms
- do not leave large dead areas empty
- do not rely on repetitive cards everywhere
- do not make the results page look like a spreadsheet
Instead:
- create cinematic yet usable hero sections
- use premium data cards
- build a standout results interface
- create a trustworthy clinical design system
- ensure every page feels part of one premium product ecosystem
---
## Technical Alignment
The UI must be designed to integrate with the `cardio.py` ML backend.
Expected backend behavior:
- prediction endpoint returns ensemble probability
- model breakdown returns probabilities for all five models
- recommendation engine returns tailored lifestyle guidance
- dashboard stats return model metrics and feature importance
Fields expected by the model:
- age_years
- gender
- height
- weight
- ap_hi
- ap_lo
- cholesterol
- gluc
- smoke
- alco
- active
- bmi
- pulse_pressure
Do not redesign the data model.
Design the interface around it intelligently.
---
## Ultimate Quality Bar
This should look like:
- a real funded healthcare AI startup
- a polished SaaS platform
- a serious medical intelligence product
- a portfolio-worthy full-stack ML product
This should NOT look like:
- a bootstrap dashboard
- a school project
- a random admin panel
- a form pasted on a gradient background
The final result must be visually uplifting, deeply usable, and impressive enough to make the ML algorithm feel as strong as it truly is.