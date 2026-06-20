import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DecisionContextType {
  decision: any;
  setDecision: (decision: any) => void;
  updateDecision: (data: any) => void;
  clearDecision: () => void;
}

const DecisionContext = createContext<DecisionContextType | undefined>(undefined);

export const useDecision = () => {
  const context = useContext(DecisionContext);
  if (!context) {
    throw new Error('useDecision must be used within a DecisionProvider');
  }
  return context;
};

interface DecisionProviderProps {
  children: ReactNode;
}

export const DecisionProvider: React.FC<DecisionProviderProps> = ({ children }) => {
  const [decision, setDecisionState] = useState<any>(null);

  const setDecision = (data: any) => {
    setDecisionState(data);
    // Store in localStorage for persistence
    localStorage.setItem('decision', JSON.stringify(data));
  };

  const updateDecision = (data: any) => {
    setDecisionState((prev: any) => {
      const updated = { ...prev, ...data };
      localStorage.setItem('decision', JSON.stringify(updated));
      return updated;
    });
  };

  const clearDecision = () => {
    setDecisionState(null);
    localStorage.removeItem('decision');
  };

  // Load from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('decision');
    if (saved) {
      try {
        setDecisionState(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved decision:', e);
      }
    }
  }, []);

  return (
    <DecisionContext.Provider value={{ decision, setDecision, updateDecision, clearDecision }}>
      {children}
    </DecisionContext.Provider>
  );
};