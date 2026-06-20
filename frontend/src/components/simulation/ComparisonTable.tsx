import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ComparisonTableProps {
  scenarios: Array<{
    label: string;
    financial_score: number;
    career_score: number;
    lifestyle_score: number;
    risk_score: number;
    values_score: number;
    confidence_level: number;
  }>;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ scenarios }) => {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (score: number) => {
    if (score >= 70) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (score >= 40) return <Minus className="w-4 h-4 text-yellow-500" />;
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Metric</th>
            {scenarios.map((scenario) => (
              <th key={scenario.label} className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                {scenario.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-100">
            <td className="px-4 py-3 text-sm text-gray-600 font-medium">Financial</td>
            {scenarios.map((scenario) => (
              <td key={scenario.label} className={`px-4 py-3 text-center text-sm font-semibold ${getScoreColor(scenario.financial_score)}`}>
                <div className="flex items-center justify-center gap-1">
                  {getTrendIcon(scenario.financial_score)}
                  {scenario.financial_score}
                </div>
              </td>
            ))}
          </tr>
          <tr className="border-b border-gray-100">
            <td className="px-4 py-3 text-sm text-gray-600 font-medium">Career</td>
            {scenarios.map((scenario) => (
              <td key={scenario.label} className={`px-4 py-3 text-center text-sm font-semibold ${getScoreColor(scenario.career_score)}`}>
                <div className="flex items-center justify-center gap-1">
                  {getTrendIcon(scenario.career_score)}
                  {scenario.career_score}
                </div>
              </td>
            ))}
          </tr>
          <tr className="border-b border-gray-100">
            <td className="px-4 py-3 text-sm text-gray-600 font-medium">Lifestyle</td>
            {scenarios.map((scenario) => (
              <td key={scenario.label} className={`px-4 py-3 text-center text-sm font-semibold ${getScoreColor(scenario.lifestyle_score)}`}>
                <div className="flex items-center justify-center gap-1">
                  {getTrendIcon(scenario.lifestyle_score)}
                  {scenario.lifestyle_score}
                </div>
              </td>
            ))}
          </tr>
          <tr className="border-b border-gray-100">
            <td className="px-4 py-3 text-sm text-gray-600 font-medium">Risk (inverted)</td>
            {scenarios.map((scenario) => {
              const riskInverted = 100 - scenario.risk_score;
              return (
                <td key={scenario.label} className={`px-4 py-3 text-center text-sm font-semibold ${getScoreColor(riskInverted)}`}>
                  <div className="flex items-center justify-center gap-1">
                    {getTrendIcon(riskInverted)}
                    {riskInverted}
                  </div>
                </td>
              );
            })}
          </tr>
          <tr className="border-b border-gray-100">
            <td className="px-4 py-3 text-sm text-gray-600 font-medium">Values</td>
            {scenarios.map((scenario) => (
              <td key={scenario.label} className={`px-4 py-3 text-center text-sm font-semibold ${getScoreColor(scenario.values_score)}`}>
                <div className="flex items-center justify-center gap-1">
                  {getTrendIcon(scenario.values_score)}
                  {scenario.values_score}
                </div>
              </td>
            ))}
          </tr>
          <tr>
            <td className="px-4 py-3 text-sm text-gray-600 font-medium">Confidence</td>
            {scenarios.map((scenario) => (
              <td key={scenario.label} className="px-4 py-3 text-center text-sm text-gray-600">
                {scenario.confidence_level}%
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};