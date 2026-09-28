"""
Stage 1 training (numpy only). Run from ml-service/:  python -m training.train_crop_model
"""
import csv
import numpy as np
from pathlib import Path
from app.models.forest import Forest
from app.utils.preprocessing import encode

ROOT = Path(__file__).resolve().parents[1]
CSV = ROOT / "data" / "raw" / "crop_recommendation.csv"
OUT = ROOT / "artifacts" / "crop_model.npz"

def main():
    if not CSV.exists():
        from training.generate_demo_data import main as gen
        gen()
    with open(CSV, newline="") as f:
        rows = list(csv.DictReader(f))
    X = np.array([encode(r) for r in rows])
    classes = sorted({r["crop"] for r in rows})
    y = np.array([classes.index(r["crop"]) for r in rows])

    perm = np.random.default_rng(42).permutation(len(y))
    cut = int(0.8 * len(y))
    tr, te = perm[:cut], perm[cut:]
    m = Forest().fit(X[tr], y[tr], classes)
    acc = np.mean([m.predict_proba(X[i]).argmax() == y[i] for i in te])
    print("Hold-out accuracy:", round(float(acc), 3))

    m = Forest().fit(X, y, classes)          # refit on all data for deployment
    OUT.parent.mkdir(parents=True, exist_ok=True)
    m.save(OUT)
    print("Saved model ->", OUT)

if __name__ == "__main__":
    main()
