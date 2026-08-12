import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { Clock, ArrowRight, Copy, Check, Trash2, RotateCcw } from 'lucide-react';

interface RecentCorrectionsProps {
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onCopyText: (text: string) => void;
}

export const RecentCorrections: React.FC<RecentCorrectionsProps> = ({
  history,
  onSelectHistoryItem,
  onClearHistory,
  onCopyText,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!history || history.length === 0) {
    return null;
  }

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    onCopyText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="w-full my-8 bg-white/90 backdrop-blur-md rounded-3xl border border-purple-100/90 shadow-xl shadow-purple-900/5 p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-purple-100/60">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100/80">
            <Clock className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-wide">Recent Corrections</h3>
            <p className="text-xs text-slate-500">Saved in your browser localStorage for easy reuse.</p>
          </div>
        </div>

        <button
          onClick={onClearHistory}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/60 transition-colors flex items-center gap-1.5 self-start sm:self-center"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Recent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {history.slice(0, 6).map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectHistoryItem(item)}
            className="group bg-slate-50/50 hover:bg-purple-50/30 p-4 rounded-2xl border border-slate-200/80 hover:border-purple-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Header Info */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                <span className="font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100 capitalize">
                  {item.mode}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Original snippet */}
              <div className="mb-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Original</span>
                <p className="text-xs text-slate-500 line-clamp-2 italic">
                  "{item.originalText}"
                </p>
              </div>

              {/* Corrected snippet */}
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-700 block mb-0.5">Corrected</span>
                <p className="text-xs font-semibold text-slate-800 line-clamp-2">
                  "{item.correctedText}"
                </p>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 font-medium">
                {item.changeCount} {item.changeCount === 1 ? 'fix' : 'fixes'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleCopy(e, item.correctedText, item.id)}
                  className="p-1.5 rounded-lg bg-white hover:bg-purple-100 text-slate-600 hover:text-purple-700 border border-slate-200/80 transition-colors"
                  title="Copy corrected text"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>

                <span className="text-[11px] font-bold text-purple-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Load <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
