export type CorrectionType = 'spelling' | 'grammar' | 'punctuation' | 'clarity' | 'vocabulary' | 'style';

export type ModeOption = {
  id: string;
  label: string;
  description: string;
  iconName: string;
};

export interface CorrectionChange {
  id: string;
  type: CorrectionType;
  original: string;
  suggestion: string;
  explanation: string;
  offset?: number;
  status?: 'accepted' | 'rejected' | 'pending';
}

export interface CorrectionScores {
  spelling: number;
  grammar: number;
  clarity: number;
  punctuation: number;
  overall: number;
  correctness?: number;
  toneRating?: string;
  readabilityGrade?: string;
}

export interface CorrectionResponse {
  correctedText: string;
  changes: CorrectionChange[];
  overallSummary: string;
  scores: CorrectionScores;
  insights: string[];
  isFallback?: boolean;
  errorNotice?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  originalText: string;
  correctedText: string;
  mode: string;
  changeCount: number;
  correctnessScore: number;
}

export interface SampleSnippet {
  id: string;
  title: string;
  badge: string;
  text: string;
  mode: string;
}
