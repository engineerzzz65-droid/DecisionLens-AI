import React from 'react';

interface QuestionCardProps {
  question: {
    id: string;
    question: string;
    category: string;
    type?: string;
  };
  onAnswer: (id: string, answer: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer }) => {
  const [answer, setAnswer] = React.useState('');

  const handleSubmit = () => {
    if (answer.trim()) {
      onAnswer(question.id, answer);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-2">
        <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded">
          {question.category}
        </span>
      </div>
      <h4 className="text-lg font-medium text-gray-900 mb-3">{question.question}</h4>
      <div className="flex gap-2">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <button
          onClick={handleSubmit}
          disabled={!answer.trim()}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </div>
    </div>
  );
};