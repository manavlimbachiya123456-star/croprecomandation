# AgriSmart – Two-Stage Smart Farming Crop Recommendation

No external APIs. Data = farmer input + CSV + MongoDB + Python ML.
- **Stage 1** (FastAPI, RandomForest): top 6 crops suitable for the farmer's land.
- **Stage 2** (FastAPI, rule-based): re-ranks ONLY those 6 using the local (village -> taluka -> district) crop share from MongoDB; returns top 3 with reasons.

## Prerequisites
Node.js 18+, Python 3.10+, MongoDB running locally (`mongodb://127.0.0.1:27017`) or an Atlas URI.

## 1. ML service (port 8000)
```bash
cd ml-service
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m training.generate_demo_data   # optional: regenerates the DEMO csv
python -m training.train_crop_model     # optional: a trained model is already included
uvicorn app.main:app --port 8000 --reload
```
Docs: http://localhost:8000/docs

## 2. Backend (port 5000)
```bash
cd backend
npm install
# edit .env: set a strong JWT_SECRET and your MONGO_URI
npm run dev
```

## 3. Frontend (port 5173)
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## Try it
1. Register (village/taluka/district, land). 2. `/soil` – enter values (e.g. N=90 P=42 K=40 pH=6.7 temp=26 humidity=70 rain=150, loamy, medium, kharif). 3. `/crop-plan` – save a crop. 4. `/recommendation` – Analyze My Land. 5. `/area-analysis` -> Get Final Recommendations.
To see area effects, register several farmers in the same village with different crop plans.

## Configuration
- Area bonus/penalty bands, top-N, score scaling: `ml-service/config/scoring_config.py` (only place).
- `MIN_FARMERS_FOR_LEVEL` (backend `.env`): farmers needed in a village before falling back to taluka, then district.
- Data confidence: <20 farmers Low, 20-100 Medium, >100 High.
- Land units are converted to acres (bigha = 0.4 acre assumed; edit `backend/src/constants.js`).

## Notes
- `crop_recommendation.csv` is **synthetic demo data**. Replace with a real dataset (same columns), then retrain.
- One crop plan per farmer per season (upsert) so land isn't double-counted; area stats use planned crop, else current crop.
- Outputs are decision support only – no guarantee of profit, price or success.
