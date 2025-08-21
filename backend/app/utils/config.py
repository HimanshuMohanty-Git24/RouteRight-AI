import logging
from pydantic_settings import BaseSettings
from typing import List, Optional
import os

# Configure logging at the module level
logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    groq_api_key: str = os.getenv("GROQ_API_KEY")
    foursquare_api_key: str
    serpapi_api_key: str
    cors_origins: List[str] = ["http://localhost:5173"]

    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_username: Optional[str] = "default"
    redis_password: str = ""
    
    class Config:
        env_file = ".env"
        # This will help debug if a variable is missing
        env_file_encoding = 'utf-8'

try:
    settings = Settings()
    logger.info("✅ Configuration loaded successfully.")
except Exception as e:
    logger.critical(f"❌ CRITICAL ERROR: Could not load settings from .env file. Error: {e}")
    # Exit if config fails, as the app cannot run without it.
    exit(1)