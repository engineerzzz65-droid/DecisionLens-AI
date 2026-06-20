from typing import Dict, List, Optional
import math

class ScoringService:
    """Service for calculating and weighting scores"""
    
    @staticmethod
    def calculate_weighted_score(
        scores: Dict[str, float],
        weights: Dict[str, float]
    ) -> float:
        """Calculate weighted score based on provided weights"""
        total_weight = sum(weights.values())
        if total_weight == 0:
            return 0
        
        weighted_sum = sum(
            scores.get(key, 0) * weights.get(key, 0)
            for key in scores.keys()
        )
        
        return round(weighted_sum / total_weight, 2)
    
    @staticmethod
    def normalize_scores(
        scores: Dict[str, float],
        min_val: float = 0,
        max_val: float = 100
    ) -> Dict[str, float]:
        """Normalize scores to a specific range"""
        if not scores:
            return {}
        
        values = list(scores.values())
        if not values:
            return {}
        
        current_min = min(values)
        current_max = max(values)
        range_val = current_max - current_min
        
        if range_val == 0:
            return {k: 50 for k in scores.keys()}
        
        normalized = {}
        for key, value in scores.items():
            normalized[key] = ((value - current_min) / range_val) * (max_val - min_val) + min_val
        
        return normalized
    
    @staticmethod
    def calculate_confidence_score(
        data_points: int,
        variance: float,
        sample_size: Optional[int] = None
    ) -> float:
        """Calculate confidence score based on data quality"""
        if data_points == 0:
            return 0
        
        # Base confidence on number of data points
        base_score = min(100, data_points * 10)
        
        # Reduce confidence if variance is high
        variance_penalty = min(30, variance * 2)
        
        confidence = base_score - variance_penalty
        
        return max(0, min(100, confidence))
    
    @staticmethod
    def rank_scenarios(
        scenarios: List[Dict],
        weights: Dict[str, float]
    ) -> List[Dict]:
        """Rank scenarios based on weighted scores"""
        scored_scenarios = []
        
        for scenario in scenarios:
            scores = {
                'financial': scenario.get('financial_score', 0),
                'career': scenario.get('career_score', 0),
                'lifestyle': scenario.get('lifestyle_score', 0),
                'risk': 100 - scenario.get('risk_score', 0),  # Invert risk
                'values': scenario.get('values_score', 0)
            }
            
            weighted_score = ScoringService.calculate_weighted_score(scores, weights)
            
            scenario_copy = scenario.copy()
            scenario_copy['weighted_score'] = weighted_score
            scored_scenarios.append(scenario_copy)
        
        # Sort by weighted score descending
        scored_scenarios.sort(key=lambda x: x.get('weighted_score', 0), reverse=True)
        
        return scored_scenarios
    
    @staticmethod
    def calculate_risk_adjusted_score(
        expected_return: float,
        risk: float,
        risk_free_rate: float = 2.0
    ) -> float:
        """Calculate risk-adjusted score (Sharpe-like ratio)"""
        if risk == 0:
            return expected_return
        
        risk_adjusted = (expected_return - risk_free_rate) / risk
        # Scale to 0-100
        return max(0, min(100, 50 + risk_adjusted * 10))