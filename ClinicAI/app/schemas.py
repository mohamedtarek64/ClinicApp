"""
All Pydantic schemas for the FastAPI layer.

Nothing ML-specific lives here — pure request/response contracts.
"""
from __future__ import annotations

from enum import Enum
from typing import Any, Optional
from pydantic import BaseModel, Field


# ── Enums ─────────────────────────────────────────────────────────────────

class DiseaseType(str, Enum):
    diabetes = "diabetes"
    heart    = "heart"
    kidney   = "kidney"


class RiskLevel(str, Enum):
    low       = "low"
    moderate  = "moderate"
    high      = "high"
    very_high = "very_high"


# ── Prediction request ─────────────────────────────────────────────────────

class PredictionRequest(BaseModel):
    disease: DiseaseType = Field(..., description="Which disease to predict")
    data: dict[str, Any] = Field(
        ...,
        description="Patient feature key-value pairs. Keys depend on disease type.",
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "summary": "Diabetes example",
                    "value": {
                        "disease": "diabetes",
                        "data": {
                            "HbA1c_level": 6.5,
                            "blood_glucose_level": 140,
                            "age": 45,
                            "bmi": 27.5,
                            "smoking_history": "never",
                            "hypertension": 0,
                            "gender": "Female",
                            "heart_disease": 0,
                        },
                    },
                },
                {
                    "summary": "Kidney example",
                    "value": {
                        "disease": "kidney",
                        "data": {
                            "age": 48.0, "bp": 80.0, "sg": 1.020, "al": 1.0,
                            "su": 0.0, "rbc": "normal", "pc": "normal",
                            "pcc": "notpresent", "ba": "notpresent",
                            "bgr": 121.0, "bu": 36.0, "sc": 1.2,
                            "sod": 137.0, "pot": 4.0, "hemo": 15.4,
                            "pcv": 44.0, "wc": 7800.0, "rc": 5.2,
                            "htn": "no", "dm": "no", "cad": "no",
                            "appet": "good", "pe": "no", "ane": "no",
                        },
                    },
                },
            ]
        }
    }


# ── Prediction response ────────────────────────────────────────────────────

class PredictionResponse(BaseModel):
    disease:          DiseaseType
    prediction:       int   = Field(..., description="0 = healthy, 1 = disease likely")
    probability:      float = Field(..., ge=0.0, le=1.0)
    risk_level:       RiskLevel
    risk_description: str
    label:            str   = Field(..., description="Human-readable result")
    model_version:    str   = "1.0.0"


# ── Health ─────────────────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    status:        str
    version:       str
    models_loaded: list[str]
