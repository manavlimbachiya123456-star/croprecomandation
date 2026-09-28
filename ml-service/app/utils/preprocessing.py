"""Feature encoding shared by training and serving (numpy only, no pandas/sklearn)."""
import numpy as np

NUM = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
CATS = {
    "soil_type": ["sandy", "loamy", "clay", "black", "red", "alluvial", "other"],
    "water_availability": ["low", "medium", "high"],
    "season": ["kharif", "rabi", "zaid"],
}

def encode(row: dict) -> np.ndarray:
    """dict -> 1-D feature vector: 7 numeric + one-hot categoricals (unknown category = all zeros)."""
    v = [float(row[k]) for k in NUM]
    for k, opts in CATS.items():
        val = str(row[k]).strip().lower()
        v += [1.0 if val == o else 0.0 for o in opts]
    return np.array(v, dtype=float)
