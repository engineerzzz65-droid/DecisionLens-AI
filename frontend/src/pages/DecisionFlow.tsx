import React, { useState, useEffect } from 'react';
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
  const { decision, setDecision, updateDecision } = useDecision();
  const [phase, setPhase] = useState<DecisionPhase>('intake');

  const phases = ['intake', 'diagnostic', 'tradeoffs', 'simulation', 'perspectives', 'uncertainty', 'complete'];

  const handlePhaseComplete = (data: any) => {
    // Update decision with phase data
    updateDecision({ ...decision, ...data });
    
    // Move to next phase
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Decision Flow</h1>
        <p className="text-gray-600">Follow the steps to gain clarity on your decision.</p>
      </div>
      
      <ProgressTracker currentPhase={phase} phases={phases} />
      
      <div className="mt-8">
        {renderPhase()}
      </div>
    </div>
  );
};