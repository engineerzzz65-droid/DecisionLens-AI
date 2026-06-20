from typing import Dict, Any, List
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
