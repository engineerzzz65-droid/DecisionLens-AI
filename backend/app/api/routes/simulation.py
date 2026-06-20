from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.database.session import get_db
from app.database import crud, models
from app.agents.scenario_simulation import ScenarioSimulationAgent
from app.agents.financial_analyst import FinancialAnalystAgent
from app.agents.perspective_panel import PerspectivePanelAgent
from app.agents.uncertainty_agent import UncertaintyAgent

router = APIRouter()

class SimulationRequest(BaseModel):
    decision_id: int
    options: Optional[List[str]] = None

class SimulationResponse(BaseModel):
    status: str
    scenarios: List[dict]
    perspectives: List[dict]
    uncertainty: dict

@router.post("/run", response_model=SimulationResponse)
def run_simulation(
    request: SimulationRequest,
    db: Session = Depends(get_db)
):
    """Run complete simulation for a decision"""
    # Get decision and context
    decision = crud.get_decision(db, request.decision_id)
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    
    context = decision.context
    if not context:
        raise HTTPException(status_code=400, detail="Decision context not found")
    
    # Build user profile
    user_profile = {
        "values": context.values_profile,
        "constraints": context.constraints,
        "risk_tolerance": context.risk_tolerance,
        "timeline": context.timeline,
        "financial_situation": context.financial_situation
    }
    
    # Initialize agents
    scenario_agent = ScenarioSimulationAgent()
    financial_agent = FinancialAnalystAgent()
    perspective_agent = PerspectivePanelAgent()
    uncertainty_agent = UncertaintyAgent()
    
    # Run scenario simulation
    state = {
        "decision_text": decision.description,
        "user_profile": user_profile,
        "options": request.options or []
    }
    
    # Generate scenarios
    state = scenario_agent.graph.invoke(state)
    
    # Add financial analysis
    state["financial_situation"] = context.financial_situation
    state = financial_agent.graph.invoke(state)
    
    # Add perspectives
    state["simulated_scenarios"] = state.get("scenarios_with_scores", [])
    state = perspective_agent.graph.invoke(state)
    
    # Add uncertainty map
    state = uncertainty_agent.graph.invoke(state)
    
    # Save scenarios to database
    scenarios_data = state.get("simulated_scenarios", [])
    if scenarios_data:
        crud.save_scenarios(db, request.decision_id, scenarios_data)
    
    # Update decision status
    crud.update_decision_status(
        db,
        request.decision_id,
        models.DecisionStatus.SIMULATING
    )
    
    return SimulationResponse(
        status="success",
        scenarios=scenarios_data,
        perspectives=state.get("perspectives", []),
        uncertainty=state.get("visual_uncertainty", {})
    )

@router.get("/{decision_id}/scenarios")
def get_scenarios(
    decision_id: int,
    db: Session = Depends(get_db)
):
    """Get saved scenarios for a decision"""
    decision = crud.get_decision(db, decision_id)
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    
    return {
        "status": "success",
        "scenarios": [
            {
                "label": s.label,
                "financial_score": s.financial_score,
                "career_score": s.career_score,
                "lifestyle_score": s.lifestyle_score,
                "risk_score": s.risk_score,
                "values_score": s.values_score,
                "narrative": s.narrative,
                "confidence_level": s.confidence_level
            }
            for s in decision.scenarios
        ]
    }