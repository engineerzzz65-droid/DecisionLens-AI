import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Home, FileText, User, LogOut, Menu } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-100/70">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-900">DecisionLens</div>
              <div className="text-xs uppercase tracking-[0.25em] text-primary-600 font-semibold">AI clarity</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Home</Link>
            <Link to="/decision" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">New Decision</Link>
            <Link to="/report" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Report</Link>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">
              <User className="w-4 h-4 text-primary-600" />
              {user?.name || 'Guest'}
            </span>
            {user ? (
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
              >
                Logout
              </button>
            ) : (
              <button onClick={() => navigate('/decision')} className="btn-primary">Start Decision</button>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200">
            <nav className="flex flex-col gap-3">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="rounded-2xl px-4 py-3 text-slate-700 hover:bg-slate-100 transition-colors">Home</Link>
              <Link to="/decision" onClick={() => setIsMenuOpen(false)} className="rounded-2xl px-4 py-3 text-slate-700 hover:bg-slate-100 transition-colors">New Decision</Link>
              <Link to="/report" onClick={() => setIsMenuOpen(false)} className="rounded-2xl px-4 py-3 text-slate-700 hover:bg-slate-100 transition-colors">Report</Link>
              <button
                onClick={() => {
                  navigate('/decision');
                  setIsMenuOpen(false);
                }}
                className="rounded-2xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
              >
                Start Decision
              </button>
              {user && (
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                    setIsMenuOpen(false);
                  }}
                  className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors"
                >
                  Logout
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
