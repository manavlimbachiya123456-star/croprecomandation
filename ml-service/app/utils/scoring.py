"""Pure scoring helpers. All numbers come from config/scoring_config.py."""
from config import scoring_config as cfg

def normalize_scores(probs, exponent=None):
    """STAGE 1: relative-scale probabilities to 0-100 (best crop = 100)."""
    exp = cfg.SCORE_EXPONENT if exponent is None else exponent
    pmax = max(probs) or 1.0
    return [round(100 * (p / pmax) ** exp) for p in probs]

def area_adjustment(share_pct: float):
    """STAGE 2: returns (adjustment, status label) for a crop's local area share."""
    for upper, adj, label in cfg.AREA_BANDS:
        if share_pct < upper:
            return adj, label
    return cfg.AREA_OVERFLOW

def explain(crop: str, share_pct: float, adj: int) -> str:
    base = f"{crop} is suitable for your land based on the soil and farming conditions."
    if adj > 0:
        return (f"{base} Its current cultivation share in your area is low ({share_pct:.0f}%), "
                "so it receives a positive area adjustment.")
    if adj == 0:
        return (f"{base} Its share in your area ({share_pct:.0f}%) is balanced, "
                "so no area adjustment is applied.")
    return (f"{crop} is suitable for your land, but a large proportion ({share_pct:.0f}%) of the reported "
            "agricultural area is already allocated to it, so it receives a negative area adjustment.")
