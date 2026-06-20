import { useState, useEffect } from 'react';
import { api } from '../services/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export const useChat = (decisionId: number) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState('intro');

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.chat.sendMessage(decisionId, content);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setPhase(response.phase);
      
      return response;
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const startDiagnostic = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.chat.startDiagnostic(decisionId);
      setMessages(response.messages || []);
      setPhase('diagnostic');
      return response;
    } catch (err) {
      setError('Failed to start diagnostic');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setPhase('intro');
  };

  return {
    messages,
    isLoading,
    error,
    phase,
    sendMessage,
    startDiagnostic,
    clearMessages
  };
};