import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDecision } from '../contexts/DecisionContext';
import { ClarityReport } from '../components/report/ClarityReport';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export const Results: React.FC = () => {
  const navigate = useNavigate();
  const { decision } = useDecision();

  useEffect(() => {
    if (!decision) {
      navigate('/');
    }
  }, [decision, navigate]);

  if (!decision) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Results</h1>
              <p className="text-gray-600">
                Decision: {decision.title}
              </p>
            </div>
          </div>
        </div>

        {/* Report */}
        <ClarityReport />
      </div>
    </div>
  );
};