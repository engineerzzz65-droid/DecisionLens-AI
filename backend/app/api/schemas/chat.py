from pydantic import BaseModel
from typing import List, Optional

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
    questions: Optional[List[dict]] = None
    is_complete: bool = False