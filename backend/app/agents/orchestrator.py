import logging
from typing import Dict, Any, AsyncGenerator
import asyncio
import uuid

from .task_decomposer import TaskDecomposerAgent
from .place_search import PlaceSearchAgent
from .routing import RoutingAgent
from .validator import ValidationAgent
from .formatter import FormatterAgent

from app.services.cache import CacheService
from app.models.response_models import ProgressUpdate, Plan
from typing import Dict, Any
from langchain_core.messages import HumanMessage
from ..models.request_models import RouteRequest
from ..models.response_models import RouteResponse
from ..graph.workflow import create_workflow

# Configure logging for debugging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class OrchestratorAgent:
    def __init__(self):
        logger.info("🚀 OrchestratorAgent initialized")
        self.task_decomposer = TaskDecomposerAgent()
        self.place_search = PlaceSearchAgent()
        self.routing_agent = RoutingAgent()
        self.validator = ValidationAgent()
        self.formatter = FormatterAgent()
        self.cache = CacheService()
    
    async def process_plan_request(self, user_text: str, lat: float, lng: float, 
                                 prefs: Dict[str, Any]) -> AsyncGenerator[Dict[str, Any], None]:
        
        session_id = str(uuid.uuid4())
        
        logger.info(f"📋 Processing plan request: {user_text}")
        logger.info(f"📍 User location: ({lat}, {lng})")
        
        try:
            yield {"type": "progress", "data": ProgressUpdate(
                step="decomposing", message="Understanding your errands...", progress=10, status="processing"
            ).dict()}
            tasks = await self.task_decomposer.decompose_task(user_text, (lat, lng))
            if not tasks:
                raise ValueError("Could not understand the errand request. Please try again with more details.")

            logger.debug(f"🔍 Decomposed tasks: {tasks}")
            
            yield {"type": "progress", "data": ProgressUpdate(
                step="searching", message=f"Finding places for {len(tasks)} tasks...", progress=30, status="processing"
            ).dict()}
            places = await self.place_search.search_all_tasks(tasks, lat, lng)

            logger.debug(f"📍 Found places: {places}")
            
            yield {"type": "progress", "data": ProgressUpdate(
                step="validating", message="Filtering and validating locations...", progress=60, status="processing"
            ).dict()}
            validated_places = await self.validator.validate_places(places, lat, lng)
            if not validated_places:
                raise ValueError("Could not find any suitable places nearby for your errands.")

            logger.debug(f"✅ Validated places: {validated_places}")
            
            yield {"type": "progress", "data": ProgressUpdate(
                step="optimizing", message="Optimizing your route...", progress=80, status="processing"
            ).dict()}
            optimized_places = await self.routing_agent.optimize_route(validated_places, lat, lng)

            logger.debug(f"🛤️ Optimized route: {optimized_places}")
            
            yield {"type": "progress", "data": ProgressUpdate(
                step="formatting", message="Preparing your plan...", progress=95, status="processing"
            ).dict()}
            user_location = {"lat": lat, "lng": lng}
            plan = await self.formatter.format_plan(optimized_places, user_location)
            
            await self.cache.set(f"plan:{plan.plan_id}", plan.dict(by_alias=True), expire=3600)
            
            logger.info(f"✅ Plan created successfully: {plan.plan_id}")
            
            yield {"type": "complete", "data": plan.dict(by_alias=True)}
            
        except Exception as e:
            logger.error(f"❌ Error in process_plan_request: {str(e)}")
            logger.error(f"🔍 Exception type: {type(e).__name__}")
            yield {"type": "error", "data": {
                "message": f"An error occurred: {str(e)}",
                "session_id": session_id
            }}

class RouteOrchestrator:
    def __init__(self):
        logger.info("🚀 RouteOrchestrator initialized")
        self.workflow = create_workflow()
    
    async def process_route_request(self, request: RouteRequest) -> RouteResponse:
        logger.info(f"📋 Processing route request: {request.user_input}")
        logger.info(f"📍 Start location: {request.start_location}")
        logger.info(f"🎯 End location: {request.end_location}")
        
        try:
            initial_state = {
                "user_input": request.user_input,
                "start_location": request.start_location,
                "end_location": request.end_location,
                "current_step": "task_decomposition"
            }
            
            result = await self.workflow.ainvoke(initial_state)
            logger.info("✅ Workflow completed successfully")
            logger.info(f"📊 Final result keys: {list(result.keys())}")
            
            return result.get("final_response", result)
            
        except Exception as e:
            logger.error(f"❌ Error in process_route_request: {str(e)}")
            logger.error(f"🔍 Exception type: {type(e).__name__}")
            raise
    
    async def process_plan_request(self, user_text: str, lat: float, lng: float, prefs: dict):
        """Process plan request with streaming response"""
        logger.info(f"📋 Processing plan request: {user_text}")
        logger.info(f"📍 Location: ({lat}, {lng})")
        logger.info(f"🎯 Preferences: {prefs}")
        
        try:
            # Convert plan request to route request format
            initial_state = {
                "user_input": user_text,
                "latitude": lat,
                "longitude": lng,
                "preferences": prefs,
                "current_step": "task_decomposition"
            }
            
            # Stream progress updates
            yield {"status": "starting", "message": "Starting plan generation..."}
            
            result = await self.workflow.ainvoke(initial_state)
            
            yield {"status": "complete", "data": result.get("final_response", result)}
            
        except Exception as e:
            logger.error(f"❌ Error in process_plan_request: {str(e)}")
            yield {"status": "error", "message": str(e)}