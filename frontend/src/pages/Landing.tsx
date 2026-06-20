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
      name: 'Demo User',
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
      description: 'Advanced AI analyzes your situation, identifies blind spots, and generates scenarios that matter.',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Multiple Perspectives',
      description: 'Get insights from advisor personas that challenge assumptions and widen your view.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'You Stay in Control',
      description: 'AI supports your thinking, but you retain final authority on every decision.',
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Conversational Flow',
      description: 'A guided, chat-style process that keeps the decision work clear and simple.',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Scenario Simulation',
      description: 'Compare best, expected, and downside cases across all your options.',
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: 'Hidden Tradeoffs',
      description: 'Surface the tradeoffs that matter most so you can choose with confidence.',
    },
  ];

  const steps = [
    { number: '1', title: 'Describe your decision', description: 'Share the choice you are facing and what matters most.' },
    { number: '2', title: 'Answer discovery questions', description: 'Help the AI understand your values, constraints, and risk tolerance.' },
    { number: '3', title: 'Review scenarios', description: 'Compare options visually with perspectives, risk, and impact in mind.' },
    { number: '4', title: 'Download your report', description: 'Capture a concise clarity report you can review or share later.' },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_20%)]" />
        <div className="absolute top-16 right-16 w-72 h-72 rounded-full bg-primary-200/20 blur-3xl" />
        <div className="absolute bottom-16 left-16 w-96 h-96 rounded-full bg-blue-200/20 blur-3xl" />

        <div className="container mx-auto px-4 py-20 relative">
          <div className="hero-card mx-auto max-w-5xl">
            <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 mb-6">
                  <Brain className="w-4 h-4" />
                  AI-backed decision guidance
                </div>
                <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl lg:text-6xl leading-tight">
                  Make clearer decisions with AI that helps you think through tradeoffs.
                </h1>
                <p className="mt-6 text-lg text-slate-600 max-w-2xl leading-8">
                  DecisionLens AI helps you organize your options, compare scenarios, and capture the logic behind your next move.
                </p>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <button onClick={handleStart} disabled={isLoading} className="btn-primary">
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Starting...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        Start your decision journey
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </button>
                  <button onClick={() => window.scrollTo({ top: 900, behavior: 'smooth' })} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:border-primary-200 hover:text-slate-900 transition">
                    View features
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 text-sm text-slate-500">
                  <div className="rounded-3xl bg-slate-100 px-4 py-4">
                    <p className="font-semibold text-slate-900">Fast setup</p>
                    <p>Start with a quick intake and get useful insight fast.</p>
                  </div>
                  <div className="rounded-3xl bg-slate-100 px-4 py-4">
                    <p className="font-semibold text-slate-900">Transparent AI</p>
                    <p>See the reasoning, assumptions, and recommended tradeoffs.</p>
                  </div>
                  <div className="rounded-3xl bg-slate-100 px-4 py-4">
                    <p className="font-semibold text-slate-900">Shareable report</p>
                    <p>Download a clarity report for review or collaboration.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] bg-gradient-to-br from-white to-slate-100 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-600">AI decision preview</p>
                  <h2 className="mt-4 text-2xl font-semibold text-slate-900">What you will get</h2>
                  <ul className="mt-6 space-y-4 text-slate-600 text-sm">
                    <li className="flex gap-3">
                      <CheckCircle className="mt-1 h-5 w-5 text-emerald-500" />
                      Structured tradeoff analysis and scenario comparison.
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle className="mt-1 h-5 w-5 text-emerald-500" />
                      Multiple advisor perspectives with clear reasoning.
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle className="mt-1 h-5 w-5 text-emerald-500" />
                      A concise clarity report you can download and share.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why teams and individuals trust DecisionLens</h2>
            <p className="text-slate-600">A modern decision assistant that blends AI structure with your judgment.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="group rounded-[28px] border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-primary-100 text-primary-600 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How it works</h2>
            <p className="text-slate-600">A guided workflow that turns uncertainty into practical insight.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="rounded-[30px] border border-slate-200 bg-white p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-600 text-white text-2xl font-bold">{step.number}</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to move forward with confidence?</h2>
          <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">Try structured decision support that captures your reasoning and helps you compare outcomes clearly.</p>
          <button onClick={handleStart} className="mt-10 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-primary-600 shadow-xl shadow-slate-900/20 hover:bg-slate-100 transition">
            Get started now
            <Zap className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};
