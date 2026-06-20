import json
import re
from typing import Dict, Any, List, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class Helpers:
    """Utility helper functions"""
    
    @staticmethod
    def sanitize_input(text: str) -> str:
        """Sanitize user input to prevent injection"""
        if not text:
            return ""
        # Remove potential HTML/script tags
        text = re.sub(r'<[^>]+>', '', text)
        # Remove control characters
        text = ''.join(char for char in text if ord(char) >= 32 or char == '\n')
        return text.strip()
    
    @staticmethod
    def parse_json_safely(text: str) -> Dict:
        """Parse JSON safely with error handling"""
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            logger.warning(f"Failed to parse JSON: {text[:100]}...")
            return {}
    
    @staticmethod
    def extract_json_from_markdown(text: str) -> Dict:
        """Extract JSON from markdown code blocks"""
        if not text:
            return {}
        
        # Look for JSON in markdown code blocks
        patterns = [
            r'```json\s*([\s\S]+?)\s*```',
            r'```\s*([\s\S]+?)\s*```',
            r'({[\s\S]+})',
            r'(\[[\s\S]+\])'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                try:
                    return json.loads(match.group(1).strip())
                except json.JSONDecodeError:
                    continue
        
        # Try to parse the whole text as JSON
        try:
            return json.loads(text.strip())
        except json.JSONDecodeError:
            return {}
    
    @staticmethod
    def format_timestamp(timestamp: Optional[datetime] = None) -> str:
        """Format timestamp for display"""
        if timestamp is None:
            timestamp = datetime.now()
        return timestamp.strftime("%Y-%m-%d %H:%M:%S")
    
    @staticmethod
    def truncate_text(text: str, max_length: int = 200, suffix: str = "...") -> str:
        """Truncate text to specified length"""
        if not text or len(text) <= max_length:
            return text
        return text[:max_length - len(suffix)] + suffix
    
    @staticmethod
    def generate_decision_summary(decision_text: str, max_words: int = 50) -> str:
        """Generate a concise summary of a decision"""
        words = decision_text.split()
        if len(words) <= max_words:
            return decision_text
        return ' '.join(words[:max_words]) + '...'
    
    @staticmethod
    def get_risk_level(score: float) -> str:
        """Get risk level based on score"""
        if score >= 70:
            return "Low"
        elif score >= 40:
            return "Medium"
        else:
            return "High"
    
    @staticmethod
    def get_confidence_emoji(score: float) -> str:
        """Get confidence emoji based on score"""
        if score >= 80:
            return "🟢"
        elif score >= 60:
            return "🟡"
        elif score >= 40:
            return "🟠"
        else:
            return "🔴"
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))
    
    @staticmethod
    def chunk_list(lst: List, chunk_size: int) -> List[List]:
        """Split a list into chunks"""
        for i in range(0, len(lst), chunk_size):
            yield lst[i:i + chunk_size]