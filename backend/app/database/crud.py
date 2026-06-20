from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import models
from datetime import datetime

def create_user(db: Session, email: str) -> models.User:
    user = models.User(email=email)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user(db: Session, user_id: int) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_decision(
    db: Session,
    user_id: int,
    title: str,
    description: str
) -> models.Decision:
    decision = models.Decision(
        user_id=user_id,
        title=title,
        description=description,
        status=models.DecisionStatus.INTAKE
    )
    db.add(decision)
    db.commit()
    db.refresh(decision)
    return decision

def get_decision(db: Session, decision_id: int) -> Optional[models.Decision]:
    return db.query(models.Decision).filter(models.Decision.id == decision_id).first()

def update_decision_status(
    db: Session,
    decision_id: int,
    status: models.DecisionStatus
) -> Optional[models.Decision]:
    decision = get_decision(db, decision_id)
    if decision:
        decision.status = status
        if status == models.DecisionStatus.COMPLETE:
            decision.resolved_at = datetime.now()
        db.commit()
        db.refresh(decision)
    return decision

def save_context(
    db: Session,
    decision_id: int,
    values_profile: dict,
    constraints: dict,
    risk_tolerance: int,
    timeline: str,
    financial_situation: dict
) -> models.DecisionContext:
    context = models.DecisionContext(
        decision_id=decision_id,
        values_profile=values_profile,
        constraints=constraints,
        risk_tolerance=risk_tolerance,
        timeline=timeline,
        financial_situation=financial_situation
    )
    db.add(context)
    db.commit()
    db.refresh(context)
    return context

def save_scenarios(db: Session, decision_id: int, scenarios_data: List[dict]) -> List[models.Scenario]:
    scenarios = []
    for data in scenarios_data:
        scenario = models.Scenario(
            decision_id=decision_id,
            **data
        )
        db.add(scenario)
        scenarios.append(scenario)
    db.commit()
    for scenario in scenarios:
        db.refresh(scenario)
    return scenarios

def save_tradeoffs(db: Session, decision_id: int, tradeoffs_data: List[dict]) -> List[models.Tradeoff]:
    tradeoffs = []
    for data in tradeoffs_data:
        tradeoff = models.Tradeoff(
            decision_id=decision_id,
            **data
        )
        db.add(tradeoff)
        tradeoffs.append(tradeoff)
    db.commit()
    for tradeoff in tradeoffs:
        db.refresh(tradeoff)
    return tradeoffs

def update_session_messages(
    db: Session,
    decision_id: int,
    messages: List[dict],
    phase: str
) -> Optional[models.Session]:
    session = db.query(models.Session).filter(
        models.Session.decision_id == decision_id
    ).first()
    
    if not session:
        session = models.Session(
            decision_id=decision_id,
            messages=messages,
            phase=phase
        )
        db.add(session)
    else:
        session.messages = messages
        session.phase = phase
        session.updated_at = datetime.now()
    
    db.commit()
    db.refresh(session)
    return session