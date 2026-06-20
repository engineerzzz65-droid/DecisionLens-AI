from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from app.database.session import get_db
from app.database import crud, models
from app.api.schemas.decision import DecisionCreate, DecisionResponse, DecisionUpdate

router = APIRouter()

class DecisionCreateRequest(BaseModel):
    user_id: int
    title: str
    description: str

class DecisionUpdateRequest(BaseModel):
    status: Optional[str] = None
    resolved_at: Optional[datetime] = None

@router.post("/", response_model=DecisionResponse)
def create_decision(
    request: DecisionCreateRequest,
    db: Session = Depends(get_db)
):
    """Create a new decision"""
    # Check if user exists
    user = crud.get_user(db, request.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    decision = crud.create_decision(
        db,
        user_id=request.user_id,
        title=request.title,
        description=request.description
    )
    
    return decision

@router.get("/{decision_id}", response_model=DecisionResponse)
def get_decision(
    decision_id: int,
    db: Session = Depends(get_db)
):
    """Get decision by ID"""
    decision = crud.get_decision(db, decision_id)
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    return decision

@router.get("/user/{user_id}", response_model=List[DecisionResponse])
def get_user_decisions(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Get all decisions for a user"""
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user.decisions

@router.patch("/{decision_id}", response_model=DecisionResponse)
def update_decision(
    decision_id: int,
    request: DecisionUpdateRequest,
    db: Session = Depends(get_db)
):
    """Update decision status"""
    decision = crud.get_decision(db, decision_id)
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    
    if request.status:
        status_map = {
            "intake": models.DecisionStatus.INTAKE,
            "diagnostic": models.DecisionStatus.DIAGNOSTIC,
            "tradeoffs": models.DecisionStatus.TRADEOFFS,
            "simulating": models.DecisionStatus.SIMULATING,
            "complete": models.DecisionStatus.COMPLETE
        }
        decision.status = status_map.get(request.status, decision.status)
    
    if request.resolved_at:
        decision.resolved_at = request.resolved_at
    
    db.commit()
    db.refresh(decision)
    
    return decision

@router.post("/{decision_id}/context")
def save_context(
    decision_id: int,
    context_data: dict,
    db: Session = Depends(get_db)
):
    """Save decision context"""
    decision = crud.get_decision(db, decision_id)
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    
    context = crud.save_context(
        db,
        decision_id=decision_id,
        values_profile=context_data.get("values_profile", {}),
        constraints=context_data.get("constraints", {}),
        risk_tolerance=context_data.get("risk_tolerance", 5),
        timeline=context_data.get("timeline", "medium"),
        financial_situation=context_data.get("financial_situation", {})
    )
    
    return {"status": "success", "context_id": context.id}