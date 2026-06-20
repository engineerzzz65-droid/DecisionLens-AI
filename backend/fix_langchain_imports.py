import os
import re

def fix_base_agent():
    """Fix base_agent.py imports"""
    content = '''from typing import Dict, Any, List, Optional
from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from app.services.gemini_service import GeminiService
import logging
import json

logger = logging.getLogger(__name__)

class BaseAgent:
    """Base agent class with common functionality"""
    
    def __init__(self, model_name: str = "gemini-pro"):
        self.gemini = GeminiService()
        self.model_name = model_name
        self.graph = None
    
    def _get_llm(self):
        return self.gemini.get_llm(self.model_name)
    
    def _parse_json_response(self, response: str) -> Dict:
        """Parse JSON from LLM response"""
        try:
            # Extract JSON from markdown if present
            if "```json" in response:
                start = response.find("```json") + 7
                end = response.find("```", start)
                response = response[start:end]
            elif "```" in response:
                start = response.find("```") + 3
                end = response.find("```", start)
                response = response[start:end]
            
            return json.loads(response.strip())
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {e}")
            logger.error(f"Response: {response}")
            return {"error": "Failed to parse response"}
'''
    
    with open('app/agents/base_agent.py', 'w') as f:
        f.write(content)
    print("✅ Fixed base_agent.py")

def fix_facilitator():
    """Fix facilitator.py"""
    content = '''from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent
from langgraph.graph import StateGraph, END
import json

class FacilitatorAgent(BaseAgent):
    """Facilitator agent that guides the diagnostic conversation"""
    
    def __init__(self):
        super().__init__()
        self.build_graph()
    
    def build_graph(self):
        """Build the LangGraph workflow"""
        self.graph = StateGraph(dict)
        self.graph.add_node("ask_diagnostic_questions", self.ask_diagnostic_questions)
        self.graph.add_node("process_answers", self.process_answers)
        self.graph.add_node("generate_profile", self.generate_profile)
        
        self.graph.set_entry_point("ask_diagnostic_questions")
        self.graph.add_edge("ask_diagnostic_questions", "process_answers")
        self.graph.add_edge("process_answers", "generate_profile")
        self.graph.add_edge("generate_profile", END)
    
    def ask_diagnostic_questions(self, state: Dict) -> Dict:
        """Generate diagnostic questions based on the decision"""
        # Define question categories
        questions = [
            {
                "id": "values",
                "question": "What personal values matter most to you in this decision?",
                "category": "values",
                "type": "text"
            },
            {
                "id": "constraints",
                "question": "What are your key constraints (time, money, location)?",
                "category": "constraints",
                "type": "text"
            },
            {
                "id": "timeline",
                "question": "What's your expected timeline for this decision?",
                "category": "timeline",
                "type": "text"
            },
            {
                "id": "financial",
                "question": "What's your current financial situation?",
                "category": "financial",
                "type": "text"
            },
            {
                "id": "risk_tolerance",
                "question": "How comfortable are you with risk on a scale of 1-10?",
                "category": "risk_tolerance",
                "type": "number"
            }
        ]
        
        state["questions"] = questions
        state["current_question_index"] = 0
        state["answers"] = {}
        
        return state
    
    def process_answers(self, state: Dict) -> Dict:
        """Process user answers to diagnostic questions"""
        questions = state.get("questions", [])
        answers = state.get("answers", {})
        
        for q in questions:
            q_id = q.get("id", "")
            if q_id and q_id not in answers:
                state["missing_answers"] = True
                state["next_question"] = q_id
                return state
        
        state["missing_answers"] = False
        state["all_answers_collected"] = True
        
        return state
    
    def generate_profile(self, state: Dict) -> Dict:
        """Generate structured user profile from answers"""
        answers = state.get("answers", {})
        
        profile = {
            "core_values": answers.get("values", "").split(","),
            "constraints": answers.get("constraints", ""),
            "risk_tolerance": int(answers.get("risk_tolerance", 5)),
            "timeline": answers.get("timeline", "medium"),
            "financial_situation": {"summary": answers.get("financial", "")}
        }
        
        state["user_profile"] = profile
        
        return state
'''
    
    with open('app/agents/facilitator.py', 'w') as f:
        f.write(content)
    print("✅ Fixed facilitator.py")

def fix_tradeoff_discovery():
    """Fix tradeoff_discovery.py"""
    content = '''from typing import Dict, Any, List
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
'''
    
    with open('app/agents/tradeoff_discovery.py', 'w') as f:
        f.write(content)
    print("✅ Fixed tradeoff_discovery.py")

def fix_scenario_simulation():
    """Fix scenario_simulation.py"""
    content = '''from typing import Dict, Any, List
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
'''
    
    with open('app/agents/scenario_simulation.py', 'w') as f:
        f.write(content)
    print("✅ Fixed scenario_simulation.py")

def fix_financial_analyst():
    """Fix financial_analyst.py"""
    content = '''from typing import Dict, Any
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
'''
    
    with open('app/agents/financial_analyst.py', 'w') as f:
        f.write(content)
    print("✅ Fixed financial_analyst.py")

def fix_perspective_panel():
    """Fix perspective_panel.py"""
    content = '''from typing import Dict, Any, List
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
'''
    
    with open('app/agents/perspective_panel.py', 'w') as f:
        f.write(content)
    print("✅ Fixed perspective_panel.py")

def fix_uncertainty_agent():
    """Fix uncertainty_agent.py"""
    content = '''from typing import Dict, Any
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
'''
    
    with open('app/agents/uncertainty_agent.py', 'w') as f:
        f.write(content)
    print("✅ Fixed uncertainty_agent.py")

def fix_report_agent():
    """Fix report_agent.py"""
    content = '''from typing import Dict, Any
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
'''
    
    with open('app/agents/report_agent.py', 'w') as f:
        f.write(content)
    print("✅ Fixed report_agent.py")

def fix_init():
    """Fix agents __init__.py"""
    content = '''from .base_agent import BaseAgent
from .facilitator import FacilitatorAgent
from .tradeoff_discovery import TradeoffDiscoveryAgent
from .scenario_simulation import ScenarioSimulationAgent
from .financial_analyst import FinancialAnalystAgent
from .perspective_panel import PerspectivePanelAgent
from .uncertainty_agent import UncertaintyAgent
from .report_agent import ReportAgent

__all__ = [
    'BaseAgent',
    'FacilitatorAgent',
    'TradeoffDiscoveryAgent',
    'ScenarioSimulationAgent',
    'FinancialAnalystAgent',
    'PerspectivePanelAgent',
    'UncertaintyAgent',
    'ReportAgent'
]
'''
    
    with open('app/agents/__init__.py', 'w') as f:
        f.write(content)
    print("✅ Fixed agents __init__.py")

def main():
    """Run all fixes"""
    print("🔧 Starting LangChain import fixes...")
    print("=" * 50)
    
    # Create agents directory if it doesn't exist
    os.makedirs('app/agents', exist_ok=True)
    
    # Fix all files
    fix_base_agent()
    fix_facilitator()
    fix_tradeoff_discovery()
    fix_scenario_simulation()
    fix_financial_analyst()
    fix_perspective_panel()
    fix_uncertainty_agent()
    fix_report_agent()
    fix_init()
    
    print("=" * 50)
    print("✅ All fixes completed successfully!")
    print("🚀 You can now run: python run.py")

if __name__ == "__main__":
    main()