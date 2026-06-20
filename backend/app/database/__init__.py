"""
Database Layer for DecisionLens AI

This package contains all database models, session management,
and CRUD operations.
"""

from .session import engine, SessionLocal, get_db, Base
from .models import (
    User,
    Decision,
    DecisionContext,
    Scenario,
    Tradeoff,
    Session,
    DecisionStatus,
    AuthProvider
)
from .crud import (
    create_user,
    get_user,
    create_decision,
    get_decision,
    update_decision_status,
    save_context,
    save_scenarios,
    save_tradeoffs,
    update_session_messages
)

__all__ = [
    # Session
    'engine',
    'SessionLocal',
    'get_db',
    'Base',
    # Models
    'User',
    'Decision',
    'DecisionContext',
    'Scenario',
    'Tradeoff',
    'Session',
    'DecisionStatus',
    'AuthProvider',
    # CRUD
    'create_user',
    'get_user',
    'create_decision',
    'get_decision',
    'update_decision_status',
    'save_context',
    'save_scenarios',
    'save_tradeoffs',
    'update_session_messages'
]