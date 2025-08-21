from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

class PlanRequest(BaseModel):
    user_text: str
    lat: float
    lng: float
    preferences: Optional[Dict[str, Any]] = None

class FeedbackStop(BaseModel):
    stop_id: str
    rating: int
    visited: bool
    issues: Optional[str] = None

class FeedbackRequest(BaseModel):
    plan_id: str
    overall_rating: int
    stops_feedback: List[FeedbackStop]
    comments: Optional[str] = None
    created_at: Optional[str] = None  # Change from datetime to str to handle ISO strings