from sqlalchemy import Column, Integer, String, DateTime, JSON, Float, Text, Enum, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.session import Base
import enum

class DecisionStatus(str, enum.Enum):
    INTAKE = "intake"
    DIAGNOSTIC = "diagnostic"
    TRADEOFFS = "tradeoffs"
    SIMULATING = "simulating"
    COMPLETE = "complete"

class AuthProvider(str, enum.Enum):
    MOCK = "mock"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    auth_provider = Column(Enum(AuthProvider), default=AuthProvider.MOCK)
    
    decisions = relationship("Decision", back_populates="user")

class Decision(Base):
    __tablename__ = "decisions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(Enum(DecisionStatus), default=DecisionStatus.INTAKE)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    
    user = relationship("User", back_populates="decisions")
    context = relationship("DecisionContext", back_populates="decision", uselist=False)
    scenarios = relationship("Scenario", back_populates="decision")
    tradeoffs = relationship("Tradeoff", back_populates="decision")
    session = relationship("Session", back_populates="decision", uselist=False)

class DecisionContext(Base):
    __tablename__ = "decision_context"
    
    id = Column(Integer, primary_key=True, index=True)
    decision_id = Column(Integer, ForeignKey("decisions.id"), unique=True, nullable=False)
    values_profile = Column(JSON, nullable=False)  # {core_values, priorities}
    constraints = Column(JSON, nullable=False)  # {time, money, location, etc}
    risk_tolerance = Column(Integer, nullable=False)  # 1-10
    timeline = Column(String(100), nullable=False)
    financial_situation = Column(JSON, nullable=False)
    
    decision = relationship("Decision", back_populates="context")

class Scenario(Base):
    __tablename__ = "scenarios"
    
    id = Column(Integer, primary_key=True, index=True)
    decision_id = Column(Integer, ForeignKey("decisions.id"), nullable=False)
    label = Column(String(100), nullable=False)  # "Masters", "Job", "Startup"
    financial_score = Column(Float, nullable=False)  # 0-100
    career_score = Column(Float, nullable=False)  # 0-100
    lifestyle_score = Column(Float, nullable=False)  # 0-100
    risk_score = Column(Float, nullable=False)  # 0-100
    values_score = Column(Float, nullable=False)  # 0-100
    narrative = Column(Text, nullable=False)
    confidence_level = Column(Float, nullable=False)  # 0-100
    
    decision = relationship("Decision", back_populates="scenarios")

class Tradeoff(Base):
    __tablename__ = "tradeoffs"
    
    id = Column(Integer, primary_key=True, index=True)
    decision_id = Column(Integer, ForeignKey("decisions.id"), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)  # "opportunity_cost", "geographic", "financial"
    surfaced_by = Column(String(50), nullable=False)  # "ai", "user"
    acknowledged = Column(String(50), nullable=False)  # "accepted", "rejected", "pending"
    
    decision = relationship("Decision", back_populates="tradeoffs")

class Session(Base):
    __tablename__ = "sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    decision_id = Column(Integer, ForeignKey("decisions.id"), unique=True, nullable=False)
    messages = Column(JSON, nullable=False, default=list)  # [{role, content, timestamp}]
    phase = Column(String(50), nullable=False, default="intake")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    decision = relationship("Decision", back_populates="session")