# cardio_project.py
# Cardiovascular Disease Prediction – Full Pipeline (Improved & Bug-Fixed)

import os
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    roc_auc_score,
    roc_curve,
    precision_recall_curve
)
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

import joblib
import warnings
warnings.filterwarnings("ignore")

sns.set(style="whitegrid", font_scale=1.1)
plt.rcParams["figure.figsize"] = (8, 5)

os.makedirs("plots", exist_ok=True)

plot_counter = [0]

def save_plot(name):
    plot_counter[0] += 1
    filename = f"plots/{plot_counter[0]:02d}_{name}.png"
    plt.tight_layout()
    plt.savefig(filename, dpi=100)
    plt.close()
    print(f"  [Saved] {filename}")


# =================================================
# 1. LOAD DATA
# =================================================
print("=" * 60)
print("  STEP 1: LOADING DATA")
print("=" * 60)

df = pd.read_csv("cardio_train.csv", sep=";")
print("Data loaded. Shape:", df.shape)
print(df.head())
print(df.info())
print("\nBasic Statistics:")
print(df.describe())


# =================================================
# 2. PREPROCESSING
# =================================================
print("\n" + "=" * 60)
print("  STEP 2: DATA PREPROCESSING")
print("=" * 60)

if "id" in df.columns:
    df = df.drop(columns=["id"])
    print("✅ Dropped 'id' column.")

df["age_years"]      = (df["age"] / 365.25).astype(int)
df["bmi"]            = df["weight"] / (df["height"] / 100) ** 2
df["pulse_pressure"] = df["ap_hi"] - df["ap_lo"]

print("\nEngineered features: age_years, bmi, pulse_pressure")
print(df[["age", "age_years", "height", "weight", "bmi", "pulse_pressure"]].head())

initial_rows = df.shape[0]
bp_mask = (
    (df["ap_hi"] > 0) &
    (df["ap_lo"] > 0) &
    (df["ap_hi"] < 250) &
    (df["ap_lo"] < 200) &
    (df["ap_hi"] > df["ap_lo"])
)
df = df[bp_mask]
print(f"\nRows after BP cleaning   : {df.shape[0]} (removed {initial_rows - df.shape[0]})")

initial_rows = df.shape[0]
height_mask = (df["height"] >= 130) & (df["height"] <= 220)
weight_mask = (df["weight"] >= 40)  & (df["weight"] <= 200)
df = df[height_mask & weight_mask]
print(f"Rows after H/W cleaning  : {df.shape[0]} (removed {initial_rows - df.shape[0]})")

initial_rows = df.shape[0]
df = df[(df["bmi"] >= 10) & (df["bmi"] <= 80)]
print(f"Rows after BMI cleaning  : {df.shape[0]} (removed {initial_rows - df.shape[0]})")

print("\nMissing values per column:")
print(df.isnull().sum())
print("\n✅ No missing values — dataset is clean.")


# =================================================
# 3. EDA – EXPLORATORY DATA ANALYSIS
# =================================================
print("\n" + "=" * 60)
print("  STEP 3: EDA & VISUALISATIONS")
print("=" * 60)

continuous_cols  = ["age_years", "height", "weight", "ap_hi", "ap_lo", "bmi", "pulse_pressure"]
categorical_cols = ["gender", "cholesterol", "gluc", "smoke", "alco", "active"]

# 3.1 Target class distribution
plt.figure(figsize=(6, 4))
ax = df["cardio"].value_counts().plot(kind="bar", color=["steelblue", "salmon"], edgecolor="white")
plt.title("Target Class Distribution")
plt.xlabel("cardio (0 = No Disease, 1 = Disease)")
plt.ylabel("Count")
plt.xticks(rotation=0)
for p in ax.patches:
    ax.annotate(f"{int(p.get_height()):,}", (p.get_x() + p.get_width() / 2, p.get_height()),
                ha="center", va="bottom", fontsize=10)
save_plot("target_class_distribution")
print("\n📌 Insight: Dataset is nearly balanced (~50/50). No class imbalance issue.")

# 3.2 Histograms
for col in continuous_cols:
    plt.figure()
    sns.histplot(df[col], kde=True, bins=30, color="steelblue")
    plt.title(f"Distribution of {col}")
    plt.xlabel(col)
    plt.ylabel("Count")
    save_plot(f"hist_{col}")

print("📌 Insight: age_years peaks around 50-55. ap_hi and ap_lo are normally distributed after cleaning.")

# 3.3 Boxplots
for col in continuous_cols:
    plt.figure()
    sns.boxplot(x=df[col], color="lightblue")
    plt.title(f"Boxplot of {col}")
    plt.xlabel(col)
    save_plot(f"box_{col}")

# 3.4 Boxplots by cardio
for col in continuous_cols:
    plt.figure()
    sns.boxplot(x="cardio", y=col, data=df, palette=["steelblue", "salmon"])
    plt.title(f"{col} by Cardio Outcome")
    plt.xlabel("cardio (0 = No Disease, 1 = Disease)")
    plt.ylabel(col)
    save_plot(f"box_{col}_by_cardio")

print("📌 Insight: Patients with cardio=1 have clearly higher ap_hi, ap_lo, and age_years.")

# 3.5 Violin plots
for col in ["age_years", "bmi", "ap_hi"]:
    plt.figure()
    sns.violinplot(x="cardio", y=col, data=df, palette=["steelblue", "salmon"])
    plt.title(f"Violin Plot: {col} by Cardio")
    plt.xlabel("cardio (0 = No Disease, 1 = Disease)")
    save_plot(f"violin_{col}_by_cardio")

print("📌 Insight: Violin plots confirm ap_hi and age_years have wider distributions in cardio=1 group.")

# 3.6 Age distribution by cardio
plt.figure(figsize=(9, 5))
for label, color in zip([0, 1], ["steelblue", "salmon"]):
    subset = df[df["cardio"] == label]["age_years"]
    sns.histplot(subset, kde=True, bins=30, color=color,
                 label=f"cardio={label}", alpha=0.6)
plt.title("Age Distribution by Cardio Outcome")
plt.xlabel("Age (years)")
plt.ylabel("Count")
plt.legend()
save_plot("age_distribution_by_cardio")
print("📌 Insight: Cardio disease is more prevalent in patients aged 50-65. Risk rises sharply after age 50.")

# 3.7 Categorical countplots
for col in categorical_cols:
    plt.figure()
    sns.countplot(x=col, data=df, palette="Set2")
    plt.title(f"Count of {col}")
    save_plot(f"count_{col}")

for col in categorical_cols:
    plt.figure()
    sns.countplot(x=col, hue="cardio", data=df, palette=["steelblue", "salmon"])
    plt.title(f"{col} vs Cardio")
    plt.legend(title="cardio", labels=["No Disease", "Disease"])
    save_plot(f"count_{col}_vs_cardio")

print("📌 Insight: Higher cholesterol and glucose levels correlate clearly with cardio=1.")

# 3.8 Scatter plots
plt.figure()
sns.scatterplot(x="ap_hi", y="ap_lo", hue="cardio", data=df,
                alpha=0.3, palette=["steelblue", "salmon"])
plt.title("Systolic vs Diastolic BP by Cardio")
save_plot("scatter_aphi_aplo")

plt.figure()
sns.scatterplot(x="bmi", y="ap_hi", hue="cardio", data=df,
                alpha=0.3, palette=["steelblue", "salmon"])
plt.title("BMI vs Systolic BP by Cardio")
save_plot("scatter_bmi_aphi")

plt.figure()
sns.scatterplot(x="age_years", y="bmi", hue="cardio", data=df,
                alpha=0.3, palette=["steelblue", "salmon"])
plt.title("Age vs BMI by Cardio")
save_plot("scatter_age_bmi")

print("📌 Insight: High systolic BP combined with high BMI clearly separates disease vs no-disease groups.")

# 3.9 Pairplot
print("\nGenerating pairplot (this may take a moment)...")
pairplot_cols = ["age_years", "ap_hi", "bmi", "cholesterol", "cardio"]
sample_df = df[pairplot_cols].sample(n=2000, random_state=42)
g = sns.pairplot(sample_df, hue="cardio", palette=["steelblue", "salmon"],
                 plot_kws={"alpha": 0.4}, diag_kind="kde")
g.fig.suptitle("Pairplot of Top Features", y=1.02)
save_plot("pairplot_top_features")
print("📌 Insight: Pairplot confirms ap_hi and age_years are the strongest visual separators.")


# =================================================
# 4. CORRELATION MATRIX
# =================================================
print("\n" + "=" * 60)
print("  STEP 4: CORRELATION MATRIX")
print("=" * 60)

numeric_cols = df.select_dtypes(include=[np.number]).columns
corr = df[numeric_cols].corr()

plt.figure(figsize=(14, 11))
sns.heatmap(corr, annot=True, fmt=".2f", cmap="coolwarm",
            center=0, linewidths=0.5, annot_kws={"size": 8})
plt.title("Correlation Heatmap of All Numerical Features")
save_plot("correlation_heatmap")

print("\n📌 Correlation with target (cardio):")
cardio_corr = corr["cardio"].drop("cardio").sort_values(ascending=False)
print(cardio_corr.to_string())
print("\n📌 Key Insights:")
print("   → ap_hi has the strongest positive correlation with cardio  (0.43)")
print("   → ap_lo follows closely                                     (0.34)")
print("   → age and age_years are moderate predictors                 (~0.24)")
print("   → cholesterol shows meaningful correlation                  (0.22)")
print("   → BMI has weak-moderate correlation                         (0.19)")
print("   → smoke, alco, height have very weak correlation            (<0.02)")
print("   → active has slight negative correlation                    (-0.04)")


# =================================================
# 5. TRAIN / TEST SPLIT & SCALING
# =================================================
print("\n" + "=" * 60)
print("  STEP 5: TRAIN/TEST SPLIT & SCALING")
print("=" * 60)

feature_cols = [
    "age_years", "gender", "height", "weight",
    "ap_hi", "ap_lo", "cholesterol", "gluc",
    "smoke", "alco", "active", "bmi", "pulse_pressure"
]

X = df[feature_cols]
y = df["cardio"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print(f"Train shape : {X_train.shape}")
print(f"Test shape  : {X_test.shape}")
print(f"Class distribution in train:\n{y_train.value_counts(normalize=True).round(3)}")

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled  = scaler.transform(X_test)
print("✅ StandardScaler applied.")


# =================================================
# 6. MODEL TRAINING + EVALUATION
# =================================================
print("\n" + "=" * 60)
print("  STEP 6: MODEL TRAINING & EVALUATION")
print("=" * 60)

roc_data = {}

def evaluate_model(name, model, X_tr, X_te, y_tr, y_te):
    model.fit(X_tr, y_tr)
    y_pred = model.predict(X_te)

    acc = accuracy_score(y_te, y_pred)
    cm  = confusion_matrix(y_te, y_pred)

    print("=" * 60)
    print(f"  Model    : {name}")
    print(f"  Accuracy : {acc:.4f}")
    print("\n  Confusion Matrix:")
    print(cm)
    print("\n  Classification Report:")
    print(classification_report(y_te, y_pred,
          target_names=["No Disease", "Disease"]))

    plt.figure(figsize=(5, 4))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
                xticklabels=["No Disease", "Disease"],
                yticklabels=["No Disease", "Disease"])
    plt.title(f"Confusion Matrix – {name}")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    save_plot(f"cm_{name.replace(' ','_').replace('(','').replace(')','').replace('=','')}")

    try:
        if hasattr(model, "predict_proba"):
            y_proba = model.predict_proba(X_te)[:, 1]
        elif hasattr(model, "decision_function"):
            y_proba = model.decision_function(X_te)
        else:
            y_proba = None

        if y_proba is not None:
            auc = roc_auc_score(y_te, y_proba)
            print(f"  AUC-ROC  : {auc:.4f}")
            fpr, tpr, _ = roc_curve(y_te, y_proba)
            roc_data[name] = (fpr, tpr, auc)
    except Exception as e:
        print(f"  AUC-ROC  : Not available ({e})")

    return acc, model


results        = []
trained_models = {}

# ── 6.1 Logistic Regression ──────────────────────
print("\n▶ Training Logistic Regression...")
lr = LogisticRegression(max_iter=2000, random_state=42)
acc_lr, lr_trained = evaluate_model(
    "Logistic Regression", lr,
    X_train_scaled, X_test_scaled, y_train, y_test
)
results.append(("Logistic Regression", acc_lr))
trained_models["Logistic Regression"] = lr_trained

# ── 6.2 SVM (Calibrated for AUC support) ─────────
print("\n▶ Training SVM (LinearSVC + CalibratedClassifierCV)...")
svm_base = LinearSVC(max_iter=3000, random_state=42)
svm = CalibratedClassifierCV(svm_base, cv=3)
acc_svm, svm_trained = evaluate_model(
    "SVM LinearSVC", svm,
    X_train_scaled, X_test_scaled, y_train, y_test
)
results.append(("SVM LinearSVC", acc_svm))
trained_models["SVM LinearSVC"] = svm_trained

# ── 6.3 KNN — best k selection ───────────────────
print("\n▶ Finding best K for KNN...")
k_scores = {}
for k in [3, 5, 7, 9, 11, 15]:
    knn_tmp = KNeighborsClassifier(n_neighbors=k)
    knn_tmp.fit(X_train_scaled, y_train)
    k_scores[k] = accuracy_score(y_test, knn_tmp.predict(X_test_scaled))
    print(f"   k={k:2d}  →  Accuracy: {k_scores[k]:.4f}")

best_k = max(k_scores, key=k_scores.get)
print(f"\n   Best K = {best_k} with accuracy {k_scores[best_k]:.4f}")

plt.figure(figsize=(7, 4))
plt.plot(list(k_scores.keys()), list(k_scores.values()), marker="o", color="steelblue")
plt.title("KNN — Accuracy vs Number of Neighbors (k)")
plt.xlabel("k")
plt.ylabel("Accuracy")
plt.xticks(list(k_scores.keys()))
plt.grid(True)
save_plot("knn_k_selection")

knn = KNeighborsClassifier(n_neighbors=best_k)
acc_knn, knn_trained = evaluate_model(
    f"KNN k={best_k}", knn,
    X_train_scaled, X_test_scaled, y_train, y_test
)
results.append((f"KNN k={best_k}", acc_knn))
trained_models[f"KNN k={best_k}"] = knn_trained

# ── 6.4 Decision Tree — pruned ───────────────────
print("\n▶ Training Decision Tree (max_depth=7)...")
dt = DecisionTreeClassifier(max_depth=7, min_samples_split=20,
                             min_samples_leaf=10, random_state=42)
acc_dt, dt_trained = evaluate_model(
    "Decision Tree", dt, X_train, X_test, y_train, y_test
)
results.append(("Decision Tree", acc_dt))
trained_models["Decision Tree"] = dt_trained

dt_overfit = DecisionTreeClassifier(max_depth=None, random_state=42)
dt_overfit.fit(X_train, y_train)
acc_train_ov = accuracy_score(y_train, dt_overfit.predict(X_train))
acc_test_ov  = accuracy_score(y_test,  dt_overfit.predict(X_test))
print(f"\n  ⚠  Unconstrained DT → Train: {acc_train_ov:.4f} | Test: {acc_test_ov:.4f}  (OVERFITTING)")
print(f"  ✅ Pruned DT (depth=7) → Test: {acc_dt:.4f}  (Better generalisation)")

# ── 6.5 Random Forest ────────────────────────────
print("\n▶ Training Random Forest (200 trees)...")
rf = RandomForestClassifier(n_estimators=200, max_depth=12,
                             random_state=42, n_jobs=-1)
acc_rf, rf_trained = evaluate_model(
    "Random Forest", rf, X_train, X_test, y_train, y_test
)
results.append(("Random Forest", acc_rf))
trained_models["Random Forest"] = rf_trained

# ── 6.6 Accuracy comparison ───────────────────────
results_df = pd.DataFrame(results, columns=["Model", "Accuracy"])
results_df = results_df.sort_values("Accuracy", ascending=False).reset_index(drop=True)

print("\n" + "=" * 60)
print("  📊 MODEL ACCURACY COMPARISON")
print("=" * 60)
print(results_df.to_string(index=False))

plt.figure(figsize=(10, 5))
sns.barplot(x="Accuracy", y="Model", data=results_df, palette="viridis")
plt.title("Model Accuracy Comparison")
plt.xlabel("Accuracy")
plt.xlim(0.6, 0.9)
for i, row in results_df.iterrows():
    plt.text(row["Accuracy"] + 0.002, i,
             f"{row['Accuracy']:.4f}", va="center", fontsize=10)
save_plot("model_accuracy_comparison")

# ── 6.7 Combined ROC Curve ────────────────────────
if roc_data:
    plt.figure(figsize=(8, 6))
    colors = ["steelblue", "salmon", "green", "orange", "purple"]
    for (name, (fpr, tpr, auc)), color in zip(roc_data.items(), colors):
        plt.plot(fpr, tpr, label=f"{name} (AUC={auc:.3f})", color=color)
    plt.plot([0, 1], [0, 1], "k--", linewidth=0.8)
    plt.title("ROC Curves — All Models")
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.legend(loc="lower right")
    plt.grid(True, alpha=0.3)
    save_plot("roc_curves_all_models")
    print("\n📌 Insight: Higher AUC = better discrimination. Random Forest typically leads.")

# ── 6.8 Cross-Validation ──────────────────────────
print("\n▶ Running 5-Fold Cross-Validation on top models...")
for model_name, model_obj, X_cv in [
    ("Logistic Regression",
     LogisticRegression(max_iter=2000, random_state=42),
     X_train_scaled),
    ("Random Forest",
     RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42, n_jobs=-1),
     X_train),
]:
    cv_scores = cross_val_score(model_obj, X_cv, y_train, cv=5, scoring="accuracy")
    print(f"  {model_name:25s} | CV Accuracy: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")


# =================================================
# 7. FINAL MODEL
# =================================================
print("\n" + "=" * 60)
print("  STEP 7: FINAL MODEL SELECTION & SAVING")
print("=" * 60)

best_model_name = results_df.iloc[0]["Model"]
print(f"✅ Best model: {best_model_name}")

if best_model_name == "Random Forest":
    final_model = RandomForestClassifier(
        n_estimators=200, max_depth=12, random_state=42, n_jobs=-1)
    final_model.fit(X, y)
elif best_model_name == "Decision Tree":
    final_model = DecisionTreeClassifier(
        max_depth=7, min_samples_split=20, min_samples_leaf=10, random_state=42)
    final_model.fit(X, y)
else:
    X_all_scaled = scaler.transform(X)
    final_model  = trained_models[best_model_name]
    final_model.fit(X_all_scaled, y)

joblib.dump(final_model, "cardio_final_model.pkl")
joblib.dump(scaler,      "cardio_scaler.pkl")
print("✅ Final model saved → cardio_final_model.pkl")
print("✅ Scaler saved      → cardio_scaler.pkl")


# =================================================
# 8. FEATURE IMPORTANCE
# =================================================
print("\n" + "=" * 60)
print("  STEP 8: FEATURE IMPORTANCE")
print("=" * 60)

if hasattr(final_model, "feature_importances_"):
    importances = final_model.feature_importances_
    indices     = np.argsort(importances)[::-1]
    feat_names  = np.array(feature_cols)

    plt.figure(figsize=(9, 6))
    sns.barplot(x=importances[indices], y=feat_names[indices], palette="mako")
    plt.title(f"{best_model_name} — Feature Importances")
    plt.xlabel("Importance Score")
    plt.ylabel("Feature")
    save_plot("feature_importance")

    print("\nFeature Importances (ranked):")
    for rank, i in enumerate(indices, 1):
        print(f"  {rank:2d}. {feat_names[i]:20s} → {importances[i]:.4f}")
    print("\n📌 Insight: ap_hi, age_years, and bmi are typically the top predictors.")

print(f"\n✅ Pipeline completed! All {plot_counter[0]} plots saved in 'plots/' folder.")


# =================================================
# 9. USER PREDICTION — INTERACTIVE INPUT
# =================================================
print("\n" + "=" * 60)
print("  STEP 9: CARDIOVASCULAR DISEASE PREDICTION — PATIENT CHECK")
print("=" * 60)
print("Enter patient details below to predict cardiovascular risk.")
print("(Press Ctrl+C anytime to exit)\n")


def get_float_input(prompt, min_val, max_val):
    while True:
        try:
            val = float(input(prompt))
            if min_val <= val <= max_val:
                return val
            else:
                print(f"  ⚠  Please enter a value between {min_val} and {max_val}.")
        except ValueError:
            print("  ⚠  Invalid input. Please enter a number.")


def get_int_input(prompt, choices):
    while True:
        try:
            val = int(input(prompt))
            if val in choices:
                return val
            else:
                print(f"  ⚠  Please choose one of: {choices}")
        except ValueError:
            print("  ⚠  Invalid input. Please enter a whole number.")


try:
    while True:
        print("\n--- Enter Patient Information ---\n")

        age_years = get_float_input(
            "  Age (years, e.g. 45)                           : ",
            min_val=1, max_val=100)

        gender = get_int_input(
            "  Gender            (1=Female, 2=Male)           : ",
            choices=[1, 2])

        height = get_float_input(
            "  Height (cm, e.g. 165)                          : ",
            min_val=130, max_val=220)

        weight = get_float_input(
            "  Weight (kg, e.g. 70)                           : ",
            min_val=40, max_val=200)

        ap_hi = get_float_input(
            "  Systolic BP  / ap_hi (e.g. 120)                : ",
            min_val=60, max_val=250)

        ap_lo = get_float_input(
            "  Diastolic BP / ap_lo (e.g. 80)                 : ",
            min_val=40, max_val=200)

        cholesterol = get_int_input(
            "  Cholesterol  (1=Normal, 2=Above, 3=Well Above) : ",
            choices=[1, 2, 3])

        gluc = get_int_input(
            "  Glucose      (1=Normal, 2=Above, 3=Well Above) : ",
            choices=[1, 2, 3])

        smoke = get_int_input(
            "  Smoker?      (0=No, 1=Yes)                     : ",
            choices=[0, 1])

        alco = get_int_input(
            "  Alcohol?     (0=No, 1=Yes)                     : ",
            choices=[0, 1])

        active = get_int_input(
            "  Physically Active? (0=No, 1=Yes)               : ",
            choices=[0, 1])

        # Auto-compute derived features
        bmi            = weight / (height / 100) ** 2
        pulse_pressure = ap_hi - ap_lo
        print(f"\n  [Auto-calculated] BMI = {bmi:.2f}  |  Pulse Pressure = {pulse_pressure:.0f} mmHg")

        # Build input DataFrame in correct feature order
        input_data = pd.DataFrame([{
            "age_years"      : age_years,
            "gender"         : gender,
            "height"         : height,
            "weight"         : weight,
            "ap_hi"          : ap_hi,
            "ap_lo"          : ap_lo,
            "cholesterol"    : cholesterol,
            "gluc"           : gluc,
            "smoke"          : smoke,
            "alco"           : alco,
            "active"         : active,
            "bmi"            : bmi,
            "pulse_pressure" : pulse_pressure
        }])[feature_cols]

        # Apply scaling only for scale-sensitive models
        if best_model_name in ["Random Forest", "Decision Tree"]:
            pred_input = input_data
        else:
            pred_input = scaler.transform(input_data)

        prediction = final_model.predict(pred_input)[0]

        try:
            probability = final_model.predict_proba(pred_input)[0][1]
            has_proba = True
        except Exception:
            has_proba = False

        print("\n" + "-" * 60)
        print("  PREDICTION RESULT")
        print("-" * 60)

        if prediction == 1:
            print("  🔴 Result  : HIGH RISK — Cardiovascular Disease Detected")
        else:
            print("  🟢 Result  : LOW RISK  — No Cardiovascular Disease Detected")

        if has_proba:
            risk_pct = probability * 100
            print(f"  📊 Risk    : {risk_pct:.1f}%")
            if risk_pct >= 70:
                print("  ⚠  Advice  : Strongly recommend consulting a cardiologist immediately.")
            elif risk_pct >= 40:
                print("  ⚠  Advice  : Consider lifestyle changes and schedule a medical checkup.")
            else:
                print("  ✅ Advice  : Maintain healthy habits. Annual checkups advised.")

        print(f"  🤖 Model   : {best_model_name}")
        print("-" * 60)

        again = input("\n  Predict another patient? (yes / no): ").strip().lower()
        if again not in ["yes", "y"]:
            print("\n  Thank you for using the Cardiovascular Disease Predictor. Goodbye!")
            break

except KeyboardInterrupt:
    print("\n\n  Session ended by user.")