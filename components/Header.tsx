import React from 'react';
import { Sparkles, Gift } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-slate-200 py-4 px-6 shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-christmas-red p-2 rounded-lg text-white">
            <Gift size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">MerryStyle AI</h1>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">Christmas Hat Generator</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a 
            href="https://ai.google.dev/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-semibold text-christmas-green bg-green-50 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors flex items-center gap-1"
          >
            <Sparkles size={12} />
            Powered by Gemini
          </a>
        </div>
      </div>
    </header>
  );
};