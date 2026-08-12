import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ModeSelector } from './components/ModeSelector';
import { TextEditor } from './components/TextEditor';
import { ResultCard } from './components/ResultCard';
import { RecentCorrections } from './components/RecentCorrections';
import { HowItWorks } from './components/HowItWorks';
import { HistoryDrawer } from './components/HistoryDrawer';
import { Toast } from './components/Toast';
import { CorrectionResponse, HistoryItem, SampleSnippet } from './types';
import { Sparkles, Shield, Zap, CheckCircle2, Award } from 'lucide-react';

export default function App() {
  const [inputText, setInputText] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<string>('standard');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English (US)');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<CorrectionResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasValidationError, setHasValidationError] = useState<boolean>(false);
  const [originalDraft, setOriginalDraft] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);

  // Load history from localStorage on startup
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('smartcorrect_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Failed to parse history from localStorage', e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setIsToastOpen(true);
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setErrorMessage(null);
    setHasValidationError(false);
    setOriginalDraft('');
  };

  const handleResetAll = () => {
    setInputText('');
    setSelectedMode('standard');
    setResult(null);
    setErrorMessage(null);
    setHasValidationError(false);
    setOriginalDraft('');
    showToast('Reset to initial state');
  };

  const handleSelectSample = (snippet: SampleSnippet) => {
    setInputText(snippet.text);
    setSelectedMode(snippet.mode || 'standard');
    setResult(null);
    setErrorMessage(null);
    setHasValidationError(false);
    showToast(`Loaded sample: ${snippet.title}`);
  };

  const handleCorrectText = async () => {
    // Empty input validation
    if (!inputText.trim()) {
      setHasValidationError(true);
      showToast('Please type or paste some text before clicking Correct My Text.');
      return;
    }

    setHasValidationError(false);
    setIsLoading(true);
    setErrorMessage(null);
    setOriginalDraft(inputText);

    try {
      const response = await fetch('/api/correct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          mode: selectedMode,
          language: selectedLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: CorrectionResponse = await response.json();
      setResult(data);

      // Save to history
      const newHistoryItem: HistoryItem = {
        id: `h-${Date.now()}`,
        timestamp: Date.now(),
        originalText: inputText,
        correctedText: data.correctedText,
        mode: selectedMode,
        changeCount: data.changes ? data.changes.length : 0,
        correctnessScore: data.scores ? data.scores.correctness : 90,
      };

      const updatedHistory = [newHistoryItem, ...history].slice(0, 20);
      setHistory(updatedHistory);
      try {
        localStorage.setItem('smartcorrect_history', JSON.stringify(updatedHistory));
      } catch (err) {
        console.warn('Could not save to localStorage', err);
      }

      showToast('Text corrected successfully!');

      // Scroll smoothly to results card
      setTimeout(() => {
        const el = document.getElementById('corrected-text-result');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

    } catch (err: any) {
      console.error('Error correcting text:', err);
      setErrorMessage('Failed to connect to correction service. Please check your network and try again.');
      showToast('Correction failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Corrected text copied to clipboard!');
  };

  const handleReplaceOriginal = (text: string) => {
    setInputText(text);
    setHasValidationError(false);
    showToast('Replaced original text with corrected version!');
    // Scroll back to text editor
    const el = document.getElementById('input-text-editor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus();
    }
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setInputText(item.originalText);
    setSelectedMode(item.mode);
    setResult(null);
    showToast('Loaded text snippet from history');
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('smartcorrect_history');
    } catch (e) {
      console.warn('Could not clear history', e);
    }
    showToast('History cleared');
  };

  return (
    <div className="min-h-screen bg-[#fcfbfe] text-slate-800 font-sans selection:bg-purple-200 selection:text-purple-900 flex flex-col relative overflow-x-hidden">
      {/* Background Subtle Pastel Glow Accents */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none z-0 overflow-hidden opacity-60">
        <div className="absolute -top-32 -left-20 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute top-40 left-1/3 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl" />
      </div>

      {/* Top Navbar */}
      <Navbar
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={(lang) => {
          setSelectedLanguage(lang);
          showToast(`Language set to ${lang}`);
        }}
        onResetAll={handleResetAll}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Main Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200/80 text-purple-700 text-xs font-bold shadow-xs mb-4">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Smart AI Proofreader & Style Enhancer</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none mb-3 font-sans">
            Write Better. <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500">Type Smarter.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl mx-auto">
            AI-powered autocorrection for better spelling, grammar and clarity.
          </p>
        </div>

        {/* Goal & Tone Selector */}
        <ModeSelector
          selectedMode={selectedMode}
          onSelectMode={(modeId) => setSelectedMode(modeId)}
        />

        {/* Text Input Editor */}
        <TextEditor
          inputText={inputText}
          onChangeText={(text) => {
            setInputText(text);
            if (hasValidationError && text.trim()) {
              setHasValidationError(false);
            }
          }}
          onClear={handleClear}
          onCorrect={handleCorrectText}
          isLoading={isLoading}
          onSelectSample={handleSelectSample}
          hasValidationError={hasValidationError}
        />

        {/* Corrected Text Result Output */}
        <ResultCard
          result={result}
          originalText={originalDraft}
          onCopyText={handleCopyText}
          onReplaceOriginal={handleReplaceOriginal}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onTryAgain={handleCorrectText}
          onClear={handleClear}
        />

        {/* Recent Corrections (localStorage) */}
        <RecentCorrections
          history={history}
          onSelectHistoryItem={handleSelectHistoryItem}
          onClearHistory={handleClearHistory}
          onCopyText={handleCopyText}
        />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Feature Value Props Section */}
        <section className="mt-12 pt-8 border-t border-purple-100/80 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          <div className="p-4 rounded-2xl bg-white/70 border border-purple-100/60 shadow-xs flex items-start gap-3">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 shrink-0">
              <Shield className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Grammar & Spelling Guard</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Catches subtle misspellings, typos, misplaced commas, and subject-verb disagreements instantly.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 border border-purple-100/60 shadow-xs flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 shrink-0">
              <Zap className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Conciseness & Flow</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Removes redundant wordiness and filler phrases so your thoughts communicate with punchy impact.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 border border-purple-100/60 shadow-xs flex items-start gap-3">
            <div className="p-2 rounded-xl bg-pink-50 text-pink-600 shrink-0">
              <Award className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Tone Control</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Switch effortlessly between executive professional tone, academic clarity, or friendly conversational flow.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white/60 border-t border-purple-100/80 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">SmartCorrect AI</span>
            <span>—</span>
            <span>Write with confidence and clarity</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Powered by Gemini AI • Light, Clean & Fast
          </p>
        </div>
      </footer>

      {/* History Drawer Modal */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        isOpen={isToastOpen}
        onClose={() => setIsToastOpen(false)}
      />
    </div>
  );
}
