from typing import Dict, Any, List, Optional
from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from app.services.gemini_service import GeminiService
import logging
import json

logger = logging.getLogger(__name__)

class BaseAgent:
    """Base agent class with common functionality"""
    
    def __init__(self, model_name: str = "gemini-pro"):
        self.gemini = GeminiService()
        self.model_name = model_name
        self.graph = None
    
    def _get_llm(self):
        return self.gemini.get_llm(self.model_name)
    
    def _parse_json_response(self, response: str) -> Dict:
        """Parse JSON from LLM response"""
        try:
            # Extract JSON from markdown if present
            if "```json" in response:
                start = response.find("```json") + 7
                end = response.find("```", start)
                response = response[start:end]
            elif "```" in response:
                start = response.find("```") + 3
                end = response.find("```", start)
                response = response[start:end]
            
            return json.loads(response.strip())
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {e}")
            logger.error(f"Response: {response}")
            return {"error": "Failed to parse response"}
