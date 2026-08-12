import React from 'react';
import { Award, SpellCheck, CheckCircle2, Eye, Type, Compass, BookOpen } from 'lucide-react';
import { CorrectionScores } from '../types';

interface ScoresWidgetProps {
  scores: CorrectionScores;
}

export const ScoresWidget: React.FC<ScoresWidgetProps> = ({ scores }) => {
  const overall = scores.overall ?? scores.correctness ?? 90;
  const spelling = scores.spelling ?? 95;
  const grammar = scores.grammar ?? 90;
  const clarity = scores.clarity ?? 88;
  const punctuation = scores.punctuation ?? 92;

  const getScoreBadgeColor = (val: number) => {
    if (val >= 90) return 'text-purple-700 bg-purple-50 border-purple-200/80';
    if (val >= 75) return 'text-pink-700 bg-pink-50 border-pink-200/80';
    return 'text-amber-700 bg-amber-50 border-amber-200/80';
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-purple-100/90 shadow-xl shadow-purple-900/5 p-5 sm:p-6 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-purple-100/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100/80">
            <Award className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-wide">Writing Quality Score</h3>
            <p className="text-xs text-slate-500">AI quality breakdown based on spelling, grammar, clarity, and punctuation.</p>
          </div>
        </div>

        {/* Overall Score Highlight Badge */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border border-purple-200/70 px-4 py-2 rounded-2xl shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Overall Score</span>
            <span className="text-xs font-semibold text-purple-900">
              {overall >= 90 ? 'Excellent' : overall >= 75 ? 'Good Quality' : 'Needs Review'}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 text-white flex items-center justify-center font-extrabold text-lg shadow-md shadow-purple-500/20">
            {overall}
          </div>
        </div>
      </div>

      {/* Grid of Scores */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Spelling */}
        <div className="bg-slate-50/60 rounded-2xl p-3.5 border border-purple-100/60 transition-all hover:bg-white hover:shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <SpellCheck className="w-4 h-4 text-purple-600" />
              <span>Spelling</span>
            </div>
            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-lg border ${getScoreBadgeColor(spelling)}`}>
              {spelling}%
            </span>
          </div>
          <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${spelling}%` }}
            />
          </div>
        </div>

        {/* Grammar */}
        <div className="bg-slate-50/60 rounded-2xl p-3.5 border border-purple-100/60 transition-all hover:bg-white hover:shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-pink-600" />
              <span>Grammar</span>
            </div>
            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-lg border ${getScoreBadgeColor(grammar)}`}>
              {grammar}%
            </span>
          </div>
          <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-pink-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${grammar}%` }}
            />
          </div>
        </div>

        {/* Clarity */}
        <div className="bg-slate-50/60 rounded-2xl p-3.5 border border-purple-100/60 transition-all hover:bg-white hover:shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Eye className="w-4 h-4 text-amber-600" />
              <span>Clarity</span>
            </div>
            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-lg border ${getScoreBadgeColor(clarity)}`}>
              {clarity}%
            </span>
          </div>
          <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${clarity}%` }}
            />
          </div>
        </div>

        {/* Punctuation */}
        <div className="bg-slate-50/60 rounded-2xl p-3.5 border border-purple-100/60 transition-all hover:bg-white hover:shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Type className="w-4 h-4 text-indigo-600" />
              <span>Punctuation</span>
            </div>
            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-lg border ${getScoreBadgeColor(punctuation)}`}>
              {punctuation}%
            </span>
          </div>
          <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${punctuation}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tone & Readability Pills if present */}
      {(scores.toneRating || scores.readabilityGrade) && (
        <div className="flex items-center flex-wrap gap-2.5 mt-4 pt-3 border-t border-slate-100 text-xs">
          {scores.toneRating && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200/60 font-medium">
              <Compass className="w-3.5 h-3.5 text-purple-600" />
              <span>Tone: <strong>{scores.toneRating}</strong></span>
            </div>
          )}
          {scores.readabilityGrade && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-800 border border-pink-200/60 font-medium">
              <BookOpen className="w-3.5 h-3.5 text-pink-600" />
              <span>Readability: <strong>{scores.readabilityGrade}</strong></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
