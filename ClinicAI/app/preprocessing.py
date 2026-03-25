"""
Preprocessing helpers for inference time.

These mirror the data-cleaning logic from the ClinicApp-Ai notebook
so that API inputs are in exactly the same shape the trained pipeline expects.
"""
from __future__ import annotations

import numpy as np
import pandas as pd

# Feature lists per disease (must match what the models were trained on)
DISEASE_FEATURES: dict[str, list[str]] = {
    "diabetes": [
        "HbA1c_level", "blood_glucose_level", "age", "bmi",
        "smoking_history", "hypertension", "gender", "heart_disease",
    ],
    "heart": [
        "HadAngina", "ChestScan", "HadStroke", "DifficultyWalking",
        "HadDiabetes", "GeneralHealth", "HadArthritis", "PneumoVaxEver",
        "RemovedTeeth", "AgeCategory", "SmokerStatus", "BMI",
        "HadKidneyDisease", "HadCOPD",
    ],
    "kidney": [
        "age", "bp", "sg", "al", "su",
        "rbc", "pc", "pcc", "ba",
        "bgr", "bu", "sc", "sod", "pot",
        "hemo", "pcv", "wc", "rc",
        "htn", "dm", "cad", "appet", "pe", "ane",
    ],
}


def _fix_value(x):
    """Normalise dirty kidney-dataset string values."""
    if pd.isna(x):
        return np.nan
    x = str(x).strip().lower()
    return np.nan if x in ["?", "", "nan", "none"] else x


def preprocess(raw: dict, disease: str) -> pd.DataFrame:
    """
    Convert a raw API-request dict into a single-row DataFrame
    ready for `pipeline.predict()`.
    """
    features = DISEASE_FEATURES[disease]

    # Build row with only the expected columns (missing → None → NaN)
    row = {feat: raw.get(feat) for feat in features}
    df = pd.DataFrame([row])

    if disease == "diabetes":
        df["smoking_history"] = df["smoking_history"].replace("No Info", np.nan)

    if disease == "kidney":
        for col in df.select_dtypes("object").columns:
            df[col] = df[col].apply(_fix_value)
        for col in ["pcv", "wc", "rc"]:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors="coerce")

    return df


def classify_risk(prob: float) -> tuple[str, str]:
    """Map probability → (risk_level_key, description)."""
    if prob < 0.20:
        return "low",      "No significant indicators detected."
    if prob < 0.50:
        return "moderate", "Some risk factors present. Consider seeing a doctor."
    if prob < 0.80:
        return "high",     "Multiple risk factors found. Please see a doctor."
    return   "very_high",  "Strong disease indicators. Please see a doctor immediately."
