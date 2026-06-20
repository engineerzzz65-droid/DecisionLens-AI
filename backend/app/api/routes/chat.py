from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from app.database.session import get_db
from app.database import crud
from app.agents.facilitator import FacilitatorAgent
from app.agents.tradeoff_discovery import TradeoffDiscoveryAgent
from app.agents.scenario_simulation import ScenarioSimulationAgent
from app.agents.financial_analyst import FinancialAnalystAgent
from app.agents.perspective_panel import PerspectivePanelAgent
from app.agents.uncertainty_agent import UncertaintyAgent
from app.agents.report_agent import ReportAgent
from app.services.gemini_service import GeminiService

router = APIRouter()

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: Optional[str] = None

class ChatRequest(BaseModel):
    decision_id: int
    message: str
    session_id: Optional[int] = None

class ChatResponse(BaseModel):
    response: str
    phase: str
    messages: List[dict]

@router.post("/diagnostic")
def run_diagnostic(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    """Run diagnostic phase"""
    facilitator = FacilitatorAgent()
    
    # Get decision
    decision = crud.get_decision(db, request.decision_id)
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    
    # Process message through agent
    state = {
        "decision_text": decision.description,
        "user_message": request.message
    }
    
    result = facilitator.graph.invoke(state)
    
    # Update session
    messages = result.get("messages", [])
    if request.message:
        messages.append({
            "role": "user",
            "content": request.message,
            "timestamp": datetime.now().isoformat()
        })
    
    # Save session
    crud.update_session_messages(
        db,
        decision_id=request.decision_id,
        messages=messages,
        phase="diagnostic"
    )
    
    # Update decision status
    crud.update_decision_status(
        db,
        request.decision_id,
        models.DecisionStatus.DIAGNOSTIC
    )
    
    return ChatResponse(
        response=result.get("next_question", "Thank you for your response."),
        phase="diagnostic",
        messages=messages
    )

@router.post("/tradeoffs")
def discover_tradeoffs(
    decision_id: int,
    db: Session = Depends(get_db)
):
    """Discover tradeoffs"""
    tradeoff_agent = TradeoffDiscoveryAgent()
    
    # Get decision and context
    decision = crud.get_decision(db, decision_id)
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    
    # Get user profile from context or build it
    context = decision.context
    user_profile = {
        "values": context.values_profile if context else {},
        "constraints": context.constraints if context else {},
        "risk_tolerance": context.risk_tolerance if context else 5
    }
    
    # Process through agent
    state = {
        "decision_text": decision.description,
        "user_profile": user_profile
    }
    
    result = tradeoff_agent.graph.invoke(state)
    tradeoffs = result.get("tradeoffs", [])
    
    # Save tradeoffs
    if tradeoffs:
        crud.save_tradeoffs(db, decision_id, tradeoffs)
    
    # Update decision status
    crud.update_decision_status(
        db,
        decision_id,
        models.DecisionStatus.TRADEOFFS
    )
    
    return {
        "status": "success",
        "tradeoffs": tradeoffs
    }

@router.post("/simulate")
def run_simulation(
    decision_id: int,
    db: Session = Depends(get_db)
):
    """Run scenario simulation"""
    scenario_agent = ScenarioSimulationAgent()
    financial_agent = FinancialAnalystAgent()
    perspective_agent = PerspectivePanelAgent()
    uncertainty_agent = UncertaintyAgent()
    
    # Get decision and context
    decision = crud.get_decision(db, decision_id)
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    
    context = decision.context
    user_profile = {
        "values": context.values_profile if context else {},
        "constraints": context.constraints if context else {},
        "risk_tolerance": context.risk_tolerance if context else 5
    }
    
    # Run scenario simulation
    state = {
        "decision_text": decision.description,
        "user_profile": user_profile
    }
    
    # Generate scenarios
    state = scenario_agent.graph.invoke(state)
    
    # Add financial analysis
    state["financial_situation"] = context.financial_situation if context else {}
    state = financial_agent.graph.invoke(state)
    
    # Add perspectives
    state["simulated_scenarios"] = state.get("scenarios_with_scores", [])
    state = perspective_agent.graph.invoke(state)
    
    # Add uncertainty map
    state = uncertainty_agent.graph.invoke(state)
    
    # Save scenarios
    scenarios_data = state.get("simulated_scenarios", [])
    if scenarios_data:
        crud.save_scenarios(db, decision_id, scenarios_data)
    
    # Update decision status
    crud.update_decision_status(
        db,
        decision_id,
        models.DecisionStatus.SIMULATING
    )
    
    return {
        "status": "success",
        "scenarios": scenarios_data,
        "perspectives": state.get("perspectives", []),
        "uncertainty": state.get("visual_uncertainty", {})
    }