import logging
import json
import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import ValidationError

from app.models.request_models import PlanRequest, FeedbackRequest
from app.services.cache import CacheService
from app.utils.config import settings
from app.graph.workflow import create_workflow

# Configure logging for production
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Detect environment
IS_PRODUCTION = bool(os.getenv("RENDER"))

# Create FastAPI app with proper metadata
app = FastAPI(
    title="RouteRight AI API", 
    version="1.0.0",
    description="AI-powered errand planning and route optimization",
    docs_url="/docs" if not IS_PRODUCTION else None,  # Disable docs in production
    redoc_url="/redoc" if not IS_PRODUCTION else None
)

logger.info(f"🚀 Starting RouteRight AI API - Environment: {'Production' if IS_PRODUCTION else 'Development'}")

# CORS setup for production
if IS_PRODUCTION:
    # Production CORS - more restrictive
    cors_origins = [
        "https://routerightai.netlify.app",
        "https://routerightai.netlify.app"
    ]
else:
    # Development CORS - more permissive
    cors_origins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ] + settings.cors_origins  # Keep your existing settings

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "type": "server_error"}
    )

# Initialize services with error handling
cache = None
workflow = None

@app.on_event("startup")
async def startup_event():
    global cache, workflow
    try:
        cache = CacheService()
        workflow = create_workflow()
        logger.info("✅ Services initialized successfully")
    except Exception as e:
        logger.error(f"❌ Failed to initialize services: {e}")
        # Don't raise in production, let the app start and handle errors gracefully

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
    """Create a new errand plan"""
    logger.info(f"🌐 Received /plan request")
    logger.info(f"📝 Request user_text: {request.user_text}")
    logger.info(f"📍 Request lat: {request.lat}")
    logger.info(f"📍 Request lng: {request.lng}")
    
    try:
        if not workflow:
            raise HTTPException(status_code=503, detail="Service not initialized")
            
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
        
    except ValidationError as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"❌ Error in create_plan: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to generate plan: {str(e)}")

@app.post("/feedback")
async def submit_feedback(request: FeedbackRequest):
    """Submit feedback for a plan"""
    try:
        logger.info(f"👍 Received feedback for plan ID: {request.plan_id}")
        await cache.set(f"feedback:{request.plan_id}", request.dict(), expire=86400)
        return {"status": "success", "message": "Feedback received"}
    except Exception as e:
        logger.error(f"Error submitting feedback: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit feedback")

@app.get("/health")
def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "service": "RouteRight AI Backend",
        "version": "1.0.0",
        "environment": "production" if IS_PRODUCTION else "development"
    }

@app.get("/")
@app.get("/test")
def test_endpoint():
    """Test endpoint to verify API is running"""
    return {
        "message": "🚀 RouteRight AI Backend is running!",
        "status": "success",
        "environment": "production" if IS_PRODUCTION else "development",
        "docs_url": "/docs" if not IS_PRODUCTION else "disabled",
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

# Add this for Render deployment
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = "0.0.0.0"
    
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=not IS_PRODUCTION,
        log_level="info"
    )