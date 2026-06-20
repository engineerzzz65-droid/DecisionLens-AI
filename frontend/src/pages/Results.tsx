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
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-4 sm:mb-0"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Your Results</h1>
                <p className="text-slate-600">Decision: {decision.title}</p>
              </div>
            </div>
          </div>

          <div className="info-pill">Decision analysis ready</div>
        </div>

        <div className="grid gap-6">
          <div className="section-card">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Summary insights</h2>
            <p className="text-slate-600 leading-relaxed">Review your decision direction, explore the most important tradeoffs, and use the report to share the reasoning behind your choices.</p>
          </div>

          <div className="section-card">
            <ClarityReport />
          </div>
        </div>
      </div>
    </div>
  );
};
