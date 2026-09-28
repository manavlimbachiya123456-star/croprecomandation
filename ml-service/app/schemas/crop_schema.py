from typing import Literal, List
from pydantic import BaseModel, Field

class CropInput(BaseModel):
    N: float = Field(ge=0, le=300)
    P: float = Field(ge=0, le=300)
    K: float = Field(ge=0, le=300)
    temperature: float = Field(ge=-5, le=55)
    humidity: float = Field(ge=0, le=100)
    rainfall: float = Field(ge=0, le=5000)
    ph: float = Field(ge=0, le=14)
    soil_type: Literal["sandy", "loamy", "clay", "black", "red", "alluvial", "other"]
    water_availability: Literal["low", "medium", "high"]
    season: Literal["kharif", "rabi", "zaid"]

class CropScore(BaseModel):
    crop: str
    score: int

class CropResponse(BaseModel):
    recommendations: List[CropScore]
