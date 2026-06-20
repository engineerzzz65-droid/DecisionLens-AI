from typing import Dict, Any
from app.agents.base_agent import BaseAgent
from langgraph.graph import StateGraph, END

class FinancialAnalystAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.build_graph()
    
    def build_graph(self):
        self.graph = StateGraph(dict)
        self.graph.add_node("analyze_financial_impact", self.analyze_financial_impact)
        self.graph.add_node("calculate_financial_scores", self.calculate_financial_scores)
        
        self.graph.set_entry_point("analyze_financial_impact")
        self.graph.add_edge("analyze_financial_impact", "calculate_financial_scores")
        self.graph.add_edge("calculate_financial_scores", END)
    
    def analyze_financial_impact(self, state: Dict) -> Dict:
        scenarios = state.get("simulated_scenarios", [])
        for scenario in scenarios:
            scenario["financial_analysis"] = {
                "potential_earnings": scenario.get("financial_score", 50),
                "break_even": 60,
                "risk": 100 - scenario.get("risk_score", 50)
            }
        state["scenarios_with_financials"] = scenarios
        return state
    
    def calculate_financial_scores(self, state: Dict) -> Dict:
        scenarios = state.get("scenarios_with_financials", [])
        for scenario in scenarios:
            financial_analysis = scenario.get("financial_analysis", {})
            score = (financial_analysis.get("potential_earnings", 50) * 0.5 + 
                    financial_analysis.get("break_even", 50) * 0.5)
            scenario["financial_score"] = round(score, 1)
        state["scenarios_with_scores"] = scenarios
        return state
