from typing import Dict, List, Any, Optional
from typing_extensions import TypedDict


class GraphState(TypedDict, total=False):
    # User input and location
    user_input: Optional[str]
    user_text: Optional[str]  # Keep both for compatibility
    text: Optional[str]       # Alternative naming
    lat: Optional[float]
    lng: Optional[float]
    latitude: Optional[float]  # Alternative naming
    longitude: Optional[float] # Alternative naming
    
    # Processing state
    current_step: Optional[str]
    preferences: Optional[Dict[str, Any]]
    
    # Results from different steps
    tasks: Optional[List[Dict[str, Any]]]
    places: Optional[List[Dict[str, Any]]]
    validated_places: Optional[List[Dict[str, Any]]]
    optimized_route: Optional[List[Dict[str, Any]]]
    final_plan: Optional[Dict[str, Any]]
    
    # Error handling
    error: Optional[str]