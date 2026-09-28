"""
Generates DEMO training data (synthetic, agronomy-inspired ranges).
NOT real field data - replace data/raw/crop_recommendation.csv with a real
dataset (same columns) for production use.
Run: python -m training.generate_demo_data
"""
import csv
import numpy as np
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "data" / "raw" / "crop_recommendation.csv"
ALL_SOIL = ["sandy", "loamy", "clay", "black", "red", "alluvial", "other"]
ALL_WATER = ["low", "medium", "high"]
ALL_SEASON = ["kharif", "rabi", "zaid"]

# crop: (N, P, K, temp, humidity, pH, rainfall, soils, water, seasons)
P = {
 "Rice":     ((60,100),(35,60),(30,45),(22,32),(75,95),(5.5,7),(180,300),["clay","alluvial","black"],["high"],["kharif"]),
 "Wheat":    ((60,120),(30,60),(20,40),(12,25),(40,65),(6,7.5),(50,100),["loamy","alluvial","clay"],["medium"],["rabi"]),
 "Maize":    ((60,110),(35,60),(15,40),(18,30),(55,75),(5.8,7),(60,120),["loamy","alluvial","red","sandy"],["medium"],["kharif","zaid","rabi"]),
 "Cotton":   ((80,130),(30,55),(15,45),(22,32),(50,80),(6,8),(60,120),["black","alluvial"],["medium"],["kharif"]),
 "Groundnut":((40,100),(30,60),(25,50),(22,30),(55,75),(6,7.2),(50,150),["sandy","loamy","red"],["low","medium"],["kharif","zaid"]),
 "Bajra":    ((40,80),(20,45),(15,40),(25,35),(40,60),(6.5,8),(40,100),["sandy","loamy","red"],["low"],["kharif"]),
 "Jowar":    ((40,90),(20,45),(20,40),(24,33),(45,65),(6,8),(50,110),["black","red","loamy"],["low","medium"],["kharif","rabi"]),
 "Moong":    ((15,50),(30,55),(15,40),(24,34),(55,75),(6.2,7.5),(50,100),["loamy","sandy","alluvial"],["low","medium"],["kharif","zaid"]),
 "Urad":     ((15,50),(35,60),(15,40),(24,32),(60,80),(6,7.5),(70,130),["loamy","black","alluvial"],["medium"],["kharif"]),
 "Chickpea": ((15,50),(40,70),(20,45),(15,26),(30,60),(6,8),(40,90),["loamy","black","sandy"],["low","medium"],["rabi"]),
 "Mustard":  ((50,100),(30,55),(20,40),(12,25),(35,60),(6,7.5),(30,80),["loamy","sandy","alluvial"],["low","medium"],["rabi"]),
 "Soybean":  ((20,60),(40,70),(25,50),(22,30),(60,80),(6,7.2),(90,160),["black","loamy"],["medium"],["kharif"]),
 "Potato":   ((100,150),(50,80),(60,100),(12,24),(60,80),(5.2,6.5),(50,100),["loamy","sandy","alluvial"],["medium","high"],["rabi"]),
 "Tomato":   ((80,130),(45,80),(40,80),(18,30),(55,80),(5.8,7),(60,120),["loamy","red","sandy"],["medium","high"],["rabi","zaid","kharif"]),
 "Onion":    ((60,110),(40,70),(40,70),(15,28),(50,70),(6,7.5),(40,90),["loamy","black","alluvial"],["medium"],["rabi","kharif"]),
}

def main(n_per_crop=400, seed=42):
    rng = np.random.default_rng(seed)
    rows = []
    for crop, (N, Pp, K, T, H, PH, R, soils, waters, seasons) in P.items():
        def u(rg, pad=0.15):  # uniform with 15% padding so classes overlap realistically
            span = rg[1] - rg[0]
            return rng.uniform(rg[0] - pad * span, rg[1] + pad * span, n_per_crop)
        pick = lambda good, alln: [str(rng.choice(good)) if rng.random() < 0.8 else str(rng.choice(alln)) for _ in range(n_per_crop)]
        n, p, k = u(N).clip(0).round(0), u(Pp).clip(0).round(0), u(K).clip(0).round(0)
        t, h = u(T).round(1), u(H).clip(5, 100).round(1)
        ph, r = u(PH).clip(3.5, 9.5).round(2), u(R).clip(5).round(1)
        so, wa, se = pick(soils, ALL_SOIL), pick(waters, ALL_WATER), pick(seasons, ALL_SEASON)
        for i in range(n_per_crop):
            rows.append([int(n[i]), int(p[i]), int(k[i]), t[i], h[i], ph[i], r[i], so[i], wa[i], se[i], crop.lower()])
    order = rng.permutation(len(rows))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["N", "P", "K", "temperature", "humidity", "ph", "rainfall", "soil_type", "water_availability", "season", "crop"])
        for i in order:
            w.writerow(rows[i])
    print(f"Wrote {len(rows)} demo rows -> {OUT}")

if __name__ == "__main__":
    main()
