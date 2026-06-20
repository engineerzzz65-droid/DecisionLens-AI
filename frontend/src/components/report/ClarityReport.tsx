import React, { useState, useEffect } from 'react';
import { FileText, Download, Share2, CheckCircle, AlertCircle, Lightbulb, TrendingUp } from 'lucide-react';
import { api } from '../../services/api';
import { useDecision } from '../../contexts/DecisionContext';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ReportExport } from './ReportExport';

interface ClarityReportProps {
  onComplete?: (data: any) => void;
}

export const ClarityReport: React.FC<ClarityReportProps> = ({ onComplete }) => {
  const { decision } = useDecision();
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const response = await api.report.generate(decision.id);
      setReport(response.report);
    } catch (error) {
      console.error('Failed to generate report:', error);
      // Fallback mock report
      setReport({
        decision_summary: "Based on your decision to pursue a Master's degree, take a job offer, or start a company, the analysis reveals important tradeoffs and considerations.",
        values_profile: {
          "Career Growth": "High priority",
          "Financial Security": "Medium-high priority",
          "Work-Life Balance": "Medium priority",
          "Learning": "High priority"
        },
        tradeoffs: [
          {
            description: "Opportunity cost of pursuing education",
            category: "Financial"
          },
          {
            description: "Flexibility vs. stability",
            category: "Lifestyle"
          },
          {
            description: "Immediate income vs. long-term earning potential",
            category: "Career"
          }
        ],
        scenarios: [
          {
            label: "Master's Degree",
            financial_score: 70,
            career_score: 85,
            lifestyle_score: 65,
            risk_score: 40,
            values_score: 80,
            confidence_level: 75
          },
          {
            label: "Job Offer",
            financial_score: 80,
            career_score: 70,
            lifestyle_score: 75,
            risk_score: 60,
            values_score: 65,
            confidence_level: 85
          },
          {
            label: "Start Company",
            financial_score: 50,
            career_score: 90,
            lifestyle_score: 55,
            risk_score: 85,
            values_score: 75,
            confidence_level: 55
          }
        ],
        perspectives: [
          {
            persona: "Pragmatic Parent",
            key_concern: "Financial security and stability for the future",
            recommendation: "Choose the job offer for immediate stability",
            blind_spot: "Underestimating the value of personal fulfillment"
          },
          {
            persona: "Risk-Taking Entrepreneur",
            key_concern: "Missing out on growth opportunities",
            recommendation: "Start the company for maximum upside",
            blind_spot: "Overestimating ability to handle failure"
          }
        ],
        uncertainty: {
          knowns: ["Tuition costs", "Salary ranges", "Time commitment"],
          unknowns: ["Market conditions in 5 years", "Networking opportunities", "Personal preferences"],
          assumptions: ["Economy remains stable", "Personal interests don't change", "Health remains good"]
        },
        reflection_questions: [
          "What would you choose if you had no constraints?",
          "What's the best-case scenario you can imagine?",
          "What's one small step you can take toward your decision this week?"
        ],
        next_research_step: "Talk to people who have made each of these choices. Ask about their regrets and what they wish they had known."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await api.report.exportPDF(decision.id);
    } catch (error) {
      console.error('Failed to export PDF:', error);
    } finally {
      setIsExporting(false);
    }
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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Clarity Report</h2>
              <p className="text-gray-600">Comprehensive analysis to help you decide</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isExporting ? 'Exporting...' : 'Export PDF'}
              </button>
              <button
                onClick={() => navigator.share?.({ title: 'Decision Report', text: 'Check out my DecisionLens AI report!' })}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Decision Summary */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Decision Summary</h3>
            <p className="text-gray-700">{report?.decision_summary}</p>
          </section>

          {/* Values Profile */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Values Profile</h3>
            <div className="grid grid-cols-2 gap-2">
              {report?.values_profile && Object.entries(report.values_profile).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{key}:</span>
                  <span className="text-sm text-gray-600 ml-1">{String(value)}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Key Tradeoffs */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Tradeoffs</h3>
            <div className="space-y-2">
              {report?.tradeoffs?.map((tradeoff: any, index: number) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700">{tradeoff.description}</p>
                    <span className="text-xs text-gray-500">Category: {tradeoff.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Reflection Questions */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reflection Questions</h3>
            <div className="space-y-2">
              {report?.reflection_questions?.map((question: string, index: number) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{question}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Next Research Step */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Next Research Step</h3>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{report?.next_research_step}</p>
              </div>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="border-t border-gray-200 pt-4">
            <div className="flex items-start gap-2 text-sm text-gray-500">
              <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p>
                <strong>Disclaimer:</strong> This report is for informational purposes only. 
                All decisions are ultimately your responsibility. Consult with appropriate 
                professionals for specific advice.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};