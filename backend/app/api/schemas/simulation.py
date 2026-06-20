from pydantic import BaseModel
from typing import List, Optional, Dict

class ScenarioData(BaseModel):
    label: str
    financial_score: float
    career_score: float
    lifestyle_score: float
    risk_score: float
    values_score: float
    narrative: str
    confidence_level: float
    weighted_score: Optional[float] = None

class SimulationRequest(BaseModel):
    decision_id: int
    options: Optional[List[str]] = None

class SimulationResponse(BaseModel):
    status: str
    scenarios: List[Dict]
    perspectives: List[Dict]
    uncertainty: Dict