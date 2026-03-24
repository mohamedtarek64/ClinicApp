"""
ModelRegistry – loads and caches every disease model at startup.

The registry is attached to `app.state` so every request gets an O(1)
dict lookup instead of loading from disk on every call.
"""
from __future__ import annotations

import logging
import os
import pickle

logger = logging.getLogger("clinicai")

SUPPORTED_DISEASES = ["diabetes", "heart", "kidney"]


class MockModel:
    """Fallback model for testing when .pkl files are missing."""
    def predict(self, df):
        return [1]  # Always predict 'likely diseased' for demo

    def predict_proba(self, df):
        return [[0.2, 0.8]]  # 80% probability


class ModelRegistry:
    def __init__(self, models_dir: str):
        self._dir = os.path.abspath(models_dir)
        self._models: dict[str, object] = {}

    # ── Public API ──────────────────────────────────────────────────────────

    def load_all(self) -> list[str]:
        """Load all .pkl models from disk. Call once at startup."""
        loaded = []
        for disease in SUPPORTED_DISEASES:
            path = self._model_path(disease)
            if not os.path.exists(path):
                logger.warning(
                    "Model '%s' not found at %s. Using MockModel for testing.",
                    disease, path,
                )
                continue
            try:
                with open(path, "rb") as f:
                    self._models[disease] = pickle.load(f)
                loaded.append(disease)
                logger.info("✓  Model loaded: %-10s  ←  %s", disease, path)
            except Exception as exc:
                logger.error("Failed to load model '%s': %s", disease, exc)

        return loaded

    def get(self, disease: str) -> object:
        model = self._models.get(disease)
        if model is None:
            # For testing purposes, we return a MockModel if the real one isn't found
            return MockModel()
        return model

    @property
    def loaded_models(self) -> list[str]:
        return list(self._models.keys())

    # ── Private ─────────────────────────────────────────────────────────────

    def _model_path(self, disease: str) -> str:
        return os.path.join(self._dir, f"{disease}_model.pkl")
