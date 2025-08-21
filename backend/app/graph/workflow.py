import logging
from typing import List, Dict, Any
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

from app.models.graph_state import GraphState
from app.agents.task_decomposer import TaskDecomposerAgent
from app.agents.place_search import PlaceSearchAgent
from app.agents.routing import RoutingAgent
from app.agents.formatter import FormatterAgent
from app.agents.validator import ValidationAgent

logger = logging.getLogger(__name__)

# --- Agent Node Functions ---

async def decompose_tasks(state: GraphState) -> Dict[str, Any]:
    logger.info("--- 🔄 NODE: DECOMPOSING TASKS ---")
    
    try:
        agent = TaskDecomposerAgent()
        # Handle different possible key names for user input to avoid KeyError
        user_input = state.get("user_input") or state.get("user_text") or state.get("text", "")
        lat = state.get("lat") or state.get("latitude", 0)
        lng = state.get("lng") or state.get("longitude", 0)
        
        logger.info(f"📝 Processing user input: {user_input}")
        logger.info(f"📍 Location: {lat}, {lng}")
        
        tasks = await agent.decompose_task(user_input, (lat, lng))
        
        logger.info(f"✅ Decomposed {len(tasks)} tasks")
        
        return {
            "tasks": tasks,
            "current_step": "place_search"
        }
        
    except Exception as e:
        logger.error(f"❌ Error in decompose_tasks: {str(e)}")
        raise

async def search_places(state: GraphState) -> Dict[str, Any]:
    logger.info("--- 🔍 NODE: SEARCHING PLACES ---")
    
    try:
        agent = PlaceSearchAgent()
        tasks = state.get("tasks", [])
        lat = state.get("lat") or state.get("latitude", 0)
        lng = state.get("lng") or state.get("longitude", 0)
        
        logger.info(f"🎯 Searching for {len(tasks)} tasks at location: {lat}, {lng}")
        
        places = await agent.search_all_tasks(tasks, lat, lng)
        
        logger.info(f"✅ Found {len(places)} places")
        
        return {
            "places": places,
            "current_step": "validate"
        }
        
    except Exception as e:
        logger.error(f"❌ Error in search_places: {str(e)}")
        raise

async def validate_places(state: GraphState) -> Dict[str, Any]:
    logger.info("--- ✅ NODE: VALIDATING PLACES ---")
    
    try:
        agent = ValidationAgent()
        places = state.get("places", [])
        lat = state.get("lat") or state.get("latitude", 0)
        lng = state.get("lng") or state.get("longitude", 0)
        
        logger.info(f"🔍 Validating {len(places)} places")
        
        validated_places = await agent.validate_places(places, lat, lng)
        
        logger.info(f"✅ Validated {len(validated_places)} places")
        
        return {
            "validated_places": validated_places,
            "current_step": "optimize"
        }
        
    except Exception as e:
        logger.error(f"❌ Error in validate_places: {str(e)}")
        raise

async def optimize_route(state: GraphState) -> Dict[str, Any]:
    logger.info("--- 🛤️ NODE: OPTIMIZING ROUTE ---")
    
    try:
        agent = RoutingAgent()
        validated_places = state.get("validated_places", [])
        lat = state.get("lat") or state.get("latitude", 0)
        lng = state.get("lng") or state.get("longitude", 0)
        
        logger.info(f"🚗 Optimizing route for {len(validated_places)} places")
        
        optimized_route = await agent.optimize_route(validated_places, lat, lng)
        
        logger.info(f"✅ Route optimized with {len(optimized_route)} stops")
        
        return {
            "optimized_route": optimized_route,
            "current_step": "format"
        }
        
    except Exception as e:
        logger.error(f"❌ Error in optimize_route: {str(e)}")
        raise

async def format_plan(state: GraphState) -> Dict[str, Any]:
    logger.info("--- 📋 NODE: FORMATTING PLAN ---")
    
    try:
        agent = FormatterAgent()
        optimized_route = state.get("optimized_route", [])
        lat = state.get("lat") or state.get("latitude", 0)
        lng = state.get("lng") or state.get("longitude", 0)
        user_location = {"lat": lat, "lng": lng}
        
        logger.info(f"📝 Formatting plan with {len(optimized_route)} stops")
        
        final_plan = await agent.format_plan(optimized_route, user_location)
        
        logger.info("✅ Plan formatted successfully")
        
        # Log the final state for debugging
        logger.info(f"🔍 Final state keys: {list(state.keys())}")
        if "final_plan" in locals():
            logger.info(f"📋 Plan formatted successfully")
        
        return {
            "final_plan": final_plan.dict() if hasattr(final_plan, 'dict') else final_plan,
            "current_step": "complete"
        }
        
    except Exception as e:
        logger.error(f"❌ Error in format_plan: {str(e)}")
        raise

# --- Workflow Definition ---

def create_workflow():
    workflow = StateGraph(GraphState)
    workflow.add_node("decompose", decompose_tasks)
    workflow.add_node("search", search_places)
    workflow.add_node("validate", validate_places)
    workflow.add_node("optimize", optimize_route)
    workflow.add_node("format", format_plan)

    workflow.set_entry_point("decompose")
    workflow.add_edge("decompose", "search")
    workflow.add_edge("search", "validate")
    workflow.add_edge("validate", "optimize")
    workflow.add_edge("optimize", "format")
    workflow.add_edge("format", END)
    
    logger.info("✅ LangGraph workflow compiled successfully.")
    return workflow.compile()