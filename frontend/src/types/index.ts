export interface User {
  id: number;
  email: string;
  name?: string;
  created_at?: string;
}

export interface Decision {
  id: number;
  user_id: number;
  title: string;
  description: string;
  status: 'intake' | 'diagnostic' | 'tradeoffs' | 'simulating' | 'complete';
  created_at: string;
  resolved_at?: string;
  context?: DecisionContext;
  scenarios?: Scenario[];
  tradeoffs?: Tradeoff[];
}

export interface DecisionContext {
  id: number;
  decision_id: number;
  values_profile: Record<string, any>;
  constraints: Record<string, any>;
  risk_tolerance: number;
  timeline: string;
  financial_situation: Record<string, any>;
}

export interface Scenario {
  id: number;
  decision_id: number;
  label: string;
  financial_score: number;
  career_score: number;
  lifestyle_score: number;
  risk_score: number;
  values_score: number;
  narrative: string;
  confidence_level: number;
  weighted_score?: number;
}

export interface Tradeoff {
  id: number;
  decision_id: number;
  description: string;
  category: string;
  surfaced_by: 'ai' | 'user';
  acknowledged: 'pending' | 'accepted' | 'rejected';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Perspective {
  persona: string;
  traits?: string;
  key_concern: string;
  recommendation: string;
  blind_spot: string;
  key_metric?: string;
}

export interface Uncertainty {
  knowns: string[];
  unknowns: string[];
  assumptions: string[];
  confidence_scores: Record<string, number>;
}

export interface Report {
  decision_summary: string;
  values_profile: Record<string, string>;
  tradeoffs: Tradeoff[];
  scenarios: Scenario[];
  perspectives: Perspective[];
  uncertainty: Uncertainty;
  reflection_questions: string[];
  next_research_step: string;
}