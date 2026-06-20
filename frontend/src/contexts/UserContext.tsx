import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  name?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);

  const setUser = (userData: User) => {
    setUserState(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUserState(null);
    localStorage.removeItem('user');
  };

  // Load from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        setUserState(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </UserContext.Provider>
  );
};