import React from 'react';
import { Split, ArrowRight, Check, FileText } from 'lucide-react';
import { CorrectionChange } from '../types';

interface BeforeAfterComparisonProps {
  originalText: string;
  correctedText: string;
  changes: CorrectionChange[];
}

export const BeforeAfterComparison: React.FC<BeforeAfterComparisonProps> = ({
  originalText,
  correctedText,
  changes,
}) => {
  // Utility to render text with highlighted corrections
  const renderHighlightedCorrected = () => {
    if (!changes || changes.length === 0) {
      return <span>{correctedText}</span>;
    }

    // Replace occurrences of change suggestions with highlighted spans
    let textParts: { text: string; isHighlight: boolean; change?: CorrectionChange }[] = [
      { text: correctedText, isHighlight: false },
    ];

    changes.forEach((change) => {
      if (!change.suggestion) return;
      const nextParts: typeof textParts = [];

      textParts.forEach((part) => {
        if (part.isHighlight) {
          nextParts.push(part);
          return;
        }

        const idx = part.text.indexOf(change.suggestion);
        if (idx !== -1) {
          const before = part.text.substring(0, idx);
          const match = part.text.substring(idx, idx + change.suggestion.length);
          const after = part.text.substring(idx + change.suggestion.length);

          if (before) nextParts.push({ text: before, isHighlight: false });
          nextParts.push({ text: match, isHighlight: true, change });
          if (after) nextParts.push({ text: after, isHighlight: false });
        } else {
          nextParts.push(part);
        }
      });

      textParts = nextParts;
    });

    return (
      <p className="whitespace-pre-wrap leading-relaxed text-slate-800 text-sm">
        {textParts.map((p, index) =>
          p.isHighlight ? (
            <mark
              key={index}
              className="bg-purple-100 text-purple-900 border-b-2 border-purple-400 font-semibold px-1 rounded-sm cursor-help transition-all hover:bg-purple-200"
              title={`Changed from "${p.change?.original}": ${p.change?.explanation}`}
            >
              {p.text}
            </mark>
          ) : (
            <span key={index}>{p.text}</span>
          )
        )}
      </p>
    );
  };

  const renderHighlightedOriginal = () => {
    if (!changes || changes.length === 0) {
      return <span>{originalText}</span>;
    }

    let textParts: { text: string; isHighlight: boolean; change?: CorrectionChange }[] = [
      { text: originalText, isHighlight: false },
    ];

    changes.forEach((change) => {
      if (!change.original) return;
      const nextParts: typeof textParts = [];

      textParts.forEach((part) => {
        if (part.isHighlight) {
          nextParts.push(part);
          return;
        }

        const idx = part.text.indexOf(change.original);
        if (idx !== -1) {
          const before = part.text.substring(0, idx);
          const match = part.text.substring(idx, idx + change.original.length);
          const after = part.text.substring(idx + change.original.length);

          if (before) nextParts.push({ text: before, isHighlight: false });
          nextParts.push({ text: match, isHighlight: true, change });
          if (after) nextParts.push({ text: after, isHighlight: false });
        } else {
          nextParts.push(part);
        }
      });

      textParts = nextParts;
    });

    return (
      <p className="whitespace-pre-wrap leading-relaxed text-slate-700 text-sm">
        {textParts.map((p, index) =>
          p.isHighlight ? (
            <mark
              key={index}
              className="bg-pink-100 text-pink-900 line-through border-b-2 border-pink-300 px-1 rounded-sm transition-all"
              title={`Replaced with "${p.change?.suggestion}"`}
            >
              {p.text}
            </mark>
          ) : (
            <span key={index}>{p.text}</span>
          )
        )}
      </p>
    );
  };

  return (
    <div className="mt-6 pt-6 border-t border-purple-100/80">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <Split className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-wide">Before & After Comparison</h3>
            <p className="text-xs text-slate-500">Side-by-side view with minimal pastel highlights showing exact modifications.</p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60 hidden sm:inline-block">
          {changes.length} {changes.length === 1 ? 'change highlighted' : 'changes highlighted'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* BEFORE BOX */}
        <div className="bg-rose-50/40 rounded-2xl p-4 sm:p-5 border border-pink-100 relative">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-pink-100/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
              <span className="text-xs font-bold text-pink-950 uppercase tracking-wider">Before (Original Text)</span>
            </div>
            <span className="text-[11px] font-medium text-pink-700 bg-pink-100/80 px-2 py-0.5 rounded-md border border-pink-200/60">
              Raw Draft
            </span>
          </div>
          {renderHighlightedOriginal()}
        </div>

        {/* AFTER BOX */}
        <div className="bg-purple-50/40 rounded-2xl p-4 sm:p-5 border border-purple-100 relative">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-purple-100/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <span className="text-xs font-bold text-purple-950 uppercase tracking-wider">After (Corrected Text)</span>
            </div>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-md border border-purple-200/60 flex items-center gap-1">
              <Check className="w-3 h-3 text-purple-600" />
              AI Polished
            </span>
          </div>
          {renderHighlightedCorrected()}
        </div>
      </div>
    </div>
  );
};
