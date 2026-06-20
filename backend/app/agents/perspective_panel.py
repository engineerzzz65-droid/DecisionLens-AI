from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent
from langgraph.graph import StateGraph, END

class PerspectivePanelAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.build_graph()
    
    def build_graph(self):
        self.graph = StateGraph(dict)
        self.graph.add_node("gather_perspectives", self.gather_perspectives)
        self.graph.add_node("synthesize_views", self.synthesize_views)
        
        self.graph.set_entry_point("gather_perspectives")
        self.graph.add_edge("gather_perspectives", "synthesize_views")
        self.graph.add_edge("synthesize_views", END)
    
    def gather_perspectives(self, state: Dict) -> Dict:
        personas = [
            {"name": "Pragmatic Parent", "traits": "Cautious, value stability"},
            {"name": "Risk-Taking Entrepreneur", "traits": "Ambitious, growth-focused"},
            {"name": "Cautious Academic", "traits": "Analytical, research-oriented"},
            {"name": "Values-First Counselor", "traits": "Empathetic, value-focused"},
            {"name": "Data-Driven Analyst", "traits": "Objective, quantitative"}
        ]
        
        perspectives = []
        for persona in personas:
            perspectives.append({
                "persona": persona["name"],
                "traits": persona["traits"],
                "key_concern": f"Concern about {persona['name'].lower()} perspective",
                "recommendation": f"Recommendation from {persona['name']}",
                "blind_spot": f"Blind spot for {persona['name']}"
            })
        
        state["perspectives"] = perspectives
        return state
    
    def synthesize_views(self, state: Dict) -> Dict:
        perspectives = state.get("perspectives", [])
        state["synthesized_perspectives"] = {
            "common_concerns": [p.get("key_concern", "") for p in perspectives[:3]],
            "recommendation_theme": " | ".join([p.get("recommendation", "") for p in perspectives[:2]]),
            "advisor_count": len(perspectives)
        }
        return state
