import logging
import uuid
from typing import List, Dict, Any
from geopy.distance import geodesic
from app.services.routing_service import RoutingService

logger = logging.getLogger(__name__)

class RoutingAgent:
    def __init__(self):
        self.routing_service = RoutingService()
        logger.info("🚗 RoutingAgent initialized.")
    
    async def optimize_route(self, places: List[Dict[str, Any]], start_lat: float, start_lng: float) -> List[Dict[str, Any]]:
        if not places:
            return []
        
        if len(places) <= 1:
            logger.info("🛤️ Only one stop, no optimization needed. Adding route info.")
            return self._add_route_info(places, start_lat, start_lng)
        
        locations = [(start_lat, start_lng)]
        locations.extend([(p["lat"], p["lng"]) for p in places])
        
        try:
            logger.info(f"🛤️ Optimizing route for {len(places)} stops.")
            optimal_order_indices = self.routing_service.solve_tsp(locations, start_index=0)
            
            # Reorder places list. Skip index 0 (start location) and adjust index by -1
            ordered_places = [places[i - 1] for i in optimal_order_indices[1:]]
            logger.info("✅ Route optimized successfully.")
            
            return self._add_route_info(ordered_places, start_lat, start_lng)
            
        except Exception as e:
            logger.error(f"❌ Routing optimization failed: {e}. Returning original order.")
            return self._add_route_info(places, start_lat, start_lng)
    
    def _add_route_info(self, places: List[Dict[str, Any]], start_lat: float, start_lng: float) -> List[Dict[str, Any]]:
        enhanced_places = []
        prev_lat, prev_lng = start_lat, start_lng
        
        for i, place in enumerate(places):
            place_copy = place.copy()
            
            place_copy.update({
                "id": str(uuid.uuid4()),
                "order": i + 1,
                "google_maps_url": f"https://maps.google.com/?daddr={place['lat']},{place['lng']}",
                "distance": round(geodesic((prev_lat, prev_lng), (place['lat'], place['lng'])).kilometers, 2),
                "eta": f"~{(i + 1) * 15} min drive"
            })
            
            enhanced_places.append(place_copy)
            prev_lat, prev_lng = place["lat"], place["lng"]
        
        logger.info(f"📝 Added route info to {len(enhanced_places)} stops.")
        return enhanced_places