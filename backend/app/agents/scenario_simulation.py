from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent
from langgraph.graph import StateGraph, END
import json

class ScenarioSimulationAgent(BaseAgent):
    """Agent that simulates different scenarios"""
    
    def __init__(self):
        super().__init__()
        self.build_graph()
    
    def build_graph(self):
        self.graph = StateGraph(dict)
        self.graph.add_node("generate_scenarios", self.generate_scenarios)
        self.graph.add_node("simulate_outcomes", self.simulate_outcomes)
        
        self.graph.set_entry_point("generate_scenarios")
        self.graph.add_edge("generate_scenarios", "simulate_outcomes")
        self.graph.add_edge("simulate_outcomes", END)
    
    def generate_scenarios(self, state: Dict) -> Dict:
        """Generate scenarios based on user decision"""
        decision_text = state.get("decision_text", "")
        options = state.get("options", [])
        
        if not options:
            options = [opt.strip() for opt in decision_text.split(" or ")]
            if len(options) < 2:
                options = ["Option A", "Option B", "Option C"]
        
        scenarios = []
        for i, option in enumerate(options[:3]):
            base_score = 70 - (i * 15)
            scenarios.append({
                "name": option,
                "best_case": {
                    "financial": base_score + 20,
                    "career": base_score + 15,
                    "lifestyle": base_score + 10,
                    "risk": 30,
                    "values": base_score + 25
                },
                "expected_case": {
                    "financial": base_score,
                    "career": base_score - 5,
                    "lifestyle": base_score - 10,
                    "risk": 50,
                    "values": base_score
                },
                "worst_case": {
                    "financial": base_score - 30,
                    "career": base_score - 25,
                    "lifestyle": base_score - 20,
                    "risk": 80,
                    "values": base_score - 15
                }
            })
        
        state["scenarios"] = scenarios
        state["original_options"] = options
        
        return state
    
    def simulate_outcomes(self, state: Dict) -> Dict:
        """Simulate quantitative outcomes for each scenario"""
        scenarios = state.get("scenarios", [])
        
        for scenario in scenarios:
            best = scenario.get("best_case", {})
            expected = scenario.get("expected_case", {})
            worst = scenario.get("worst_case", {})
            
            financial = (best.get("financial", 70) + expected.get("financial", 50) + worst.get("financial", 30)) / 3
            career = (best.get("career", 70) + expected.get("career", 50) + worst.get("career", 30)) / 3
            lifestyle = (best.get("lifestyle", 70) + expected.get("lifestyle", 50) + worst.get("lifestyle", 30)) / 3
            risk = 100 - (worst.get("risk", 50) + expected.get("risk", 30)) / 2
            values = (best.get("values", 70) + expected.get("values", 50) + worst.get("values", 30)) / 3
            
            scenario.update({
                "financial_score": round(financial, 1),
                "career_score": round(career, 1),
                "lifestyle_score": round(lifestyle, 1),
                "risk_score": round(risk, 1),
                "values_score": round(values, 1),
                "confidence_level": 70.0,
                "narrative": f"In the {scenario.get('name', 'Scenario')} scenario, the outcome would involve a balance of {round(financial, 1)}% financial potential and {round(career, 1)}% career growth."
            })
        
        state["simulated_scenarios"] = scenarios
        
        return state
