import logging
import json
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import ValidationError
import json

from app.models.request_models import PlanRequest, FeedbackRequest
from app.services.cache import CacheService
from app.utils.config import settings
from app.graph.workflow import create_workflow

# Configure logging at the application's entry point
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(title="RouteRight AI", version="1.0.1")
logger.info("🚀 FastAPI app starting up...")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Initialize services and workflow
cache = CacheService()
workflow = create_workflow()

@app.post("/plan-test")
async def test_plan():
    # Test with hardcoded valid data
    test_data = {
        "user_text": "I need to go grocery shopping and get coffee",
        "lat": 20.891243,
        "lng": 85.219601
    }
    
    try:
        # Test if we can create a PlanRequest from this data
        request = PlanRequest(**test_data)
        logger.info(f"✅ TEST: Valid PlanRequest created: {request}")
        return {"status": "success", "message": "Test data is valid", "data": test_data}
    except Exception as e:
        logger.error(f"❌ TEST: Error creating PlanRequest: {e}")
        return {"status": "error", "message": str(e), "data": test_data}

@app.post("/plan-debug")
async def debug_plan(request: Request):
    try:
        body = await request.body()
        logger.info(f"🔍 DEBUG: Raw request body: {body}")
        
        try:
            json_data = json.loads(body)
            logger.info(f"🔍 DEBUG: Parsed JSON: {json_data}")
            logger.info(f"🔍 DEBUG: JSON keys: {list(json_data.keys())}")
            logger.info(f"🔍 DEBUG: JSON types: {[(k, type(v)) for k, v in json_data.items()]}")
        except json.JSONDecodeError as e:
            logger.error(f"❌ DEBUG: JSON decode error: {e}")
            
        return {"status": "debug", "received": True}
    except Exception as e:
        logger.error(f"❌ DEBUG: Error: {e}")
        return {"status": "error", "message": str(e)}

@app.post("/plan")
async def create_plan(request: PlanRequest):
    logger.info(f"🌐 Received /plan request")
    logger.info(f"📝 Request user_text: {request.user_text}")
    logger.info(f"📍 Request lat: {request.lat}")
    logger.info(f"📍 Request lng: {request.lng}")
    
    try:
        # Create initial state with consistent key naming
        initial_state = {
            "user_input": request.user_text,  # Use correct attribute name
            "lat": request.lat,
            "lng": request.lng, 
            "preferences": getattr(request, 'preferences', {}),  # Safe access to preferences
            "current_step": "decompose"
        }
        
        logger.info(f"🔧 Initial state: {initial_state}")

        # Execute the workflow synchronously
        result = await workflow.ainvoke(initial_state)
        
        logger.info(f"✅ Workflow completed")
        logger.info(f"🔍 Final result keys: {list(result.keys())}")
        
        # Extract the final plan from the result
        final_plan = result.get("final_plan")
        if final_plan:
            logger.info(f"📋 Plan found in result")
            return final_plan
        
        # If no final_plan, construct response from optimized_route
        optimized_route = result.get("optimized_route", [])
        if optimized_route:
            logger.info(f"📋 Constructing plan from optimized_route with {len(optimized_route)} stops")
            
            # Calculate total distance and time from the optimized route
            total_distance = sum(stop.get("distance_km", 0) for stop in optimized_route)
            total_time = sum(stop.get("duration_minutes", 0) for stop in optimized_route)
            
            # Format time
            if total_time >= 60:
                time_formatted = f"~{total_time // 60}h {total_time % 60}m"
            else:
                time_formatted = f"~{total_time}m"
            
            response = {
                "stops": optimized_route,
                "success": True,
                "total_stops": len(optimized_route),
                "total_time": time_formatted,
                "total_distance_km": round(total_distance, 2),
                "message": f"Found {len(optimized_route)} stops for your errands"
            }
            
            logger.info(f"📤 Sending response: {response}")
            return response
        else:
            logger.warning("⚠️ No plan data found in workflow result")
            return {
                "stops": [],
                "success": False,
                "error": "No route data generated",
                "message": "Unable to generate a route plan"
            }
        
    except Exception as e:
        logger.error(f"❌ Error in create_plan: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to generate plan: {str(e)}")

@app.post("/feedback")
async def submit_feedback(request: FeedbackRequest):
    logger.info(f"👍 Received feedback for plan ID: {request.plan_id}")
    await cache.set(f"feedback:{request.plan_id}", request.dict(), expire=86400)
    return {"status": "success", "message": "Feedback received"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": "2025-01-21"}

@app.get("/test")
def test_endpoint():
    return {
        "message": "Test endpoint working",
        "test_data": {
            "stops": [
                {
                    "name": "Test Store",
                    "address": "123 Test St",
                    "category": "grocery",
                    "lat": 20.891243,
                    "lng": 85.219601
                }
            ],
            "success": True,
            "total_stops": 1
        }
    }