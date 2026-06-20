import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useDecision as useDecisionContext } from '../contexts/DecisionContext';

export const useDecision = () => {
  const { decision, setDecision, updateDecision, clearDecision } = useDecisionContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDecision = async (title: string, description: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.decisions.create({
        user_id: 1, // Mock user
        title,
        description
      });
      setDecision(response);
      return response;
    } catch (err) {
      setError('Failed to create decision');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loadDecision = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.decisions.get(id);
      setDecision(response);
      return response;
    } catch (err) {
      setError('Failed to load decision');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDecisionStatus = async (status: string) => {
    if (!decision) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.decisions.update(decision.id, { status });
      updateDecision(response);
      return response;
    } catch (err) {
      setError('Failed to update decision status');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    decision,
    isLoading,
    error,
    createDecision,
    loadDecision,
    updateDecisionStatus,
    clearDecision
  };
};