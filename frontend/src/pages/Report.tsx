import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDecision } from '../contexts/DecisionContext';
import { ClarityReport } from '../components/report/ClarityReport';
import { ReportExport } from '../components/report/ReportExport';
import { ArrowLeft, FileText } from 'lucide-react';

export const Report: React.FC = () => {
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
            onClick={() => navigate('/results')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Results
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary-500" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Clarity Report</h1>
                <p className="text-gray-600">
                  Comprehensive analysis for: {decision.title}
                </p>
              </div>
            </div>
            <ReportExport decisionId={decision.id} />
          </div>
        </div>

        {/* Report */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <ClarityReport />
        </div>
      </div>
    </div>
  );
};