"""STAGE 2 - area balancing. Only re-ranks crops that Stage 1 returned."""
from app.utils.scoring import area_adjustment, explain
from config import scoring_config as cfg

def rank_by_area(stage1: list, distribution: dict):
    dist = {k.strip().lower(): float(v) for k, v in distribution.items()}
    out = []
    for item in stage1:                       # never introduces crops outside Stage 1
        share = dist.get(item["crop"].strip().lower(), 0.0)
        adj, status = area_adjustment(share)
        out.append({
            "crop": item["crop"], "stage1_score": item["score"],
            "area_percentage": round(share, 1), "area_status": status,
            "area_adjustment": adj, "final_score": item["score"] + adj,
            "reason": explain(item["crop"], share, adj),
        })
    out.sort(key=lambda r: (r["final_score"], r["stage1_score"]), reverse=True)
    return out[: cfg.TOP_N_FINAL]
