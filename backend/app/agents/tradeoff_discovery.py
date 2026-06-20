from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent
from langgraph.graph import StateGraph, END
import json

class TradeoffDiscoveryAgent(BaseAgent):
    """Agent that identifies hidden tradeoffs and blind spots"""
    
    def __init__(self):
        super().__init__()
        self.build_graph()
    
    def build_graph(self):
        self.graph = StateGraph(dict)
        self.graph.add_node("identify_tradeoffs", self.identify_tradeoffs)
        self.graph.add_node("categorize_tradeoffs", self.categorize_tradeoffs)
        
        self.graph.set_entry_point("identify_tradeoffs")
        self.graph.add_edge("identify_tradeoffs", "categorize_tradeoffs")
        self.graph.add_edge("categorize_tradeoffs", END)
    
    def identify_tradeoffs(self, state: Dict) -> Dict:
        """Identify hidden tradeoffs in the decision"""
        tradeoffs = [
            {
                "description": "Opportunity cost of time spent vs. potential earnings",
                "category": "Opportunity Cost",
                "impact_level": "high",
                "why_blind_spot": "Immediate benefits often overshadow future costs"
            },
            {
                "description": "Geographic flexibility vs. building deep local roots",
                "category": "Geographic Flexibility",
                "impact_level": "medium",
                "why_blind_spot": "People often overlook location constraints"
            },
            {
                "description": "Delayed earnings vs. long-term career growth",
                "category": "Financial",
                "impact_level": "medium",
                "why_blind_spot": "Short-term financial impact is more visible"
            }
        ]
        
        state["identified_tradeoffs"] = tradeoffs
        
        return state
    
    def categorize_tradeoffs(self, state: Dict) -> Dict:
        """Categorize and prioritize tradeoffs"""
        tradeoffs = state.get("identified_tradeoffs", [])
        
        for tradeoff in tradeoffs:
            tradeoff.update({
                "surfaced_by": "ai",
                "acknowledged": "pending"
            })
        
        state["tradeoffs"] = tradeoffs
        
        return state
