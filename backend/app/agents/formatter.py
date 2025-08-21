from typing import List, Dict, Any
import uuid
from datetime import datetime
from app.models.response_models import Plan, Stop
from app.services.serpapi_service import SerpAPIService
import logging
from ..graph.workflow import GraphState

# Configure logging for debugging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class FormatterAgent:
    def __init__(self):
        self.serpapi_service = SerpAPIService()
    
    async def format_plan(self, places: List[Dict[str, Any]], user_location: Dict[str, float]) -> Plan:
        logger.info("📋 Starting route formatting")
        logger.info(f"🛣️ Routes to format: {len(places) if places else 0}")
        
        stops = []
        for place in places:
            stop = Stop(
                id=place.get("id", str(uuid.uuid4())),
                name=place.get("name", ""),
                category=place.get("category", ""),
                address=place.get("address", ""),
                lat=place["lat"],
                lng=place["lng"],
                rating=place.get("rating"),
                distance=place.get("distance"),
                eta=place.get("eta"),
                google_maps_url=place.get("google_maps_url", "")
            )
            stops.append(stop)
        
        map_url = await self.serpapi_service.generate_directions_map_url(places, user_location)
        
        plan = Plan(
            plan_id=str(uuid.uuid4()),
            stops=stops,
            map_preview_url=map_url,
            total_distance=self._calculate_total_distance(stops),
            total_time=self._calculate_total_time(len(stops)),
            created_at=datetime.now()
        )
        
        logger.info(f"📊 Formatted response with {len(plan.stops) if hasattr(plan, 'stops') else 0} routes")
        logger.info(f"💡 Summary: {plan.total_time} for {plan.total_distance} km" if hasattr(plan, 'total_time') and hasattr(plan, 'total_distance') else "No summary")
        
        return plan
    
    def _calculate_total_distance(self, stops: List[Stop]) -> float:
        return sum([stop.distance or 0 for stop in stops])
    
    def _calculate_total_time(self, num_stops: int) -> str:
        travel_time = num_stops * 15  # 15 min travel per stop
        stop_time = num_stops * 20 # 20 min at each stop
        total_minutes = travel_time + stop_time
        hours = total_minutes // 60
        minutes = total_minutes % 60
        
        if hours > 0:
            return f"~{hours}h {minutes}m"
        return f"~{minutes}m"