"""Loads the trained Stage 1 model (lazy, cached)."""
from functools import lru_cache
from pathlib import Path
from app.models.forest import Forest

MODEL_PATH = Path(__file__).resolve().parents[2] / "artifacts" / "crop_model.npz"

@lru_cache(maxsize=1)
def get_model() -> Forest:
    if not MODEL_PATH.exists():
        raise RuntimeError("Model not found. Run: python -m training.train_crop_model")
    return Forest.load(MODEL_PATH)
