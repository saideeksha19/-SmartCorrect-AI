import React from 'react';
import { Sparkles, History, Languages, RotateCcw, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  onOpenHistory: () => void;
  historyCount: number;
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
  onResetAll: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenHistory,
  historyCount,
  selectedLanguage,
  onSelectLanguage,
  onResetAll,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-purple-100/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-purple-500 to-pink-400 p-0.5 shadow-md shadow-purple-500/15 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-600 stroke-[2.2]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-slate-900 font-sans">
                SmartCorrect <span className="text-purple-600 font-extrabold">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                v2.5 Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">AI Grammar, Spelling & Style Assistant</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <div className="relative group">
            <button
              id="language-select-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 bg-slate-50 hover:bg-purple-50 hover:text-purple-700 border border-slate-200/80 hover:border-purple-200 transition-all"
              title="Target Language"
            >
              <Languages className="w-3.5 h-3.5 text-purple-500" />
              <span className="hidden sm:inline">{selectedLanguage}</span>
            </button>
            <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-purple-100 py-1 hidden group-hover:block z-50 transition-all">
              {['English (US)', 'English (UK)', 'Spanish', 'French', 'German'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => onSelectLanguage(lang)}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-purple-50 hover:text-purple-700 transition-colors ${
                    selectedLanguage === lang ? 'text-purple-700 font-semibold bg-purple-50/50' : 'text-slate-600'
                  }`}
                >
                  {lang}
                  {selectedLanguage === lang && <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* History Button */}
          <button
            id="history-drawer-btn"
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 bg-slate-50 hover:bg-purple-50 hover:text-purple-700 border border-slate-200/80 hover:border-purple-200 transition-all"
            title="Correction History"
          >
            <History className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                {historyCount}
              </span>
            )}
          </button>

          {/* Reset App */}
          <button
            id="reset-app-btn"
            onClick={onResetAll}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Start Fresh"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
