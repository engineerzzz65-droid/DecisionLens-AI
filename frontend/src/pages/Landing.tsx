import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { 
  Brain, 
  Sparkles, 
  Shield, 
  Users, 
  ArrowRight, 
  CheckCircle,
  MessageSquare,
  Lightbulb,
  TrendingUp,
  Zap,
  ChevronRight,
  Star
} from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    setIsLoading(true);
    const mockUser = {
      id: 1,
      email: 'demo@decisionlens.ai',
      name: 'Demo User'
    };
    setUser(mockUser);
    
    setTimeout(() => {
      setIsLoading(false);
      navigate('/decision');
    }, 500);
  };

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI analyzes your situation and generates multiple scenarios'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Multiple Perspectives',
      description: 'Get insights from different advisor personas to reduce bias'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'You Stay in Control',
      description: 'AI provides clarity — but you always make the final decision'
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Chat-Like Interface',
      description: 'Natural conversation flow to explore your decision'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Scenario Simulation',
      description: 'Compare outcomes across multiple dimensions'
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: 'Hidden Tradeoffs',
      description: 'Identify blind spots you might have missed'
    }
  ];

  const steps = [
    { number: '1', title: 'Describe Your Decision', description: 'Tell us about your decision in your own words' },
    { number: '2', title: 'Answer Questions', description: 'Thoughtful questions to uncover your values' },
    { number: '3', title: 'Explore Scenarios', description: 'Review AI-generated scenarios with different outcomes' },
    { number: '4', title: 'Get Clarity Report', description: 'Receive a comprehensive report with insights' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - ChatGPT Style */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-white to-blue-50/30" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-full">
                <Brain className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-primary-700">AI-Powered Decision Support</span>
              </div>
            </div>

            {/* Hero Content */}
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Make Better Life Decisions with
                <span className="block text-primary-600"> AI-Powered Clarity</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                DecisionLens AI helps you think clearly, identify hidden tradeoffs, 
                and understand uncertainty — so you can make confident decisions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleStart}
                  disabled={isLoading}
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold text-lg hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      Start Your Decision Journey
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <button className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                  <span>Watch Demo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Free to use
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  No account required
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Privacy first
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Grid Cards */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose DecisionLens AI?
            </h2>
            <p className="text-gray-600">
              We combine the best of AI reasoning with human judgment to help you make better decisions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Steps */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Journey to Clarity
            </h2>
            <p className="text-gray-600">
              Four simple steps to gain clarity on your decision
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary-200 -translate-y-1/2" />
                )}
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-primary-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-4 shadow-lg shadow-primary-200">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make a Better Decision?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of people who have gained clarity on their life decisions with DecisionLens AI.
          </p>
          <button
            onClick={handleStart}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg"
          >
            Get Started Now
            <Zap className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};