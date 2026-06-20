import React, { useState } from 'react';
import { Download, Loader2, FileText, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';

interface ReportExportProps {
  decisionId: number;
  onExportComplete?: () => void;
}

export const ReportExport: React.FC<ReportExportProps> = ({ decisionId, onExportComplete }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState('');

  const handleExport = async () => {
    setIsExporting(true);
    setError('');
    try {
      await api.report.exportPDF(decisionId);
      setIsComplete(true);
      onExportComplete?.();
    } catch (err) {
      setError('Failed to export PDF. Please try again.');
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <FileText className="w-6 h-6 text-primary-500" />
        <h3 className="text-lg font-semibold text-gray-900">Export Report</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Download your decision report as a PDF for offline viewing and sharing.
      </p>

      <button
        onClick={handleExport}
        disabled={isExporting || isComplete}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating PDF...
          </>
        ) : isComplete ? (
          <>
            <CheckCircle className="w-5 h-5" />
            Downloaded Successfully
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            Download PDF Report
          </>
        )}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {isComplete && (
        <p className="mt-2 text-sm text-green-600">
          Your report has been downloaded successfully.
        </p>
      )}
    </div>
  );
};