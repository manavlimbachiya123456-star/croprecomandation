"""STAGE 1 - individual crop suitability (no area data used here)."""
from app.models.crop_model import get_model
from app.utils.preprocessing import encode
from app.utils.scoring import normalize_scores
from config import scoring_config as cfg

def suggest_crops(payload: dict):
    model = get_model()
    proba = model.predict_proba(encode(payload))
    order = proba.argsort()[::-1][: cfg.TOP_N_STAGE1]
    scores = normalize_scores([proba[i] for i in order])
    return [{"crop": model.classes[i].title(), "score": int(s)} for i, s in zip(order, scores)]
