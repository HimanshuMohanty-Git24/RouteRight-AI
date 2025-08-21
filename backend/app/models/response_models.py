from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class Stop(BaseModel):
    id: str
    name: str
    category: str
    address: str
    lat: float
    lng: float
    rating: Optional[float] = None
    distance: Optional[float] = None
    eta: Optional[str] = None
    google_maps_url: str

class Plan(BaseModel):
    plan_id: str
    stops: List[Stop]
    total_distance: Optional[float] = None
    total_time: Optional[str] = None
    map_preview_url: Optional[str] = None
    created_at: datetime
    status: str = "completed"

class ProgressUpdate(BaseModel):
    step: str
    message: str
    progress: int
    status: str

class RouteResponse(BaseModel):
    summary: str
    routes: List[Dict[str, Any]]
    total_distance: Optional[str] = None
    total_duration: Optional[str] = None
    recommendations: Optional[List[str]] = None