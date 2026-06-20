import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { DecisionProvider } from './contexts/DecisionContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Landing } from './pages/Landing';
import { DecisionFlow } from './pages/DecisionFlow';
import { Results } from './pages/Results';
import { Report } from './pages/Report';
import './styles/globals.css';

function App() {
  return (
    <UserProvider>
      <DecisionProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/decision" element={<DecisionFlow />} />
                <Route path="/results" element={<Results />} />
                <Route path="/report" element={<Report />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </DecisionProvider>
    </UserProvider>
  );
}

export default App;