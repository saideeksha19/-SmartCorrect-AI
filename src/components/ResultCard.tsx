import React, { useState } from 'react';
import {
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  Sparkles,
  Download,
  Filter,
  Layers,
  Split,
  FileText,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { CorrectionResponse, CorrectionChange } from '../types';
import { ScoresWidget } from './ScoresWidget';
import { BeforeAfterComparison } from './BeforeAfterComparison';
import { AIAnalysis } from './AIAnalysis';

interface ResultCardProps {
  result: CorrectionResponse | null;
  originalText: string;
  onCopyText: (text: string) => void;
  onReplaceOriginal: (text: string) => void;
  isLoading: boolean;
  errorMessage?: string | null;
  onTryAgain?: () => void;
  onClear?: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  originalText,
  onCopyText,
  onReplaceOriginal,
  isLoading,
  errorMessage,
  onTryAgain,
  onClear,
}) => {
  const [viewMode, setViewMode] = useState<'polished' | 'diff' | 'sideBySide'>('polished');
  const [copied, setCopied] = useState(false);
  const [replaced, setReplaced] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [activeChangeStates, setActiveChangeStates] = useState<Record<string, 'accepted' | 'rejected'>>({});

  // If loading, show processing state
  if (isLoading) {
    return (
      <div className="w-full bg-white/90 backdrop-blur-md rounded-3xl border border-purple-100/90 shadow-xl shadow-purple-900/5 p-8 text-center my-6">
        <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-purple-50 text-purple-600 mb-4 animate-bounce border border-purple-100">
          <Sparkles className="w-8 h-8 stroke-[2]" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Gemini AI is analyzing your text...</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Detecting spelling, grammar rules, punctuation, sentence structure, and tone alignment.
        </p>
        <div className="w-48 bg-slate-100 h-1.5 rounded-full mx-auto mt-6 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 h-full w-full rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  // Error state
  if (errorMessage) {
    return (
      <div className="w-full bg-rose-50/80 backdrop-blur-md rounded-3xl border border-rose-200 shadow-sm p-6 sm:p-8 my-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-3">
          <AlertTriangle className="w-6 h-6 stroke-[2]" />
        </div>
        <h3 className="text-sm font-bold text-rose-950">Correction Request Error</h3>
        <p className="text-xs text-rose-700 max-w-md mx-auto mt-1 leading-relaxed">
          {errorMessage}
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          {onTryAgain && (
            <button
              id="error-try-again-btn"
              onClick={onTryAgain}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          )}
          {onClear && (
            <button
              onClick={onClear}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-100 hover:bg-rose-200/80 transition-all"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    );
  }

  // Empty state (no result yet)
  if (!result) {
    return (
      <div className="w-full bg-white/80 backdrop-blur-md rounded-3xl border border-dashed border-purple-200/80 shadow-sm p-8 sm:p-12 text-center my-6 transition-all">
        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-500 mx-auto flex items-center justify-center mb-4 border border-purple-100">
          <FileText className="w-7 h-7 stroke-[1.8]" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Corrected Text Will Appear Here</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed">
          Type or paste your text above, choose a tone goal, and click <strong className="text-purple-700">Correct My Text</strong> to receive AI proofreading results.
        </p>

        {/* Feature Highlights Grid in Empty State */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto mt-6 pt-6 border-t border-purple-50">
          <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100/50 text-left">
            <span className="text-xs font-bold text-purple-900 block">Instant Proofreading</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Detects spelling, grammar, and punctuation</span>
          </div>
          <div className="p-3 rounded-xl bg-pink-50/50 border border-pink-100/50 text-left">
            <span className="text-xs font-bold text-pink-900 block">Writing Quality Score</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Spelling, grammar, clarity, & punctuation</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100/50 text-left">
            <span className="text-xs font-bold text-amber-900 block">Before & After</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Clear side-by-side comparison view</span>
          </div>
        </div>
      </div>
    );
  }

  // Handle building the dynamic text based on accepted/rejected changes
  const changes = result.changes || [];

  const handleToggleChange = (id: string, status: 'accepted' | 'rejected') => {
    setActiveChangeStates((prev) => ({
      ...prev,
      [id]: prev[id] === status ? 'accepted' : status,
    }));
  };

  // Compute final effective corrected text applying accepted/rejected choices
  let computedText = result.correctedText;
  if (Object.keys(activeChangeStates).length > 0) {
    let tempText = result.correctedText;
    changes.forEach((c) => {
      if (activeChangeStates[c.id] === 'rejected') {
        // Replace the suggestion back with the original
        tempText = tempText.replace(c.suggestion, c.original);
      }
    });
    computedText = tempText;
  }

  const handleCopy = () => {
    onCopyText(computedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReplace = () => {
    onReplaceOriginal(computedText);
    setReplaced(true);
    setTimeout(() => setReplaced(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([computedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'smartcorrect-output.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div id="corrected-text-result" className="w-full my-6 transition-all">
      {/* 1. Writing Quality Score Widget */}
      {result.scores && <ScoresWidget scores={result.scores} />}

      {/* 2. Main Result Card with Polished Output & Action Buttons */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-purple-100/90 shadow-xl shadow-purple-900/5 p-5 sm:p-6 mb-6">
        {/* Notice if fallbacked */}
        {result.isFallback && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {result.errorNotice || "Offline polish mode applied. API key configuration required for deep Gemini analysis."}
            </span>
          </div>
        )}

        {/* Header Summary & View Mode Toggles */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
              <h3 className="text-sm font-bold text-slate-900">Corrected Text Output</h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60">
                {changes.length} {changes.length === 1 ? 'mistake detected' : 'mistakes detected'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              {result.overallSummary}
            </p>
          </div>

          {/* View Mode Switcher Buttons */}
          <div className="flex items-center p-1 bg-slate-100/80 rounded-xl border border-slate-200/80 self-start sm:self-center">
            <button
              id="view-mode-polished"
              onClick={() => setViewMode('polished')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'polished'
                  ? 'bg-white text-purple-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Polished
            </button>
            <button
              id="view-mode-side-by-side"
              onClick={() => setViewMode('sideBySide')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'sideBySide'
                  ? 'bg-white text-purple-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              Compare
            </button>
          </div>
        </div>

        {/* Content Box Views */}
        <div className="my-4">
          {viewMode === 'polished' ? (
            <div className="relative group">
              <div className="w-full min-h-[140px] p-4 text-slate-800 text-sm sm:text-base bg-purple-50/30 rounded-2xl border border-purple-100 leading-relaxed font-sans whitespace-pre-wrap selection:bg-purple-200">
                {computedText}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-rose-50/30 rounded-2xl border border-rose-100">
                <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block mb-2">
                  Original Draft
                </span>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {originalText}
                </p>
              </div>
              <div className="p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-2">
                  Polished Result
                </span>
                <p className="text-sm text-slate-800 font-medium whitespace-pre-wrap leading-relaxed">
                  {computedText}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="bg-slate-100 px-2.5 py-1 rounded-lg">
              {computedText.trim().split(/\s+/).filter(Boolean).length} words
            </span>
            <span className="bg-slate-100 px-2.5 py-1 rounded-lg">
              {computedText.length} characters
            </span>
          </div>

          <div className="flex items-center flex-wrap justify-end gap-2">
            {onTryAgain && (
              <button
                id="try-again-btn"
                onClick={onTryAgain}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 border border-slate-200/80 transition-all flex items-center gap-1.5"
                title="Re-analyze text with Gemini"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                Try Again
              </button>
            )}

            <button
              id="download-text-btn"
              onClick={handleDownload}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 border border-slate-200/80 transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Download .TXT
            </button>

            {/* REPLACE ORIGINAL BUTTON */}
            <button
              id="replace-original-btn"
              onClick={handleReplace}
              className="px-4 py-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 transition-all flex items-center gap-1.5 shadow-xs hover:border-purple-300"
            >
              {replaced ? (
                <>
                  <Check className="w-4 h-4 text-purple-700" />
                  <span>Replaced!</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
                  <span>Replace Original</span>
                </>
              )}
            </button>

            {/* COPY CORRECTED TEXT BUTTON */}
            <button
              id="copy-corrected-text-btn"
              onClick={handleCopy}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/20 transition-all flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-purple-100" />
                  <span>Copy Corrected Text</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3. Before & After Comparison */}
        <BeforeAfterComparison
          originalText={originalText}
          correctedText={computedText}
          changes={changes}
        />

        {/* 4. AI Analysis Section (Spelling, Grammar, Punctuation with AI explanations) */}
        <AIAnalysis
          changes={changes}
          activeChangeStates={activeChangeStates}
          onToggleChange={handleToggleChange}
        />

        {/* Actionable Insights / Coaching Tips */}
        {result.insights && result.insights.length > 0 && (
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-purple-50/60 via-pink-50/40 to-amber-50/40 border border-purple-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Writing Coach Tips
            </h4>
            <ul className="space-y-1 text-xs text-slate-600">
              {result.insights.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
