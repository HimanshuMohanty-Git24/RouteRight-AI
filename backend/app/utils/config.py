import os
import json
import logging
from typing import List, Optional
from pydantic_settings import BaseSettings

# Configure logging at the module level
logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    # API Keys
    groq_api_key: str = ""
    foursquare_api_key: str = ""
    serpapi_api_key: str = ""
    
    # CORS settings
    cors_origins: List[str] = ["http://localhost:5173"]
    
    # Redis settings
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_username: Optional[str] = "default"
    redis_password: str = ""
    
    # App settings
    groq_model: str = "llama-3.3-70b-versatile"
    routing_provider: str = "ors"
    cache_ttl_seconds: int = 600
    log_level: str = "info"
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
        
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        # Load from environment variables with fallbacks
        self.groq_api_key = os.getenv("GROQ_API_KEY", self.groq_api_key)
        self.foursquare_api_key = os.getenv("FOURSQUARE_API_KEY", self.foursquare_api_key)
        self.serpapi_api_key = os.getenv("SERPAPI_API_KEY", self.serpapi_api_key)
        
        # Parse CORS origins from environment
        cors_str = os.getenv("CORS_ORIGINS", '["http://localhost:5173"]')
        try:
            self.cors_origins = json.loads(cors_str)
        except json.JSONDecodeError:
            logger.warning("Failed to parse CORS_ORIGINS, using default")
            self.cors_origins = ["http://localhost:5173"]
            
        # Redis settings with environment overrides
        self.redis_host = os.getenv("REDIS_HOST", self.redis_host)
        self.redis_port = int(os.getenv("REDIS_PORT", str(self.redis_port)))
        self.redis_username = os.getenv("REDIS_USERNAME", self.redis_username)
        self.redis_password = os.getenv("REDIS_PASSWORD", self.redis_password)
        
        # App settings
        self.groq_model = os.getenv("GROQ_MODEL", self.groq_model)
        self.routing_provider = os.getenv("ROUTING_PROVIDER", self.routing_provider)
        self.cache_ttl_seconds = int(os.getenv("CACHE_TTL_SECONDS", str(self.cache_ttl_seconds)))
        self.log_level = os.getenv("LOG_LEVEL", self.log_level)

# Create global settings instance with error handling
try:
    settings = Settings()
    logger.info("✅ Configuration loaded successfully.")
    
    # Log configuration status for debugging (without exposing sensitive data)
    logger.info(f"🔧 Config: GROQ API Key: {'✅ Set' if settings.groq_api_key else '❌ Missing'}")
    logger.info(f"🔧 Config: Foursquare API Key: {'✅ Set' if settings.foursquare_api_key else '❌ Missing'}")
    logger.info(f"🔧 Config: SerpAPI Key: {'✅ Set' if settings.serpapi_api_key else '❌ Missing'}")
    logger.info(f"🔧 Config: CORS Origins: {settings.cors_origins}")
    logger.info(f"🔧 Config: Redis Host: {settings.redis_host}:{settings.redis_port}")
    
except Exception as e:
    logger.error(f"❌ ERROR: Could not load settings. Error: {e}")
    # Don't exit in production - create a minimal settings object
    settings = Settings()
    logger.warning("⚠️ Using default settings due to configuration error")