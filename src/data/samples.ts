import { ModeOption, SampleSnippet } from '../types';

export const MODES: ModeOption[] = [
  {
    id: 'standard',
    label: 'Standard',
    description: 'Fixes spelling, grammar, and punctuation while preserving your voice.',
    iconName: 'Sparkles',
  },
  {
    id: 'professional',
    label: 'Professional',
    description: 'Refines tone for executive emails, client updates, and formal reports.',
    iconName: 'Briefcase',
  },
  {
    id: 'casual',
    label: 'Casual',
    description: 'Makes tone friendly, approachable, and smooth to read.',
    iconName: 'MessageSquare',
  },
  {
    id: 'academic',
    label: 'Academic',
    description: 'Elevates vocabulary, precision, and formal academic structure.',
    iconName: 'GraduationCap',
  },
  {
    id: 'concise',
    label: 'Concise',
    description: 'Eliminates wordiness, fluff, and redundancy for maximum impact.',
    iconName: 'Zap',
  },
];

export const SAMPLE_SNIPPETS: SampleSnippet[] = [
  {
    id: 'sample-1',
    title: 'Messy Email',
    badge: 'Spelling & Grammar',
    mode: 'standard',
    text: "Hi team, teh project update meeting is postponed due to the fact that we recieved thier figures late. Also, your welcome to review the draft document attached.",
  },
  {
    id: 'sample-2',
    title: 'Cluttered Pitch',
    badge: 'Conciseness',
    mode: 'concise',
    text: "At this point in time, in order to facilitate a decision regarding the strategy, we should conduct a comprehensive evaluation of all possible options.",
  },
  {
    id: 'sample-3',
    title: 'Client Proposal',
    badge: 'Professional',
    mode: 'professional',
    text: "Hey John, thanks for reaching out. We wanna move fast on this deal so let us know when you guys can hop on a quick call to wrap things up.",
  },
  {
    id: 'sample-4',
    title: 'Research Draft',
    badge: 'Academic',
    mode: 'academic',
    text: "This paper is basically about how machine learning algorithms can make medical diagnosis way faster and more accurate than older ways.",
  },
  {
    id: 'sample-5',
    title: 'ESL Note',
    badge: 'Fluency',
    mode: 'esl',
    text: "I am writing for inform you that I have arrive to the office yesterday and I am waiting your response for start the onboarding process.",
  },
];

export const LANGUAGES = [
  'English (US)',
  'English (UK)',
  'English (Canada/Aus)',
  'Spanish',
  'French',
  'German',
  'Portuguese',
  'Italian',
];
