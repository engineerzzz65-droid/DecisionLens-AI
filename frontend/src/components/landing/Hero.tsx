import React from 'react';
import { Brain, ArrowRight } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
  isLoading?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onStart, isLoading = false }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary-100 rounded-2xl shadow-lg animate-pulse-slow">
              <Brain className="w-16 h-16 text-primary-600" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Make Better Life Decisions with
            <span className="text-primary-600 block md:inline"> AI-Powered Clarity</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            DecisionLens AI helps you think clearly, identify hidden tradeoffs, 
            and understand uncertainty — so you can make confident decisions.
          </p>
          <button
            onClick={onStart}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold text-lg hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              'Loading...'
            ) : (
              <>
                Start Your Decision Journey
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          <p className="mt-4 text-sm text-gray-500">
            Free • No account required • AI-powered insights
          </p>
        </div>
      </div>
    </section>
  );
};