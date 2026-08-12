import React from 'react';
import { Edit3, Cpu, Sparkles, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section className="w-full my-8 bg-white/80 backdrop-blur-md rounded-3xl border border-purple-100/90 shadow-sm p-6 sm:p-8">
      <div className="text-center max-w-xl mx-auto mb-6">
        <span className="text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
          Simple 3-Step Process
        </span>
        <h3 className="text-lg font-extrabold text-slate-900 mt-2">How SmartCorrect AI Works</h3>
        <p className="text-xs text-slate-500 mt-1">
          Instant, intelligent proofreading and style optimization powered by Gemini AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {/* Step 1 */}
        <div className="bg-purple-50/40 p-5 rounded-2xl border border-purple-100/80 flex flex-col items-center text-center relative group hover:bg-purple-50/80 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center mb-3 shadow-2xs border border-purple-200/60">
            <Edit3 className="w-5 h-5 stroke-[2]" />
          </div>
          <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider block mb-1">
            Step 1
          </span>
          <h4 className="text-xs font-bold text-slate-900">Type Your Text</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Paste your draft into the editor, select a writing goal (e.g. Standard, Professional, Concise), and press <strong className="text-purple-700 font-semibold">Ctrl+Enter</strong>.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-pink-50/40 p-5 rounded-2xl border border-pink-100/80 flex flex-col items-center text-center relative group hover:bg-pink-50/80 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-700 font-extrabold flex items-center justify-center mb-3 shadow-2xs border border-pink-200/60">
            <Cpu className="w-5 h-5 stroke-[2]" />
          </div>
          <span className="text-[10px] font-extrabold text-pink-600 uppercase tracking-wider block mb-1">
            Step 2
          </span>
          <h4 className="text-xs font-bold text-slate-900">AI Analyzes Mistakes</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Gemini AI detects spelling errors, subject-verb disagreements, punctuation flaws, and awkward phrasing in seconds.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-purple-50/40 p-5 rounded-2xl border border-purple-100/80 flex flex-col items-center text-center relative group hover:bg-purple-50/80 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 text-white font-extrabold flex items-center justify-center mb-3 shadow-md shadow-purple-500/20">
            <Sparkles className="w-5 h-5 stroke-[2]" />
          </div>
          <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider block mb-1">
            Step 3
          </span>
          <h4 className="text-xs font-bold text-slate-900">Get Improved Text</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Review detailed scores, before & after comparisons, short explanations, and copy or replace your draft with 1 click.
          </p>
        </div>
      </div>
    </section>
  );
};
