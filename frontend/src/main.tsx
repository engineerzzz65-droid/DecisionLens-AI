import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import './styles/globals.css';

// Mock user for development
const mockUser = {
  id: 1,
  email: 'demo@decisionlens.ai',
  name: 'Demo User'
};

// Set mock user in localStorage for development
if (!localStorage.getItem('user')) {
  localStorage.setItem('user', JSON.stringify(mockUser));
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);