import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, HelpCircle, Lightbulb, TrendingUp } from 'lucide-react';
import { api } from '../../services/api';
import { useDecision } from '../../contexts/DecisionContext';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface UncertaintyMapProps {
  onComplete: (data: any) => void;
}

export const UncertaintyMap: React.FC<UncertaintyMapProps> = ({ onComplete }) => {
  const { decision } = useDecision();
  const [uncertainty, setUncertainty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUncertainty();
  }, []);

  const loadUncertainty = async () => {
    setIsLoading(true);
    try {
      const response = await api.simulation.getScenarios(decision.id);
      if (response.uncertainty) {
        setUncertainty(response.uncertainty);
      } else {
        // Fallback mock data
        setUncertainty({
          knowns: [
            "Tuition costs for Master's program",
            "Salary ranges for job positions",
            "Time investment required",
            "Current market conditions"
          ],
          unknowns: [
            "Future job market in 5 years",
            "Networking opportunities",
            "Personal preferences evolution",
            "Health and family situation"
          ],
          assumptions: [
            "Economy remains relatively stable",
            "Personal interests don't change significantly",
            "Health remains good",
            "No major life events"
          ],
          confidence_scores: {
            financial_outcome: 65,
            career_impact: 55,
            lifestyle_change: 50,
            personal_satisfaction: 45
          }
        });
      }
    } catch (error) {
      console.error('Failed to load uncertainty data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBarColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleComplete = () => {
    onComplete({ uncertainty });
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
        <h2 className="text-2xl font-bold text-gray-900">Uncertainty Map</h2>
        <p className="text-gray-600">
          Understanding what's known, unknown, and assumed helps you make better decisions
        </p>
      </div>

      <div className="space-y-6">
        {/* Known Factors */}
        <div className="bg-white p-6 rounded-xl border border-green-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Known Factors</h3>
            <span className="text-sm text-gray-500 ml-auto">We can reasonably predict these</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {uncertainty?.knowns?.map((item: string, index: number) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Unknown Factors */}
        <div className="bg-white p-6 rounded-xl border border-yellow-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">Unknown Factors</h3>
            <span className="text-sm text-gray-500 ml-auto">We cannot predict these with confidence</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {uncertainty?.unknowns?.map((item: string, index: number) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                <HelpCircle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Assumptions */}
        <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Assumptions</h3>
            <span className="text-sm text-gray-500 ml-auto">What we're taking for granted</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {uncertainty?.assumptions?.map((item: string, index: number) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Lightbulb className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Confidence Scores */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Confidence Scores</h3>
          <div className="space-y-3">
            {uncertainty?.confidence_scores && Object.entries(uncertainty.confidence_scores).map(([key, value]) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {key.replace('_', ' ').charAt(0).toUpperCase() + key.replace('_', ' ').slice(1)}
                  </span>
                  <span className={`text-sm font-semibold ${getConfidenceColor(value as number)}`}>
                    {value}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${getConfidenceBarColor(value as number)} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <AlertCircle className="w-4 h-4" />
          <span>Uncertainty is natural. Focus on what you can control.</span>
        </div>
        <button
          onClick={handleComplete}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          Next: Complete Analysis
        </button>
      </div>
    </div>
  );
};