import logging
from typing import List, Tuple
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
import numpy as np
from geopy.distance import geodesic

logger = logging.getLogger(__name__)

class RoutingService:
    def __init__(self):
        logger.info("🛠️ RoutingService initialized.")

    def calculate_distance_matrix(self, locations: List[Tuple[float, float]]) -> np.ndarray:
        num_locations = len(locations)
        logger.info(f"📐 Calculating distance matrix for {num_locations} locations.")
        distance_matrix = np.zeros((num_locations, num_locations), dtype=int)
        for i in range(num_locations):
            for j in range(num_locations):
                if i != j:
                    dist = geodesic(locations[i], locations[j]).meters
                    distance_matrix[i][j] = int(dist)
        return distance_matrix

    def solve_tsp(self, locations: List[Tuple[float, float]], start_index: int = 0) -> List[int]:
        if not locations or len(locations) <= 1:
            return list(range(len(locations)))
            
        logger.info(f"🔧 Solving TSP for {len(locations)} locations.")
        distance_matrix = self.calculate_distance_matrix(locations)
        
        manager = pywrapcp.RoutingIndexManager(len(locations), 1, start_index)
        routing = pywrapcp.RoutingModel(manager)
        
        def distance_callback(from_index, to_index):
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            return distance_matrix[from_node][to_node]
        
        transit_callback_index = routing.RegisterTransitCallback(distance_callback)
        routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)
        
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
        )
        search_parameters.local_search_metaheuristic = (
            routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
        )
        search_parameters.time_limit.FromSeconds(2)
        
        solution = routing.SolveWithParameters(search_parameters)
        
        if solution:
            route = []
            index = routing.Start(0)
            while not routing.IsEnd(index):
                route.append(manager.IndexToNode(index))
                index = solution.Value(routing.NextVar(index))
            logger.info(f"✅ TSP solution found: {route}")
            return route
        
        logger.warning("⚠️ No TSP solution found. Returning original order.")
        return list(range(len(locations)))