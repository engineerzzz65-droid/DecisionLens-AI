"""
API Routes Module

This package contains all route handlers organized by domain.
"""

from . import decisions, chat, simulation, report

__all__ = [
    'decisions',
    'chat',
    'simulation',
    'report'
]