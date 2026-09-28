from fastapi import APIRouter
from app.schemas.area_schema import AreaRequest, AreaResponse
from app.services.area_service import rank_by_area

router = APIRouter()

@router.post("/area-recommendation", response_model=AreaResponse)
def area_recommendation(body: AreaRequest):
    stage1 = [s.model_dump() for s in body.stage1]
    return {"final_recommendations": rank_by_area(stage1, body.area_distribution)}
