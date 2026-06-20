import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

interface ProgressTrackerProps {
  currentPhase: string;
  phases: string[];
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentPhase, phases }) => {
  const phaseLabels: Record<string, string> = {
    intake: 'Intake',
    diagnostic: 'Diagnostic',
    tradeoffs: 'Tradeoffs',
    simulation: 'Simulation',
    perspectives: 'Perspectives',
    uncertainty: 'Uncertainty',
    complete: 'Complete'
  };

  const currentIndex = phases.indexOf(currentPhase);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Progress bar */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2">
          <div 
            className="h-full bg-primary-500 transition-all duration-500"
            style={{ width: `${(currentIndex / (phases.length - 1)) * 100}%` }}
          />
        </div>

        {/* Phase steps */}
        {phases.map((phase, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={phase} className="flex flex-col items-center relative z-10">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${isComplete ? 'bg-primary-500 text-white' : ''}
                ${isCurrent ? 'bg-primary-100 border-2 border-primary-500' : ''}
                ${!isComplete && !isCurrent ? 'bg-gray-100 border-2 border-gray-300' : ''}
                transition-all duration-300
              `}>
                {isComplete ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Circle className={`w-5 h-5 ${isCurrent ? 'text-primary-500' : 'text-gray-400'}`} />
                )}
              </div>
              <span className={`
                text-xs mt-2 font-medium
                ${isComplete || isCurrent ? 'text-primary-600' : 'text-gray-400'}
              `}>
                {phaseLabels[phase] || phase}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};