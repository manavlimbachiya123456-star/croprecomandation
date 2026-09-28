from typing import Dict, List, Optional
from pydantic import BaseModel

class Stage1Item(BaseModel):
    crop: str
    score: float

class Location(BaseModel):
    village: Optional[str] = None
    taluka: Optional[str] = None
    district: Optional[str] = None

class AreaRequest(BaseModel):
    location: Optional[Location] = None
    stage1: List[Stage1Item]
    area_distribution: Dict[str, float] = {}   # crop -> % share

class FinalItem(BaseModel):
    crop: str
    stage1_score: float
    area_percentage: float
    area_status: str
    area_adjustment: int
    final_score: float
    reason: str

class AreaResponse(BaseModel):
    final_recommendations: List[FinalItem]
