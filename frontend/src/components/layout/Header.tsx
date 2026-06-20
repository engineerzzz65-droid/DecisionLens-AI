import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Home, FileText, User, LogOut, Menu } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">DecisionLens</span>
            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
              AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            {user && (
              <Link
                to="/decision"
                className="flex items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium"
              >
                <FileText className="w-4 h-4" />
                New Decision
              </Link>
            )}
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary-600" />
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {user?.name || 'Guest'}
                </span>
              </div>
              {user && (
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              {user && (
                <Link
                  to="/decision"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  New Decision
                </Link>
              )}
              <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 mt-2 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-primary-600" />
                  </div>
                  <span className="text-sm text-gray-700">{user?.name || 'Guest'}</span>
                </div>
                {user && (
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                      setIsMenuOpen(false);
                    }}
                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                  >
                    Logout
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};