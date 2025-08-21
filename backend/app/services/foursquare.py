import httpx
import logging
from typing import List, Dict, Any
from app.utils.config import settings

# Configure logging for debugging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class FoursquareService:
    def __init__(self):
        self.api_key = settings.foursquare_api_key
        self.base_url = "https://places-api.foursquare.com"
        logger.info("🏢 FoursquareService initialized")
        
    async def search_places(self, query: str, lat: float, lng: float, limit: int = 5) -> List[Dict[str, Any]]:
        logger.info(f"🔍 Searching places: query='{query}', location='{lat},{lng}'")
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json",
            "X-Places-Api-Version": "2025-06-17"
        }
        
        params = {
            "query": query,
            "ll": f"{lat},{lng}",
            "limit": limit,
            "radius": 10000,
            "sort": "RELEVANCE"
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/places/search",
                    headers=headers,
                    params=params
                )
                response.raise_for_status()
                places = response.json().get("results", [])
                
                logger.info(f"📍 Found {len(places)} places from Foursquare")
                for place in places[:3]:  # Log first 3 places
                    logger.info(f"  📌 {place.get('name', 'Unknown')} - {place.get('location', {}).get('address', 'No address')}")
                
                return places
            
        except Exception as e:
            logger.error(f"❌ Error in Foursquare search: {str(e)}")
            return []