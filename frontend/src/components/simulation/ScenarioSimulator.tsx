import React, { useState, useEffect } from 'react';
import { RadarChart } from './RadarChart';
import { ComparisonTable } from './ComparisonTable';
import { api } from '../../services/api';
import { useDecision } from '../../contexts/DecisionContext';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';

interface ScenarioSimulatorProps {
  onComplete: (data: any) => void;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ onComplete }) => {
  const { decision } = useDecision();
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    setIsLoading(true);
    try {
      const response = await api.simulation.getScenarios(decision.id);
      if (response.scenarios && response.scenarios.length > 0) {
        setScenarios(response.scenarios);
        setSelectedScenario(response.scenarios[0]?.label || null);
      } else {
        // Fallback mock data
        const mockScenarios = [
          {
            label: "Master's Degree",
            financial_score: 70,
            career_score: 85,
            lifestyle_score: 65,
            risk_score: 40,
            values_score: 80,
            confidence_level: 75,
            narrative: "A solid investment in your future with moderate financial returns and strong career growth."
          },
          {
            label: "Job Offer",
            financial_score: 80,
            career_score: 70,
            lifestyle_score: 75,
            risk_score: 60,
            values_score: 65,
            confidence_level: 85,
            narrative: "Immediate stability with good income and work-life balance, but limited long-term growth."
          },
          {
            label: "Start Company",
            financial_score: 50,
            career_score: 90,
            lifestyle_score: 55,
            risk_score: 85,
            values_score: 75,
            confidence_level: 55,
            narrative: "High risk, high reward. Maximum autonomy and learning, but significant uncertainty."
          }
        ];
        setScenarios(mockScenarios);
        setSelectedScenario(mockScenarios[0]?.label || null);
      }
    } catch (error) {
      console.error('Failed to load scenarios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRadarData = () => {
    if (!scenarios.length) return [];
    const categories = ['Financial', 'Career', 'Lifestyle', 'Risk', 'Values'];
    return categories.map((category) => {
      const data: any = { category };
      scenarios.forEach((s) => {
        const key = category.toLowerCase() + '_score';
        data[s.label] = s[key] || 0;
      });
      return data;
    });
  };

  const getTrendIcon = (score: number) => {
    if (score >= 70) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (score >= 40) return <Minus className="w-4 h-4 text-yellow-500" />;
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  const handleComplete = () => {
    onComplete({ scenarios });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Scenario Simulation</h2>
        <p className="text-gray-600">Compare different options across multiple dimensions</p>
      </div>

      {/* Radar Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Multi-Dimensional Comparison</h3>
        <RadarChart
          data={getRadarData()}
          scenarios={scenarios.map(s => s.label)}
          colors={['#0ea5e9', '#10b981', '#f59e0b']}
        />
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {scenarios.map((scenario, index) => (
          <div
            key={index}
            className={`bg-white p-4 rounded-xl border-2 transition-all cursor-pointer ${
              selectedScenario === scenario.label
                ? 'border-primary-500 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedScenario(scenario.label)}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">{scenario.label}</h4>
              <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full">
                Confidence: {scenario.confidence_level}%
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Overall Score</span>
                <span className="font-bold text-gray-900">
                  {Math.round((scenario.financial_score + scenario.career_score + scenario.lifestyle_score + (100 - scenario.risk_score) + scenario.values_score) / 5)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Financial</span>
                <div className="flex items-center gap-1">
                  {getTrendIcon(scenario.financial_score)}
                  <span>{scenario.financial_score}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Career</span>
                <div className="flex items-center gap-1">
                  {getTrendIcon(scenario.career_score)}
                  <span>{scenario.career_score}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Risk (inverted)</span>
                <div className="flex items-center gap-1">
                  {getTrendIcon(100 - scenario.risk_score)}
                  <span>{100 - scenario.risk_score}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Comparison</h3>
        <ComparisonTable scenarios={scenarios} />
      </div>

      {/* Selected Scenario Narrative */}
      {selectedScenario && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {selectedScenario} - Narrative
          </h3>
          <p className="text-gray-700">
            {scenarios.find(s => s.label === selectedScenario)?.narrative || 'No narrative available.'}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <AlertCircle className="w-4 h-4" />
          <span>These are simulations based on available data. Real outcomes may vary.</span>
        </div>
        <button
          onClick={handleComplete}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          Next: Perspectives
        </button>
      </div>
    </div>
  );
};