import httpx
import logging
from typing import List, Dict, Any, Optional
from app.utils.config import settings

logger = logging.getLogger(__name__)

class SerpAPIService:
    def __init__(self):
        self.api_key = settings.serpapi_api_key
        self.base_url = "https://serpapi.com/search"
        logger.info("🐍 SerpAPIService initialized.")
    
    async def search_local_places(self, query: str, lat: float, lng: float) -> List[Dict[str, Any]]:
        params = {
            "engine": "google_maps",
            "q": query,
            "ll": f"@{lat},{lng},14z",
            "type": "search",
            "api_key": self.api_key,
            "hl": "en"
        }
        
        try:
            logger.info(f"🐍 SerpAPI search for: '{query}' near ({lat},{lng})")
            async with httpx.AsyncClient() as client:
                response = await client.get(self.base_url, params=params)
                response.raise_for_status()
                data = response.json()
                results = data.get("local_results", [])
                logger.info(f"✅ SerpAPI found {len(results)} places.")
                return results
        except httpx.HTTPStatusError as e:
            logger.error(f"❌ SerpAPI error: {e.response.status_code} - {e.response.text}")
            return []
        except Exception as e:
            logger.error(f"❌ Unexpected error in SerpAPI search: {e}")
            return []

    async def generate_directions_map_url(
        self, stops: List[Dict[str, Any]], user_location: Dict[str, float]
    ) -> Optional[str]:
        if not stops:
            logger.warning("🗺️ Cannot generate map URL: no stops provided.")
            return None

        try:
            # Build Google Maps URL manually instead of using SerpAPI
            # Start with user location
            origin = f"{user_location['lat']},{user_location['lng']}"
            destination = f"{stops[-1]['lat']},{stops[-1]['lng']}"
            
            # Add waypoints if there are intermediate stops
            waypoints = []
            if len(stops) > 1:
                for stop in stops[:-1]:  # All stops except the last one
                    waypoints.append(f"{stop['lat']},{stop['lng']}")
            
            # Build the Google Maps URL
            base_url = "https://www.google.com/maps/dir/"
            url_parts = [origin]
            url_parts.extend(waypoints)
            url_parts.append(destination)
            
            map_url = base_url + "/".join(url_parts)
            
            logger.info(f"✅ Generated Google Maps URL: {map_url}")
            return map_url
            
        except Exception as e:
            logger.error(f"❌ Error generating directions map URL: {e}")
            return None