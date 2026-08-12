import React, { useRef, useEffect } from 'react';
import { Sparkles, Trash2, Clock, AlignLeft, Lightbulb, Loader2, ArrowRight } from 'lucide-react';
import { SAMPLE_SNIPPETS } from '../data/samples';
import { SampleSnippet } from '../types';

interface TextEditorProps {
  inputText: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  onCorrect: () => void;
  isLoading: boolean;
  onSelectSample: (snippet: SampleSnippet) => void;
  hasValidationError?: boolean;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  inputText,
  onChangeText,
  onClear,
  onCorrect,
  isLoading,
  onSelectSample,
  hasValidationError,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Compute live statistics
  const trimmed = inputText.trim();
  const characterCount = inputText.length;
  const wordCount = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const sentenceCount = trimmed ? (trimmed.match(/[.!?]+/g) || []).length || (wordCount > 0 ? 1 : 0) : 0;
  const readingTimeSeconds = Math.max(1, Math.ceil(wordCount / 3.5)); // ~210 wpm

  // Keyboard shortcut listener for Ctrl+Enter / Cmd+Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (!isLoading) {
          e.preventDefault();
          onCorrect();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoading, onCorrect]);

  return (
    <div className={`w-full bg-white/90 backdrop-blur-md rounded-3xl border shadow-xl shadow-purple-900/5 p-5 sm:p-6 transition-all duration-200 ${
      hasValidationError ? 'border-rose-400 ring-2 ring-rose-200' : 'border-purple-100/90'
    }`}>
      {/* Editor Header & Sample Snippets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          <span className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
            Input Text
          </span>
          {hasValidationError && (
            <span className="text-xs font-bold text-rose-600 animate-pulse ml-2">
              • Please enter text to correct
            </span>
          )}
        </div>

        {/* Sample Snippet Quick Fill */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-[11px] text-slate-500 flex items-center gap-1 whitespace-nowrap font-medium">
            <Lightbulb className="w-3 h-3 text-amber-500" />
            Try sample:
          </span>
          {SAMPLE_SNIPPETS.map((snippet) => (
            <button
              key={snippet.id}
              id={`sample-btn-${snippet.id}`}
              onClick={() => onSelectSample(snippet)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-purple-50/80 hover:bg-purple-100/80 text-purple-700 border border-purple-200/50 transition-colors whitespace-nowrap"
            >
              {snippet.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Large Textarea */}
      <div className="relative group">
        <textarea
          id="input-text-editor"
          ref={textareaRef}
          value={inputText}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder="Type or paste your text here..."
          className={`w-full h-56 sm:h-64 p-4 text-slate-800 text-sm sm:text-base placeholder-slate-400 rounded-2xl border transition-all resize-y outline-none leading-relaxed font-sans ${
            hasValidationError
              ? 'bg-rose-50/20 border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-100'
              : 'bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border-slate-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100'
          }`}
        />

        {/* Floating Quick Paste / Tip */}
        {inputText.length === 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
            <AlignLeft className="w-8 h-8 text-purple-400 mx-auto mb-2 stroke-[1.5]" />
            <p className="text-xs text-slate-500">Paste your draft or pick a sample above</p>
          </div>
        )}
      </div>

      {/* Footer Controls & Stats Bar */}
      <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
        {/* Word, Character & Time Counters */}
        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1 bg-slate-100/80 px-2.5 py-1 rounded-lg">
            <span className="text-slate-900 font-bold">{wordCount}</span>
            <span>{wordCount === 1 ? 'word' : 'words'}</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100/80 px-2.5 py-1 rounded-lg">
            <span className="text-slate-900 font-bold">{characterCount}</span>
            <span>chars</span>
          </div>

          {wordCount > 0 && (
            <div className="hidden md:flex items-center gap-1 text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
              <Clock className="w-3 h-3" />
              <span>~{readingTimeSeconds}s read</span>
            </div>
          )}
        </div>

        {/* Buttons: Clear & Correct My Text */}
        <div className="flex items-center justify-end gap-2.5">
          {inputText.length > 0 && (
            <button
              id="clear-text-btn"
              type="button"
              onClick={onClear}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          )}

          <button
            id="correct-text-btn"
            type="button"
            onClick={onCorrect}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
              isLoading
                ? 'bg-slate-300 text-slate-600 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-purple-700" />
                <span>Processing with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-pink-200" />
                <span>Correct My Text</span>
                <span className="hidden lg:inline text-[10px] opacity-75 font-mono bg-white/20 px-1.5 py-0.5 rounded">
                  Ctrl+Enter
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
