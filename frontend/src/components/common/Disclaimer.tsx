import React from 'react';
import { AlertCircle } from 'lucide-react';

export const Disclaimer: React.FC = () => {
  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center gap-2 text-sm text-yellow-800">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>
            <strong>DecisionLens AI</strong> is a decision support tool. All recommendations are for 
            informational purposes only. You are responsible for your own decisions.
          </span>
        </div>
      </div>
    </div>
  );
};