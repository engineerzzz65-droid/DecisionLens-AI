import React from 'react';
import { Check, X, Edit2, AlertCircle } from 'lucide-react';

interface TradeoffCardProps {
  tradeoff: {
    id: string;
    description: string;
    category: string;
    impact_level: string;
    acknowledged: 'pending' | 'accepted' | 'rejected';
  };
  onAcknowledge: (id: string, status: 'accepted' | 'rejected') => void;
  onEdit: (id: string) => void;
}

export const TradeoffCard: React.FC<TradeoffCardProps> = ({
  tradeoff,
  onAcknowledge,
  onEdit
}) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Financial': 'bg-green-100 text-green-700 border-green-200',
      'Career': 'bg-blue-100 text-blue-700 border-blue-200',
      'Lifestyle': 'bg-purple-100 text-purple-700 border-purple-200',
      'Relationship': 'bg-pink-100 text-pink-700 border-pink-200',
      'Health': 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getImpactBadge = (level: string) => {
    const colors: Record<string, string> = {
      'high': 'bg-red-100 text-red-700',
      'medium': 'bg-yellow-100 text-yellow-700',
      'low': 'bg-green-100 text-green-700'
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'border-green-500 bg-green-50';
      case 'rejected':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${getStatusColor(tradeoff.acknowledged)} transition-all duration-200`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(tradeoff.category)}`}>
              {tradeoff.category}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getImpactBadge(tradeoff.impact_level)}`}>
              {tradeoff.impact_level} impact
            </span>
            {tradeoff.acknowledged !== 'pending' && (
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                tradeoff.acknowledged === 'accepted'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {tradeoff.acknowledged === 'accepted' ? '✓ Accepted' : '✗ Rejected'}
              </span>
            )}
          </div>
          
          <p className="text-gray-800">{tradeoff.description}</p>
        </div>

        <div className="flex gap-1 flex-shrink-0">
          {tradeoff.acknowledged === 'pending' && (
            <>
              <button
                onClick={() => onAcknowledge(tradeoff.id, 'accepted')}
                className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                title="Accept this tradeoff"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => onAcknowledge(tradeoff.id, 'rejected')}
                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                title="Reject this tradeoff"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={() => onEdit(tradeoff.id)}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            title="Edit tradeoff description"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {tradeoff.acknowledged === 'pending' && (
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
          <AlertCircle className="w-3 h-3" />
          <span>Review this tradeoff and decide if it applies to your situation</span>
        </div>
      )}
    </div>
  );
};