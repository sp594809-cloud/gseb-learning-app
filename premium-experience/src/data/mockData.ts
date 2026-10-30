// Mock data for GANIT Premium prototype
// Replace with real API / textbook inventory once backend is ready

export interface Chapter {
  id: number;
  nameGu: string;
  nameEn: string;
  world: string;
  progress: number; // 0-100
  questionsTotal: number;
  questionsDone: number;
  xpEarned: number;
  color: string;
  icon: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
}

export interface Achievement {
  id: string;
  titleGu: string;
  titleEn: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic';
}

export const chapters: Chapter[] = [
  {
    id: 1,
    nameGu: 'સંબંધ અને વિધેય',
    nameEn: 'Relations and Functions',
    world: 'Connections World',
    progress: 68,
    questionsTotal: 61,
    questionsDone: 42,
    xpEarned: 480,
    color: '#3B82F6',
    icon: '🔗',
    status: 'in-progress',
  },
  {
    id: 2,
    nameGu: 'વિકોણમિતીય પ્રતિવિધેયો',
    nameEn: 'Inverse Trigonometric Functions',
    world: 'Angles World',
    progress: 35,
    questionsTotal: 49,
    questionsDone: 17,
    xpEarned: 210,
    color: '#8B5CF6',
    icon: '📐',
    status: 'in-progress',
  },
  {
    id: 3,
    nameGu: 'શ્રેણિકો',
    nameEn: 'Matrices',
    world: 'Matrix Lab',
    progress: 0,
    questionsTotal: 55,
    questionsDone: 0,
    xpEarned: 0,
    color: '#10B981',
    icon: '⊞',
    status: 'available',
  },
  {
    id: 4,
    nameGu: 'નિર્ધારકો',
    nameEn: 'Determinants',
    world: 'Logic Grid',
    progress: 0,
    questionsTotal: 48,
    questionsDone: 0,
    xpEarned: 0,
    color: '#F59E0B',
    icon: '⊟',
    status: 'locked',
  },
  {
    id: 5,
    nameGu: 'સાતત્ય અને વિકલનીયતા',
    nameEn: 'Continuity and Differentiability',
    world: 'Calculus World',
    progress: 0,
    questionsTotal: 72,
    questionsDone: 0,
    xpEarned: 0,
    color: '#EC4899',
    icon: '∫',
    status: 'locked',
  },
  {
    id: 6,
    nameGu: 'વિકલનના ઉપયોગો',
    nameEn: 'Applications of Derivatives',
    world: 'Motion & Change',
    progress: 0,
    questionsTotal: 65,
    questionsDone: 0,
    xpEarned: 0,
    color: '#06B6D4',
    icon: '📈',
    status: 'locked',
  },
];

export const achievements: Achievement[] = [
  { id: 'first-equation', titleGu: 'પ્રથમ સમીકરણ', titleEn: 'First Equation', description: 'Solve your first practice question', icon: '✏️', unlocked: true, unlockedAt: '2026-10-20', rarity: 'common' },
  { id: 'function-explorer', titleGu: 'વિધેય અન્વેષક', titleEn: 'Function Explorer', description: 'Complete 10 questions in Chapter 1', icon: '🔍', unlocked: true, unlockedAt: '2026-10-22', rarity: 'common' },
  { id: 'seven-day', titleGu: 'સાત-દિવસીય શીખનાર', titleEn: 'Seven-Day Learner', description: 'Practice 7 days in a row', icon: '🔥', unlocked: false, rarity: 'rare' },
  { id: 'matrix-master', titleGu: 'મેટ્રિક્સ માસ્ટર', titleEn: 'Matrix Master', description: 'Complete Matrix Lab chapter', icon: '⊞', unlocked: false, rarity: 'epic' },
  { id: 'calculus-explorer', titleGu: 'કેલ્ક્યુલસ અન્વેષક', titleEn: 'Calculus Explorer', description: 'Start Continuity & Differentiability', icon: '∫', unlocked: false, rarity: 'rare' },
  { id: 'chapter-champion', titleGu: 'પ્રકરણ ચેમ્પિયન', titleEn: 'Chapter Champion', description: 'Finish any full chapter', icon: '🏆', unlocked: false, rarity: 'epic' },
  { id: 'perfect-score', titleGu: 'પરફેક્ટ સ્કોર', titleEn: 'Perfect Score', description: 'Get 10 correct answers in a row', icon: '💯', unlocked: true, unlockedAt: '2026-10-25', rarity: 'rare' },
  { id: 'revision-specialist', titleGu: 'પુનરાવર્તન વિશેષજ્ઞ', titleEn: 'Revision Specialist', description: 'Revise 20 previously incorrect questions', icon: '🔄', unlocked: false, rarity: 'rare' },
  { id: 'early-bird', titleGu: 'સવારનો વિદ્યાર્થી', titleEn: 'Early Bird', description: 'Solve 5 questions before 8 AM', icon: '🌅', unlocked: false, rarity: 'common' },
  { id: 'night-owl', titleGu: 'રાત્રિ અભ્યાસી', titleEn: 'Night Owl', description: 'Solve 5 questions after 10 PM', icon: '🦉', unlocked: false, rarity: 'common' },
  { id: 'xp-500', titleGu: '500 XP', titleEn: 'XP Collector', description: 'Earn 500 total XP', icon: '⭐', unlocked: true, unlockedAt: '2026-10-27', rarity: 'common' },
  { id: 'xp-2000', titleGu: '2000 XP', titleEn: 'XP Master', description: 'Earn 2000 total XP', icon: '🌟', unlocked: false, rarity: 'epic' },
  { id: 'first-attempt', titleGu: 'પ્રથમ પ્રયત્ન', titleEn: 'First Try Hero', description: 'Get 5 correct on first attempt', icon: '🎯', unlocked: true, unlockedAt: '2026-10-23', rarity: 'common' },
  { id: 'hint-free', titleGu: 'સંકેત-મુક્ત', titleEn: 'Hint Free', description: 'Solve 15 questions without using hints', icon: '🧠', unlocked: false, rarity: 'rare' },
  { id: 'daily-challenge', titleGu: 'દૈનિક પડકાર', titleEn: 'Daily Challenger', description: 'Complete 5 daily challenges', icon: '📅', unlocked: false, rarity: 'rare' },
  { id: 'trig-tamer', titleGu: 'ત્રિકોણમિતિ વશ કરનાર', titleEn: 'Trig Tamer', description: 'Complete Inverse Trig chapter', icon: '📐', unlocked: false, rarity: 'epic' },
  { id: 'consistent', titleGu: 'સતત અભ્યાસી', titleEn: 'Consistent Learner', description: 'Practice on 14 different days', icon: '📈', unlocked: false, rarity: 'rare' },
  { id: 'notebook-lover', titleGu: 'નોટબુક પ્રેમી', titleEn: 'Notebook Lover', description: 'Open notebook mode 20 times', icon: '📓', unlocked: false, rarity: 'common' },
  { id: 'graph-guru', titleGu: 'ગ્રાફ ગુરુ', titleEn: 'Graph Guru', description: 'Correctly interpret 10 graphs', icon: '📊', unlocked: false, rarity: 'rare' },
  { id: 'board-ready', titleGu: 'બોર્ડ તૈયાર', titleEn: 'Board Ready', description: 'Complete all 6 chapters', icon: '🎓', unlocked: false, rarity: 'epic' },
];

export const student = {
  name: 'અર્જુન',
  nameEn: 'Arjun',
  level: 7,
  xp: 1240,
  xpToNext: 1600,
  streak: 4,
  questionsToday: 12,
  accuracy: 78,
  totalQuestionsSolved: 59,
};

export const dailyChallenge = {
  id: 'dc-2026-10-29',
  titleGu: 'આજનો પડકાર',
  titleEn: 'Daily Challenge',
  description: 'સંબંધ અને વિધેય — 5 પ્રશ્નો',
  questions: 5,
  xpReward: 40,
  completed: false,
};
