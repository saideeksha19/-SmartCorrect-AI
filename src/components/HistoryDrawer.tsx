import React from 'react';
import { X, Trash2, Clock, ArrowRight, FileText, CheckCircle } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-xs transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-purple-100 flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900">Correction History</h3>
              <span className="text-xs text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full font-semibold">
                {history.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
            {history.length === 0 ? (
              <div className="text-center py-12 px-4">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-xs font-bold text-slate-600">No previous corrections yet</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  When you correct text, past versions will be saved here automatically for easy reference.
                </p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectHistoryItem(item);
                    onClose();
                  }}
                  className="p-4 rounded-2xl border border-slate-200/80 hover:border-purple-300 bg-white hover:bg-purple-50/30 shadow-xs cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                    <span className="font-medium text-slate-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="capitalize px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold border border-purple-100">
                      {item.mode}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-800 line-clamp-2 leading-relaxed">
                    "{item.correctedText}"
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {item.changeCount} fixes made
                    </span>
                    <span className="text-purple-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Load snippet <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {history.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/60">
              <button
                onClick={onClearHistory}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All History
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
