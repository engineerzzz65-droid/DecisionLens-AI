import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDecision } from '../contexts/DecisionContext';
import { DecisionIntake } from '../components/decision/DecisionIntake';
import { DiagnosticChat } from '../components/chat/DiagnosticChat';
import { TradeoffReview } from '../components/tradeoffs/TradeoffReview';
import { ScenarioSimulator } from '../components/simulation/ScenarioSimulator';
import { PerspectivePanel } from '../components/perspectives/PerspectivePanel';
import { UncertaintyMap } from '../components/uncertainity/UncertaintyMap';
import { ProgressTracker } from '../components/decision/ProgressTracker';

type DecisionPhase = 'intake' | 'diagnostic' | 'tradeoffs' | 'simulation' | 'perspectives' | 'uncertainty' | 'complete';

export const DecisionFlow: React.FC = () => {
  const navigate = useNavigate();
  const { decision, updateDecision } = useDecision();
  const [phase, setPhase] = useState<DecisionPhase>('intake');

  const phases = ['intake', 'diagnostic', 'tradeoffs', 'simulation', 'perspectives', 'uncertainty', 'complete'];

  const handlePhaseComplete = (data: any) => {
    updateDecision({ ...decision, ...data });

    const currentIndex = phases.indexOf(phase);
    if (currentIndex < phases.length - 1) {
      setPhase(phases[currentIndex + 1] as DecisionPhase);
    } else {
      navigate('/results');
    }
  };

  const renderPhase = () => {
    switch (phase) {
      case 'intake':
        return <DecisionIntake onComplete={handlePhaseComplete} />;
      case 'diagnostic':
        return <DiagnosticChat onComplete={handlePhaseComplete} />;
      case 'tradeoffs':
        return <TradeoffReview onComplete={handlePhaseComplete} />;
      case 'simulation':
        return <ScenarioSimulator onComplete={handlePhaseComplete} />;
      case 'perspectives':
        return <PerspectivePanel onComplete={handlePhaseComplete} />;
      case 'uncertainty':
        return <UncertaintyMap onComplete={handlePhaseComplete} />;
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="section-card">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Decision Flow</h1>
            <p className="text-slate-600 mt-2">A guided workflow designed to uncover values, tradeoffs, scenarios, and confidence.</p>
          </div>

          <div className="mb-10">
            <ProgressTracker currentPhase={phase} phases={phases} />
          </div>

          <div>{renderPhase()}</div>
        </div>
      </div>
    </div>
  );
};
