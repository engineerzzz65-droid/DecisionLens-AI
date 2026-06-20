import React from 'react';
import { Brain, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-200 py-10">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-semibold text-white">DecisionLens AI</div>
                <div className="text-xs uppercase tracking-[0.25em] text-primary-400">Structured clarity</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              AI-assisted decision guidance to help you compare options, weigh tradeoffs, and choose with greater confidence.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400 mb-4">Quick links</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/decision" className="hover:text-white transition-colors">New Decision</a></li>
              <li><a href="/report" className="hover:text-white transition-colors">Clarity Report</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400 mb-4">Connect</h3>
            <div className="flex items-center gap-4 text-slate-300">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-sm text-slate-500 space-y-2">
          <p>DecisionLens AI — designed for thoughtful, transparent decision support.</p>
          <p>This product is for informational purposes only. AI supports the process; you remain in control of the final decision.</p>
        </div>
      </div>
    </footer>
  );
};
