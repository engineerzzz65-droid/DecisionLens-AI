import React from 'react';
import { Sparkles, Users, Shield, ChartBar, Clock, Brain } from 'lucide-react';

const features = [
  {
    icon: <Sparkles className="w-8 h-8 text-primary-500" />,
    title: 'AI-Powered Analysis',
    description: 'Advanced AI analyzes your situation, identifies blind spots, and generates multiple scenarios.'
  },
  {
    icon: <Users className="w-8 h-8 text-primary-500" />,
    title: 'Multiple Perspectives',
    description: 'Get insights from different advisor personas to reduce bias and expand your thinking.'
  },
  {
    icon: <Shield className="w-8 h-8 text-primary-500" />,
    title: 'You Stay in Control',
    description: 'AI provides clarity — but you always make the final decision. No one decides for you.'
  },
  {
    icon: <ChartBar className="w-8 h-8 text-primary-500" />,
    title: 'Visual Comparisons',
    description: 'See your options compared across multiple dimensions with interactive charts and visualizations.'
  },
  {
    icon: <Clock className="w-8 h-8 text-primary-500" />,
    title: 'Save Time & Energy',
    description: 'Stop going in circles. Get structured clarity in minutes instead of weeks of deliberation.'
  },
  {
    icon: <Brain className="w-8 h-8 text-primary-500" />,
    title: 'Responsible AI',
    description: 'Built with guardrails to prevent over-reliance. Shows confidence levels and alternative viewpoints.'
  }
];

export const Features: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose DecisionLens AI?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We combine the best of AI reasoning with human judgment to help you make better decisions.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-center text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};