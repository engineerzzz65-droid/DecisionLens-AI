from typing import Dict, Any
from app.agents.base_agent import BaseAgent
from langgraph.graph import StateGraph, END

class UncertaintyAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.build_graph()
    
    def build_graph(self):
        self.graph = StateGraph(dict)
        self.graph.add_node("identify_uncertainties", self.identify_uncertainties)
        self.graph.add_node("generate_uncertainty_map", self.generate_uncertainty_map)
        
        self.graph.set_entry_point("identify_uncertainties")
        self.graph.add_edge("identify_uncertainties", "generate_uncertainty_map")
        self.graph.add_edge("generate_uncertainty_map", END)
    
    def identify_uncertainties(self, state: Dict) -> Dict:
        uncertainty_map = {
            "knowns": ["Tuition costs", "Salary ranges", "Time commitment"],
            "unknowns": ["Market conditions in 5 years", "Networking opportunities", "Personal preferences"],
            "assumptions": ["Economy remains stable", "Personal interests don't change", "Health remains good"],
            "confidence_levels": {"financial_outcome": 65, "career_impact": 55}
        }
        
        state["uncertainty_map"] = uncertainty_map
        return state
    
    def generate_uncertainty_map(self, state: Dict) -> Dict:
        uncertainty_map = state.get("uncertainty_map", {})
        state["visual_uncertainty"] = {
            "knowns": uncertainty_map.get("knowns", []),
            "unknowns": uncertainty_map.get("unknowns", []),
            "assumptions": uncertainty_map.get("assumptions", []),
            "confidence_scores": uncertainty_map.get("confidence_levels", {})
        }
        return state
