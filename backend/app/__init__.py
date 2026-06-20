"""
DecisionLens AI Backend Application

A comprehensive AI-powered decision support system that helps users
make better life decisions through structured analysis, multiple
perspectives, and clarity reports.
"""

from .config import settings
from .main import app

__version__ = "1.0.0"
__author__ = "DecisionLens AI Team"

__all__ = [
    'app',
    'settings',
    '__version__'
]