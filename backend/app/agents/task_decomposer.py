# Make sure to use groq instead of openai
from groq import Groq
from langchain_groq import ChatGroq
from langchain.schema import HumanMessage, SystemMessage
from typing import List, Dict, Any, Annotated
from app.models.graph_state import GraphState
import json
from app.utils.config import settings
import logging

# Configure logging for debugging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class TaskDecomposerAgent:
    def __init__(self):
        self.llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            api_key=settings.groq_api_key,
            temperature=0.1
        )
    
    async def decompose_task(self, user_text: str, user_location: tuple) -> List[Dict[str, Any]]:
        logger.info("🔄 Starting task decomposition")
        logger.info(f"📝 User input: {user_text}")
        
        system_prompt = """
        You are an expert errand planning assistant. Your goal is to break down a user's natural language request into a structured list of individual tasks.

        For each distinct errand, you must identify:
        1.  `task_type`: A concise category for the errand (e.g., "grocery", "pharmacy", "bank", "hardware").
        2.  `search_query`: An optimized, specific search term for a places API like Foursquare or Google Maps. For example, if the user says "pick up my prescription", the query should be "pharmacy". If they say "get milk and eggs", it should be "grocery store".
        3.  `priority`: Assign a priority ('high', 'medium', 'low') based on the user's language. Default to 'medium'.
        
        Your final output MUST be a valid JSON list of objects, with no other text before or after it.

        Example Request: "I need to go grocery shopping for the week, pick up my blood pressure medication from CVS, and maybe grab a coffee if there's time."
        Example Output:
        [
            {
                "task_type": "grocery",
                "search_query": "grocery store",
                "priority": "high"
            },
            {
                "task_type": "pharmacy",
                "search_query": "CVS pharmacy",
                "priority": "high"
            },
            {
                "task_type": "coffee",
                "search_query": "coffee shop",
                "priority": "low"
            }
        ]
        """
        
        human_prompt = f"User request: \"{user_text}\"\nUser location (lat, lng): {user_location}\n\nGenerate the JSON output."
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_prompt)
        ]
        
        response = await self.llm.ainvoke(messages)
        
        try:
            tasks = json.loads(response.content)
            logger.info(f"📋 Decomposed tasks: {tasks}")
            logger.info(f"🏁 Number of tasks created: {len(tasks)}")
            return tasks if isinstance(tasks, list) else []
        except json.JSONDecodeError:
            logger.error("❌ Error: LLM did not return valid JSON. Using fallback.")
            return self._fallback_decomposition(user_text)

    def _fallback_decomposition(self, user_text: str) -> List[Dict[str, Any]]:
        keywords = ["grocery", "pharmacy", "bank", "gas", "coffee", "restaurant", "hardware", "post office"]
        tasks = []
        
        for keyword in keywords:
            if keyword.lower() in user_text.lower():
                tasks.append({
                    "task_type": keyword,
                    "search_query": keyword,
                    "priority": "medium"
                })
        
        if not tasks:
            tasks.append({ "task_type": "general", "search_query": user_text, "priority": "high" })
        
        return tasks