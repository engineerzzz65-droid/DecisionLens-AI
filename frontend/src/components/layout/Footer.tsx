import React from 'react';
import { Brain, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Brain className="w-6 h-6 text-primary-400" />
            <span className="text-lg font-semibold">DecisionLens AI</span>
            <span className="text-xs bg-primary-600 px-2 py-1 rounded-full">v1.0</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>DecisionLens AI — USAII Global AI Hackathon 2026</p>
          <p className="mt-1">
            <span className="text-yellow-400">⚠️</span> For informational purposes only. 
            You are responsible for your own decisions.
          </p>
        </div>
      </div>
    </footer>
  );
};