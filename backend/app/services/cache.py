import redis
import json
import logging
from typing import Any, Optional
from app.utils.config import settings

logger = logging.getLogger(__name__)

class CacheService:
    def __init__(self):
        try:
            logger.info(f"🗄️ Initializing CacheService and connecting to Redis at {settings.redis_host}:{settings.redis_port}")
            self.redis_client = redis.Redis(
                host=settings.redis_host,
                port=settings.redis_port,
                username=settings.redis_username,
                password=settings.redis_password,
                decode_responses=True
            )
            self.redis_client.ping()
            logger.info("✅ Successfully connected to Redis.")
        except redis.exceptions.ConnectionError as e:
            logger.error(f"❌ Could not connect to Redis: {e}. Cache will not be available.")
            self.redis_client = None
        except Exception as e:
            logger.error(f"❌ An unexpected error occurred during Redis connection: {e}")
            self.redis_client = None

    async def get(self, key: str) -> Optional[Any]:
        if not self.redis_client:
            return None
        try:
            value = self.redis_client.get(key)
            if value:
                logger.info(f"✅ Cache HIT for key: {key}")
                return json.loads(value)
            else:
                logger.info(f"❌ Cache MISS for key: {key}")
                return None
        except Exception as e:
            logger.error(f"❌ Cache GET error for key '{key}': {e}")
            return None
    
    async def set(self, key: str, value: Any, expire: int = 3600):
        if not self.redis_client:
            return
        try:
            self.redis_client.set(key, json.dumps(value), ex=expire)
            logger.info(f"💾 Cache SET successful for key: {key} (TTL: {expire}s)")
        except Exception as e:
            logger.error(f"❌ Cache SET error for key '{key}': {e}")

    async def delete(self, key: str):
        if not self.redis_client:
            return
        try:
            self.redis_client.delete(key)
            logger.info(f"🗑️ Cache DELETE successful for key: {key}")
        except Exception as e:
            logger.error(f"❌ Cache DELETE error for key '{key}': {e}")