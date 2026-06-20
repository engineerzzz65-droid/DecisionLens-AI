import React, { useState } from 'react';
import { useDecision } from '../../contexts/DecisionContext';
import { api } from '../../services/api';
import { ArrowRight, Loader2, Lightbulb, Send, Sparkles } from 'lucide-react';

interface DecisionIntakeProps {
  onComplete: (data: any) => void;
}

// Example decisions with checkboxes
const exampleDecisions = [
  {
    id: 'career',
    title: 'Career Path',
    description: 'Should I pursue a Master\'s degree, take a job offer, or start a company?',
    icon: '💼'
  },
  {
    id: 'move',
    title: 'Relocation',
    description: 'Should I move to a new city for a promotion or stay for family?',
    icon: '🏠'
  },
  {
    id: 'investment',
    title: 'Investment',
    description: 'Should I buy a house now or continue renting and invest?',
    icon: '💰'
  },
  {
    id: 'education',
    title: 'Education',
    description: 'Should I go back to school or continue working?',
    icon: '📚'
  },
  {
    id: 'entrepreneurship',
    title: 'Entrepreneurship',
    description: 'Should I start my own business or stay in my current job?',
    icon: '🚀'
  },
  {
    id: 'relationship',
    title: 'Relationship',
    description: 'Should I commit to this relationship or focus on my career?',
    icon: '❤️'
  }
];

export const DecisionIntake: React.FC<DecisionIntakeProps> = ({ onComplete }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const { setDecision } = useDecision();

  const handleExampleSelect = (example: typeof exampleDecisions[0]) => {
    if (selectedExample === example.id) {
      setSelectedExample(null);
      setTitle('');
      setDescription('');
    } else {
      setSelectedExample(example.id);
      setTitle(example.title);
      setDescription(example.description);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.decisions.create({
        user_id: 1,
        title: title.trim(),
        description: description.trim()
      });

      setDecision(response);
      onComplete({ decision: response });
    } catch (err) {
      setError('Failed to create decision. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomToggle = () => {
    setShowCustomInput(!showCustomInput);
    if (!showCustomInput) {
      setSelectedExample(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">What decision are you facing?</h2>
              <p className="text-gray-600 text-sm">Choose an example or describe your own</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Example Decisions - Checkbox Style */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">Common Decisions</h3>
              <button
                onClick={handleCustomToggle}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                {showCustomInput ? '← Back to examples' : 'Or describe custom →'}
              </button>
            </div>

            {!showCustomInput ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exampleDecisions.map((example) => (
                  <label
                    key={example.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedExample === example.id
                        ? 'border-primary-500 bg-primary-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedExample === example.id}
                      onChange={() => handleExampleSelect(example)}
                      className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{example.icon}</span>
                        <span className="font-medium text-gray-900">{example.title}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{example.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Describe your decision in detail:</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Decision Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Career Path Decision"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Decision Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your decision, your options, and any relevant context..."
                      rows={4}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-shadow"
                      disabled={isLoading}
                    />
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Analyze My Decision
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Selected Example Submit */}
          {selectedExample && !showCustomInput && (
            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Analyze This Decision
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Lightbulb className="w-3 h-3 text-yellow-500" />
            <span>Your decision will be analyzed by AI to provide multiple perspectives and scenarios</span>
          </div>
        </div>
      </div>
    </div>
  );
};