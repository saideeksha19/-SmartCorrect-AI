import React from 'react';
import { SpellCheck, CheckCircle2, Type, Sparkles, HelpCircle, Check, Lightbulb } from 'lucide-react';
import { CorrectionChange } from '../types';

interface AIAnalysisProps {
  changes: CorrectionChange[];
  activeChangeStates: Record<string, 'accepted' | 'rejected'>;
  onToggleChange: (id: string, status: 'accepted' | 'rejected') => void;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({
  changes,
  activeChangeStates,
  onToggleChange,
}) => {
  const spellingChanges = changes.filter((c) => c.type === 'spelling');
  const grammarChanges = changes.filter((c) => c.type === 'grammar');
  const punctuationChanges = changes.filter((c) => c.type === 'punctuation');
  const otherChanges = changes.filter(
    (c) => c.type !== 'spelling' && c.type !== 'grammar' && c.type !== 'punctuation'
  );

  const renderCategoryBlock = (
    title: string,
    icon: React.ReactNode,
    items: CorrectionChange[],
    badgeColor: string,
    emptyMessage: string
  ) => {
    return (
      <div className="bg-slate-50/70 rounded-2xl p-4 border border-purple-100/80 shadow-2xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-purple-100/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white shadow-2xs border border-purple-100">{icon}</div>
            <h4 className="text-xs font-bold text-slate-800 tracking-wide uppercase">{title}</h4>
          </div>
          <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${badgeColor}`}>
            {items.length} {items.length === 1 ? 'correction' : 'corrections'}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-800 font-medium">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{emptyMessage}</span>
          </div>
        ) : (
          <div className="space-y-2.5">
            {items.map((item) => {
              const status = activeChangeStates[item.id] || 'accepted';
              const isRejected = status === 'rejected';

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border transition-all text-xs ${
                    isRejected
                      ? 'bg-slate-100/80 border-slate-200 opacity-60'
                      : 'bg-white border-purple-100/90 shadow-2xs'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="line-through font-mono text-slate-500 bg-rose-50 border border-rose-200/60 px-2 py-0.5 rounded-md">
                      {item.original}
                    </span>
                    <span className="font-bold text-slate-400">→</span>
                    <span className="font-bold font-mono text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
                      {item.suggestion}
                    </span>
                  </div>

                  {/* Explanation from Gemini */}
                  <div className="flex items-start gap-1.5 text-slate-600 mt-2 bg-purple-50/40 p-2 rounded-lg border border-purple-100/40">
                    <HelpCircle className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed text-[11px] font-medium">{item.explanation}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-6 pt-6 border-t border-purple-100/80">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-wide">AI Analysis & Detailed Breakdown</h3>
          <p className="text-xs text-slate-500">Categorized corrections and short AI explanations for each detected mistake.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Spelling Corrections */}
        {renderCategoryBlock(
          'Spelling Corrections',
          <SpellCheck className="w-4 h-4 text-purple-600" />,
          spellingChanges,
          'bg-purple-50 text-purple-700 border-purple-200',
          'No spelling errors detected!'
        )}

        {/* Grammar Corrections */}
        {renderCategoryBlock(
          'Grammar Corrections',
          <CheckCircle2 className="w-4 h-4 text-pink-600" />,
          grammarChanges,
          'bg-pink-50 text-pink-700 border-pink-200',
          'No grammar errors detected!'
        )}

        {/* Punctuation Corrections */}
        {renderCategoryBlock(
          'Punctuation Corrections',
          <Type className="w-4 h-4 text-indigo-600" />,
          punctuationChanges,
          'bg-indigo-50 text-indigo-700 border-indigo-200',
          'No punctuation errors detected!'
        )}
      </div>

      {/* Other Corrections if present (e.g. clarity/style) */}
      {otherChanges.length > 0 && (
        <div className="mt-4">
          {renderCategoryBlock(
            'Clarity & Phrasing Corrections',
            <Lightbulb className="w-4 h-4 text-amber-600" />,
            otherChanges,
            'bg-amber-50 text-amber-700 border-amber-200',
            'No phrasing issues detected!'
          )}
        </div>
      )}
    </div>
  );
};
