from fastapi import APIRouter, HTTPException
from app.schemas.crop_schema import CropInput, CropResponse
from app.services.crop_service import suggest_crops

router = APIRouter()

@router.post("/crop-suitability", response_model=CropResponse)
def crop_suitability(body: CropInput):
    try:
        return {"recommendations": suggest_crops(body.model_dump())}
    except RuntimeError as e:
        raise HTTPException(503, str(e))
