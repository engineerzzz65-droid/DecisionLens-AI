import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class GeminiService:
    """Service for interacting with Gemini API"""
    
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro')
        self.langchain_llm = None
    
    def get_llm(self, model_name: str = "gemini-pro"):
        """Get LangChain LLM instance"""
        if not self.langchain_llm:
            self.langchain_llm = ChatGoogleGenerativeAI(
                model=model_name,
                google_api_key=settings.GEMINI_API_KEY,
                temperature=0.7,
                convert_system_message_to_human=True
            )
        return self.langchain_llm
    
    def generate_content(self, prompt: str) -> str:
        """Generate content using Gemini"""
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            return f"Error generating content: {str(e)}"
    
    def generate_structured_response(self, prompt: str, schema: dict) -> dict:
        """Generate structured response with specific schema"""
        # For simplicity, we'll use normal generation and parse
        response = self.generate_content(prompt)
        
        # Try to parse as JSON
        import json
        try:
            # Extract JSON from response
            if "```json" in response:
                start = response.find("```json") + 7
                end = response.find("```", start)
                response = response[start:end]
            elif "```" in response:
                start = response.find("```") + 3
                end = response.find("```", start)
                response = response[start:end]
            
            return json.loads(response.strip())
        except:
            return {"error": "Failed to parse structured response", "raw": response}
        