import React, { useState, useEffect } from 'react';
import { Check, X, Edit2, AlertCircle, Lightbulb } from 'lucide-react';
import { api } from '../../services/api';
import { useDecision } from '../../contexts/DecisionContext';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface TradeoffReviewProps {
  onComplete: (data: any) => void;
}

interface Tradeoff {
  id: string;
  description: string;
  category: string;
  impact_level: string;
  acknowledged: 'pending' | 'accepted' | 'rejected';
}

export const TradeoffReview: React.FC<TradeoffReviewProps> = ({ onComplete }) => {
  const { decision } = useDecision();
  const [tradeoffs, setTradeoffs] = useState<Tradeoff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    loadTradeoffs();
  }, []);

  const loadTradeoffs = async () => {
    setIsLoading(true);
    try {
      const response = await api.chat.getTradeoffs(decision.id);
      if (response.tradeoffs) {
        setTradeoffs(response.tradeoffs);
      } else {
        // Fallback mock data
        setTradeoffs([
          {
            id: '1',
            description: 'Opportunity cost of pursuing education instead of earning income',
            category: 'Financial',
            impact_level: 'high',
            acknowledged: 'pending'
          },
          {
            id: '2',
            description: 'Geographic flexibility vs. settling down',
            category: 'Lifestyle',
            impact_level: 'medium',
            acknowledged: 'pending'
          },
          {
            id: '3',
            description: 'Delayed earnings may affect retirement savings',
            category: 'Financial',
            impact_level: 'medium',
            acknowledged: 'pending'
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to load tradeoffs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcknowledge = (id: string, status: 'accepted' | 'rejected') => {
    setTradeoffs(prev =>
      prev.map(t =>
        t.id === id ? { ...t, acknowledged: status } : t
      )
    );
  };

  const handleEdit = (id: string, newDescription: string) => {
    setTradeoffs(prev =>
      prev.map(t =>
        t.id === id ? { ...t, description: newDescription } : t
      )
    );
    setEditingId(null);
    setEditValue('');
  };

  const startEditing = (tradeoff: Tradeoff) => {
    setEditingId(tradeoff.id);
    setEditValue(tradeoff.description);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Financial': 'bg-green-100 text-green-700',
      'Career': 'bg-blue-100 text-blue-700',
      'Lifestyle': 'bg-purple-100 text-purple-700',
      'Relationship': 'bg-pink-100 text-pink-700',
      'Health': 'bg-red-100 text-red-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getImpactBadge = (level: string) => {
    const colors: Record<string, string> = {
      'high': 'bg-red-100 text-red-700',
      'medium': 'bg-yellow-100 text-yellow-700',
      'low': 'bg-green-100 text-green-700'
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  const allAcknowledged = tradeoffs.every(t => t.acknowledged !== 'pending');

  const handleComplete = () => {
    onComplete({ tradeoffs });
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
        <h2 className="text-2xl font-bold text-gray-900">Review Hidden Tradeoffs</h2>
        <p className="text-gray-600">
          These are potential tradeoffs you might not have considered.
          Accept, reject, or edit them.
        </p>
      </div>

      <div className="space-y-4">
        {tradeoffs.map((tradeoff) => (
          <div
            key={tradeoff.id}
            className={`bg-white p-6 rounded-xl border ${
              tradeoff.acknowledged === 'accepted'
                ? 'border-green-200 bg-green-50'
                : tradeoff.acknowledged === 'rejected'
                ? 'border-red-200 bg-red-50'
                : 'border-gray-200'
            } shadow-sm transition-all duration-300`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-1">
                {editingId === tradeoff.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      autoFocus
                    />
                    <button
                      onClick={() => handleEdit(tradeoff.id, editValue)}
                      className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-900">{tradeoff.description}</p>
                        <div className="flex gap-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(tradeoff.category)}`}>
                            {tradeoff.category}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getImpactBadge(tradeoff.impact_level)}`}>
                            {tradeoff.impact_level} impact
                          </span>
                          {tradeoff.acknowledged !== 'pending' && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              tradeoff.acknowledged === 'accepted'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {tradeoff.acknowledged === 'accepted' ? '✓ Accepted' : '✗ Rejected'}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => startEditing(tradeoff)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
              
              {editingId !== tradeoff.id && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcknowledge(tradeoff.id, 'accepted')}
                    className={`p-2 rounded-lg transition-colors ${
                      tradeoff.acknowledged === 'accepted'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600'
                    }`}
                    title="Accept this tradeoff"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleAcknowledge(tradeoff.id, 'rejected')}
                    className={`p-2 rounded-lg transition-colors ${
                      tradeoff.acknowledged === 'rejected'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                    }`}
                    title="Reject this tradeoff"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <AlertCircle className="w-4 h-4" />
          <span>
            {allAcknowledged
              ? '✅ All tradeoffs reviewed'
              : `${tradeoffs.filter(t => t.acknowledged === 'pending').length} tradeoffs pending review`}
          </span>
        </div>
        <button
          onClick={handleComplete}
          disabled={!allAcknowledged}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {allAcknowledged ? 'Next: Simulation' : 'Review All Tradeoffs First'}
        </button>
      </div>
    </div>
  );
};