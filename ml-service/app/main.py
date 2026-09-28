from fastapi import FastAPI
from app.api import crop, area

app = FastAPI(title="AgriSmart ML Service")
app.include_router(crop.router, prefix="/ml", tags=["Stage 1"])
app.include_router(area.router, prefix="/ml", tags=["Stage 2"])

@app.get("/health")
def health():
    return {"ok": True}
