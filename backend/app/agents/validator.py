import logging
from typing import List, Dict, Any
from geopy.distance import geodesic
from ..graph.workflow import GraphState

# Configure logging for debugging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ValidationAgent:
    def __init__(self):
        self.max_distance_km = 50
        self.min_rating = 3.0
    
    async def validate_places(self, places: List[Dict[str, Any]], user_lat: float, user_lng: float) -> List[Dict[str, Any]]:
        logger.info("✅ Starting place validation")
        logger.info(f"📍 Places to validate: {len(places) if places else 0}")
        
        if not places:
            return []
            
        unique_places = {}
        for place in places:
            # Skip places without valid coordinates
            lat = place.get("lat")
            lng = place.get("lng")
            if lat is None or lng is None:
                continue
                
            # Use a tuple of name and lat/lng to identify unique places, preventing duplicates
            # from different sources (Foursquare, SerpAPI) for the same physical location.
            try:
                key = (place.get("name"), round(float(lat), 4), round(float(lng), 4))
                if key not in unique_places:
                    unique_places[key] = place
            except (ValueError, TypeError):
                # Skip places with invalid coordinates
                continue
        
        validated_places = []
        for place in unique_places.values():
            if self._is_valid_place(place, user_lat, user_lng):
                validated_places.append(place)
        
        # Select the best candidate for each task type
        best_places_by_task = {}
        for place in validated_places:
            task_type = place.get("task_type")
            if task_type:
                # Prioritize places with higher ratings
                if task_type not in best_places_by_task or \
                   (place.get("rating") or 0) > (best_places_by_task[task_type].get("rating") or 0):
                    best_places_by_task[task_type] = place

        logger.info(f"✅ Validation completed. Validated places: {len(validated_places)}")
    
        return list(best_places_by_task.values())[:6]  # Limit to 6 stops as per MVP scope
    
    def _is_valid_place(self, place: Dict[str, Any], user_lat: float, user_lng: float) -> bool:
        try:
            if not all(k in place for k in ["name", "lat", "lng", "address"]):
                return False
            
            # Ensure coordinates are valid floats
            lat, lng = float(place["lat"]), float(place["lng"])
            place_location = (lat, lng)
            
            distance = geodesic((user_lat, user_lng), place_location).kilometers
            if distance > self.max_distance_km:
                return False
            
            rating = place.get("rating")
            if rating is not None and float(rating) < self.min_rating:
                return False
            
            return True
            
        except (ValueError, TypeError):
            return False