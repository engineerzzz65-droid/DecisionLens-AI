import os
import shutil

# This script will update all schema files
print("Updating schema files...")

# Update decision.py
decision_schema = '''from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class DecisionCreate(BaseModel):
    user_id: int
    title: str
    description: str

class DecisionUpdate(BaseModel):
    status: Optional[str] = None
    resolved_at: Optional[datetime] = None

class DecisionContextSchema(BaseModel):
    values_profile: Dict[str, Any]
    constraints: Dict[str, Any]
    risk_tolerance: int
    timeline: str
    financial_situation: Dict[str, Any]

class DecisionResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: str
    status: str
    created_at: datetime
    resolved_at: Optional[datetime] = None
    context: Optional[DecisionContextSchema] = None
    
    class Config:
        from_attributes = True
'''

# Write the file
with open('app/api/schemas/decision.py', 'w') as f:
    f.write(decision_schema)

print("✅ Schema files updated!")