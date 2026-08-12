import React from 'react';
import { Sparkles, Briefcase, Zap, GraduationCap, MessageSquare, Globe } from 'lucide-react';
import { MODES } from '../data/samples';

interface ModeSelectorProps {
  selectedMode: string;
  onSelectMode: (modeId: string) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  selectedMode,
  onSelectMode,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'Briefcase':
        return <Briefcase className="w-4 h-4 text-purple-600" />;
      case 'Zap':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'GraduationCap':
        return <GraduationCap className="w-4 h-4 text-indigo-600" />;
      case 'MessageSquare':
        return <MessageSquare className="w-4 h-4 text-pink-500" />;
      case 'Globe':
        return <Globe className="w-4 h-4 text-teal-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-semibold text-slate-700 tracking-wide uppercase flex items-center gap-1.5">
          <span>Correction Goal & Tone</span>
        </label>
        <span className="text-[11px] text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
          Tailored AI Optimization
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {MODES.map((mode) => {
          const isSelected = selectedMode === mode.id;
          return (
            <button
              key={mode.id}
              id={`mode-option-${mode.id}`}
              type="button"
              onClick={() => onSelectMode(mode.id)}
              className={`group relative p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-purple-50/90 to-white border-purple-300 shadow-sm shadow-purple-500/10 ring-2 ring-purple-400/30'
                  : 'bg-white/80 hover:bg-purple-50/40 border-slate-200/80 hover:border-purple-200 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-purple-100' : 'bg-slate-100 group-hover:bg-purple-100/60'}`}>
                  {getIcon(mode.iconName)}
                </div>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                )}
              </div>
              <div>
                <h4 className={`text-xs font-bold leading-snug ${isSelected ? 'text-purple-950' : 'text-slate-800'}`}>
                  {mode.label}
                </h4>
                <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-tight font-normal">
                  {mode.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
