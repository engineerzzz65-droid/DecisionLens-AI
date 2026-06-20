import React, { useState, useEffect } from 'react';
import { Users, Lightbulb, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../../services/api';
import { useDecision } from '../../contexts/DecisionContext';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface PerspectivePanelProps {
  onComplete: (data: any) => void;
}

export const PerspectivePanel: React.FC<PerspectivePanelProps> = ({ onComplete }) => {
  const { decision } = useDecision();
  const [perspectives, setPerspectives] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPerspectives();
  }, []);

  const loadPerspectives = async () => {
    setIsLoading(true);
    try {
      // Get perspectives from simulation
      const response = await api.simulation.getScenarios(decision.id);
      if (response.perspectives) {
        setPerspectives(response.perspectives);
      } else {
        // Fallback mock data
        setPerspectives([
          {
            persona: "Pragmatic Parent",
            key_concern: "Financial security and stability for the future",
            recommendation: "Choose the option with the most predictable income",
            blind_spot: "Underestimating the value of personal fulfillment"
          },
          {
            persona: "Risk-Taking Entrepreneur",
            key_concern: "Missing out on growth opportunities",
            recommendation: "Take the path with the highest upside potential",
            blind_spot: "Overestimating ability to handle failure"
          },
          {
            persona: "Cautious Academic",
            key_concern: "Credentials and long-term career trajectory",
            recommendation: "Invest in education and professional development",
            blind_spot: "Ignoring practical experience value"
          },
          {
            persona: "Values-First Counselor",
            key_concern: "Work-life balance and personal fulfillment",
            recommendation: "Choose what aligns with your core values",
            blind_spot: "Balancing ideals with practical realities"
          },
          {
            persona: "Data-Driven Analyst",
            key_concern: "Lack of sufficient data for confident decision",
            recommendation: "Gather more information before deciding",
            blind_spot: "Analysis paralysis"
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to load perspectives:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPersonaIcon = (persona: string) => {
    if (persona.includes('Parent')) return '👨‍👩‍👦';
    if (persona.includes('Entrepreneur')) return '🚀';
    if (persona.includes('Academic')) return '📚';
    if (persona.includes('Counselor')) return '💫';
    if (persona.includes('Analyst')) return '📊';
    return '🧠';
  };

  const handleComplete = () => {
    onComplete({ perspectives });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Multiple Perspectives</h2>
        <p className="text-gray-600">
          Five different advisors offer their viewpoints to help reduce bias
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {perspectives.map((perspective, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-2xl">
                {getPersonaIcon(perspective.persona)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {perspective.persona}
                  </h4>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Advisor
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Key Concern:</span>
                      <p className="text-sm text-gray-600">{perspective.key_concern}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Recommendation:</span>
                      <p className="text-sm text-gray-600">{perspective.recommendation}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Blind Spot:</span>
                      <p className="text-sm text-gray-600">{perspective.blind_spot}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleComplete}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          Next: Uncertainty Analysis
        </button>
      </div>
    </div>
  );
};