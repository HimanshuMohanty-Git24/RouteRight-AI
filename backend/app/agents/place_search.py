from app.services.foursquare import FoursquareService
from app.services.serpapi_service import SerpAPIService
from typing import List, Dict, Any
import asyncio
import logging
from ..graph.workflow import GraphState

# Configure logging for debugging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class PlaceSearchAgent:
    def __init__(self):
        self.foursquare = FoursquareService()
        self.serpapi = SerpAPIService()
    
    async def search_for_task(self, task: Dict[str, Any], lat: float, lng: float) -> List[Dict[str, Any]]:
        query = task.get("search_query", task.get("task_type", ""))
        
        logger.info(f"Searching for task: {task}, lat: {lat}, lng: {lng}")
        
        try:
            foursquare_results, serpapi_results = await asyncio.gather(
                self.foursquare.search_places(query, lat, lng, limit=3),
                self.serpapi.search_local_places(query, lat, lng),
                return_exceptions=True
            )
            
            logger.info(f"Foursquare results: {foursquare_results}")
            logger.info(f"SerpAPI results: {serpapi_results}")
            
            processed_places = []
            seen_ids = set()

            if isinstance(foursquare_results, list):
                for place in foursquare_results:
                    processed = self._process_foursquare_place(place, task)
                    if processed and processed.get("id") and processed.get("lat") is not None and processed.get("lng") is not None:
                        if processed.get("id") not in seen_ids:
                            processed_places.append(processed)
                            seen_ids.add(processed.get("id"))
            
            if isinstance(serpapi_results, list):
                for place in serpapi_results:
                    processed = self._process_serpapi_place(place, task)
                    if processed and processed.get("id") and processed.get("lat") is not None and processed.get("lng") is not None:
                        if processed.get("id") not in seen_ids:
                            processed_places.append(processed)
                            seen_ids.add(processed.get("id"))
            
            logger.info(f"Processed places: {processed_places}")
            
            return processed_places[:5] # Return top 5 combined results
            
        except Exception as e:
            logger.error(f"Error searching for {query}: {e}")
            return []
    
    def _process_foursquare_place(self, place: Dict[str, Any], task: Dict[str, Any]) -> Dict[str, Any]:
        try:
            # Handle both old and new Foursquare API response formats
            geocodes = place.get("geocodes", {}).get("main", {})
            location = place.get("location", {})
            
            # Extract coordinates - try multiple possible field names
            lat = geocodes.get("latitude") or place.get("latitude")
            lng = geocodes.get("longitude") or place.get("longitude")
            
            # Skip places without valid coordinates
            if lat is None or lng is None:
                logger.warning(f"Skipping Foursquare place {place.get('name')} - missing coordinates")
                return None
            
            return {
                "source": "foursquare",
                "id": place.get("fsq_id") or place.get("fsq_place_id"),
                "name": place.get("name", ""),
                "category": place.get("categories", [{}])[0].get("name", ""),
                "address": location.get("formatted_address", ""),
                "lat": float(lat),
                "lng": float(lng),
                "rating": place.get("rating", 0) / 2 if place.get("rating") else None,
                "task_type": task.get("task_type"),
            }
        except Exception as e:
            logger.error(f"Error processing Foursquare place: {e}")
            return None
    
    def _process_serpapi_place(self, place: Dict[str, Any], task: Dict[str, Any]) -> Dict[str, Any]:
        try:
            gps = place.get("gps_coordinates", {})
            
            # Extract coordinates
            lat = gps.get("latitude")
            lng = gps.get("longitude")
            
            # Skip places without valid coordinates
            if lat is None or lng is None:
                logger.warning(f"Skipping SerpAPI place {place.get('title')} - missing coordinates")
                return None
                
            return {
                "source": "serpapi",
                "id": place.get("place_id"),
                "name": place.get("title", ""),
                "category": place.get("type", ""),
                "address": place.get("address", ""),
                "lat": float(lat),
                "lng": float(lng),
                "rating": place.get("rating"),
                "task_type": task.get("task_type"),
            }
        except Exception as e:
            logger.error(f"Error processing SerpAPI place: {e}")
            return None

    async def search_all_tasks(self, tasks: List[Dict[str, Any]], lat: float, lng: float) -> List[Dict[str, Any]]:
        logger.info(f"Searching all tasks: {tasks}, lat: {lat}, lng: {lng}")
        search_coroutines = [self.search_for_task(task, lat, lng) for task in tasks]
        results = await asyncio.gather(*search_coroutines, return_exceptions=True)
        
        all_places = []
        for result in results:
            if isinstance(result, list):
                all_places.extend(result)
        
        logger.info(f"All places found: {all_places}")
        return all_places

async def place_search_agent(state: GraphState) -> Dict[str, Any]:
    logger.info("🔍 Starting place search")
    logger.info(f"📍 Start location: {state.start_location}")
    logger.info(f"🎯 End location: {state.end_location}")
    
    try:
        agent = PlaceSearchAgent()
        
        start_places = await agent.search_for_task({"task_type": "start"}, state.start_location.lat, state.start_location.lng)
        end_places = await agent.search_for_task({"task_type": "end"}, state.end_location.lat, state.end_location.lng)
        
        logger.info(f"✅ Found {len(start_places)} start places and {len(end_places)} end places")
        logger.info(f"📍 Start places: {[p.get('name', 'Unknown') for p in start_places]}")
        logger.info(f"🎯 End places: {[p.get('name', 'Unknown') for p in end_places]}")
        
        return {
            "start_places": start_places,
            "end_places": end_places,
            "current_step": "routing"
        }
        
    except Exception as e:
        logger.error(f"❌ Error in place_search_agent: {str(e)}")
        raise