import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { MessageList } from './MessageList';
import { QuestionCard } from './QuestionCard';
import { api } from '../../services/api';
import { useDecision } from '../../contexts/DecisionContext';

interface DiagnosticChatProps {
  onComplete: (data: any) => void;
}

export const DiagnosticChat: React.FC<DiagnosticChatProps> = ({ onComplete }) => {
  const { decision } = useDecision();
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [phase, setPhase] = useState('intro');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat with diagnostic questions
    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    setIsLoading(true);
    try {
      const response = await api.chat.startDiagnostic(decision.id);
      setMessages(response.messages || []);
      setQuestions(response.questions || []);
      setPhase('questions');
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      // Fallback with mock questions
      setMessages([
        { role: 'assistant', content: "Let's start by understanding your decision better. I'll ask you a few questions to help clarify your thinking." }
      ]);
      setQuestions([
        { id: 'values', question: 'What personal values matter most to you in this decision?', category: 'values' },
        { id: 'constraints', question: 'What are your key constraints (time, money, location)?', category: 'constraints' },
        { id: 'timeline', question: "What's your expected timeline for this decision?", category: 'timeline' },
        { id: 'financial', question: "What's your current financial situation?", category: 'financial' },
        { id: 'risk', question: 'How comfortable are you with risk on a scale of 1-10?', category: 'risk' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.chat.sendMessage(decision.id, input);
      
      setMessages(prev => [...prev, { role: 'assistant', content: response.response }]);
      
      // Check if all questions are answered
      if (response.is_complete) {
        setPhase('complete');
        // Save answers to context
        const answers = extractAnswers(messages);
        onComplete({ answers, phase: 'diagnostic_complete' });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const extractAnswers = (msgList: any[]) => {
    const answers: Record<string, string> = {};
    let currentQuestion = '';
    
    for (const msg of msgList) {
      if (msg.role === 'assistant' && msg.content.includes('?')) {
        // Simple heuristic: assume questions are in assistant messages
        currentQuestion = msg.content;
      } else if (msg.role === 'user' && currentQuestion) {
        const questionId = questions.find(q => q.question === currentQuestion)?.id || 'unknown';
        answers[questionId] = msg.content;
        currentQuestion = '';
      }
    }
    
    return answers;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-primary-50 rounded-t-xl">
        <h3 className="text-lg font-semibold text-gray-900">Diagnostic Questions</h3>
        <p className="text-sm text-gray-600">
          Answer these questions to help clarify your decision
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <MessageList messages={messages} />
        {isLoading && (
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your answer..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={2}
            disabled={isLoading || phase === 'complete'}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || phase === 'complete'}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
        {phase === 'complete' && (
          <div className="mt-2 text-sm text-green-600">
            ✅ All questions answered! Proceeding to next step...
          </div>
        )}
      </div>
    </div>
  );
};