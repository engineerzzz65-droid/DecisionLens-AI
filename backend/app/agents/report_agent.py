from typing import Dict, Any
from app.agents.base_agent import BaseAgent
from langgraph.graph import StateGraph, END

class ReportAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.build_graph()
    
    def build_graph(self):
        self.graph = StateGraph(dict)
        self.graph.add_node("compile_data", self.compile_data)
        self.graph.add_node("generate_report", self.generate_report)
        
        self.graph.set_entry_point("compile_data")
        self.graph.add_edge("compile_data", "generate_report")
        self.graph.add_edge("generate_report", END)
    
    def compile_data(self, state: Dict) -> Dict:
        report_data = {
            "decision": state.get("decision_text", ""),
            "user_profile": state.get("user_profile", {}),
            "tradeoffs": state.get("tradeoffs", []),
            "scenarios": state.get("simulated_scenarios", []),
            "perspectives": state.get("perspectives", []),
            "uncertainty": state.get("visual_uncertainty", {})
        }
        state["report_data"] = report_data
        return state
    
    def generate_report(self, state: Dict) -> Dict:
        report_data = state.get("report_data", {})
        
        report = {
            "decision_summary": f"Analysis for: {report_data.get('decision', 'Your decision')}",
            "values_profile": {"Career Growth": "High", "Financial Security": "Medium"},
            "tradeoffs": report_data.get("tradeoffs", []),
            "scenarios": report_data.get("scenarios", []),
            "perspectives": report_data.get("perspectives", []),
            "uncertainty": report_data.get("uncertainty", {}),
            "reflection_questions": [
                "What would you choose if you had no constraints?",
                "What's the best-case scenario you can imagine?",
                "What's one small step you can take toward your decision this week?"
            ],
            "next_research_step": "Talk to people who have made similar decisions."
        }
        
        state["final_report"] = report
        return state
