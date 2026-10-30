import { SolutionItem } from '../types/solution';
import { getAllSolutions, getSolutionsByChapter } from './content';

export interface QuestionProgress {
  questionId: string;
  chapterNumber: string;
  exerciseNumber: string;
  topic: string;
  attempts: number;
  correctAnswers: number;
  incorrectAnswers: number;
  isCompleted: boolean;
  needsRevision: boolean;
  lastAttemptedAt: string;
}

export interface StudentProfile {
  userId: string;
  isGuest: boolean;
  createdAt: string;
  updatedAt: string;
  bookmarks: string[];
  records: Record<string, QuestionProgress>;
  recentHistory: Array<{ questionId: string; timestamp: string }>;
}

const STORAGE_KEY = 'gseb_student_profile_v2';

export function getDefaultProfile(userId = 'guest-student'): StudentProfile {
  return {
    userId,
    isGuest: userId.startsWith('guest'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    bookmarks: [],
    records: {},
    recentHistory: [],
  };
}

// Retrieve student profile securely (isolated to user storage)
export function getStudentProfile(userId = 'guest-student'): StudentProfile {
  if (typeof window === 'undefined') return getDefaultProfile(userId);
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
    if (raw) {
      return JSON.parse(raw);
    }
    // Check legacy storage migration
    const legacyBookmarks = JSON.parse(localStorage.getItem('gseb-bookmarks') || '[]');
    const legacyCompleted = JSON.parse(localStorage.getItem('gseb-completed') || '[]');
    const profile = getDefaultProfile(userId);
    profile.bookmarks = legacyBookmarks;
    for (const cId of legacyCompleted) {
      profile.records[cId] = {
        questionId: cId,
        chapterNumber: cId.split('-')[0]?.replace('ch', '') || '01',
        exerciseNumber: '1.1',
        topic: 'Completed Lesson',
        attempts: 1,
        correctAnswers: 1,
        incorrectAnswers: 0,
        isCompleted: true,
        needsRevision: false,
        lastAttemptedAt: new Date().toISOString(),
      };
    }
    saveStudentProfile(profile);
    return profile;
  } catch {
    return getDefaultProfile(userId);
  }
}

export function saveStudentProfile(profile: StudentProfile): void {
  if (typeof window === 'undefined') return;
  try {
    profile.updatedAt = new Date().toISOString();
    localStorage.setItem(`${STORAGE_KEY}_${profile.userId}`, JSON.stringify(profile));
  } catch {
    // Ignore quota or private mode error
  }
}

// Record question practice attempt
export function recordStudentAttempt(
  solution: SolutionItem,
  isCorrect: boolean,
  userId = 'guest-student'
): StudentProfile {
  const profile = getStudentProfile(userId);
  const now = new Date().toISOString();
  const existing = profile.records[solution.id] || {
    questionId: solution.id,
    chapterNumber: solution.chapterNumber,
    exerciseNumber: solution.exerciseNumber,
    topic: solution.topic.gu,
    attempts: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    isCompleted: false,
    needsRevision: false,
    lastAttemptedAt: now,
  };

  existing.attempts += 1;
  if (isCorrect) {
    existing.correctAnswers += 1;
    existing.needsRevision = false;
  } else {
    existing.incorrectAnswers += 1;
    existing.needsRevision = true;
  }
  existing.lastAttemptedAt = now;

  profile.records[solution.id] = existing;

  // Add to recent history (limit to 30 entries)
  profile.recentHistory = [
    { questionId: solution.id, timestamp: now },
    ...profile.recentHistory.filter((h) => h.questionId !== solution.id),
  ].slice(0, 30);

  saveStudentProfile(profile);
  return profile;
}

// Toggle learned completion status
export function toggleStudentLearned(
  questionId: string,
  chapterNumber = '01',
  userId = 'guest-student'
): StudentProfile {
  const profile = getStudentProfile(userId);
  const existing = profile.records[questionId] || {
    questionId,
    chapterNumber,
    exerciseNumber: '1.1',
    topic: 'Mathematics',
    attempts: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    isCompleted: false,
    needsRevision: false,
    lastAttemptedAt: new Date().toISOString(),
  };

  existing.isCompleted = !existing.isCompleted;
  profile.records[questionId] = existing;
  saveStudentProfile(profile);
  return profile;
}

// Toggle bookmark
export function toggleStudentBookmark(questionId: string, userId = 'guest-student'): StudentProfile {
  const profile = getStudentProfile(userId);
  if (profile.bookmarks.includes(questionId)) {
    profile.bookmarks = profile.bookmarks.filter((b) => b !== questionId);
  } else {
    profile.bookmarks.push(questionId);
  }
  saveStudentProfile(profile);
  return profile;
}

// Calculate Chapter Mastery
export function getChapterMastery(
  chapterNumber: string,
  userId = 'guest-student'
): {
  totalQuestions: number;
  completedQuestions: number;
  attemptedQuestions: number;
  accuracyRate: number;
  masteryPercentage: number;
} {
  const profile = getStudentProfile(userId);
  const chapterSolutions = getSolutionsByChapter(chapterNumber);
  const total = chapterSolutions.length;

  if (total === 0) {
    return {
      totalQuestions: 0,
      completedQuestions: 0,
      attemptedQuestions: 0,
      accuracyRate: 0,
      masteryPercentage: 0,
    };
  }

  let completed = 0;
  let attempted = 0;
  let correct = 0;
  let totalAttempts = 0;

  for (const sol of chapterSolutions) {
    const rec = profile.records[sol.id];
    if (rec) {
      if (rec.isCompleted) completed++;
      if (rec.attempts > 0) {
        attempted++;
        correct += rec.correctAnswers;
        totalAttempts += rec.attempts;
      }
    }
  }

  const accuracy = totalAttempts > 0 ? Math.round((correct / totalAttempts) * 100) : 0;
  // Transparent scoring rule: 60% completion weight + 40% accuracy weight
  const completionRatio = completed / total;
  const accuracyRatio = totalAttempts > 0 ? correct / totalAttempts : 0;
  const mastery = Math.round((completionRatio * 0.6 + accuracyRatio * 0.4) * 100);

  return {
    totalQuestions: total,
    completedQuestions: completed,
    attemptedQuestions: attempted,
    accuracyRate: accuracy,
    masteryPercentage: mastery,
  };
}

// Calculate Overall Metrics
export function getOverallStudentMetrics(userId = 'guest-student') {
  const profile = getStudentProfile(userId);
  const allSols = getAllSolutions();

  const totalQuestions = allSols.length;
  let completedCount = 0;
  let attemptedCount = 0;
  let totalCorrect = 0;
  let totalAttempts = 0;
  const revisionQuestions: string[] = [];

  for (const rec of Object.values(profile.records)) {
    if (rec.isCompleted) completedCount++;
    if (rec.attempts > 0) {
      attemptedCount++;
      totalCorrect += rec.correctAnswers;
      totalAttempts += rec.attempts;
    }
    if (rec.needsRevision) {
      revisionQuestions.push(rec.questionId);
    }
  }

  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  return {
    totalQuestions,
    completedCount,
    attemptedCount,
    accuracy,
    totalAttempts,
    bookmarkCount: profile.bookmarks.length,
    revisionCount: revisionQuestions.length,
    revisionQuestions,
  };
}

// Topic-level strengths and weaknesses
export function getTopicAnalytics(userId = 'guest-student'): {
  strengths: Array<{ topic: string; accuracy: number; totalAttempts: number }>;
  weaknesses: Array<{ topic: string; accuracy: number; totalAttempts: number }>;
} {
  const profile = getStudentProfile(userId);
  const topicStats: Record<string, { correct: number; total: number }> = {};

  for (const rec of Object.values(profile.records)) {
    if (rec.attempts > 0) {
      if (!topicStats[rec.topic]) topicStats[rec.topic] = { correct: 0, total: 0 };
      topicStats[rec.topic].correct += rec.correctAnswers;
      topicStats[rec.topic].total += rec.attempts;
    }
  }

  const list = Object.entries(topicStats).map(([topic, stat]) => ({
    topic,
    accuracy: Math.round((stat.correct / stat.total) * 100),
    totalAttempts: stat.total,
  }));

  const strengths = list.filter((t) => t.accuracy >= 70).sort((a, b) => b.accuracy - a.accuracy);
  const weaknesses = list.filter((t) => t.accuracy < 70).sort((a, b) => a.accuracy - b.accuracy);

  return { strengths, weaknesses };
}

// Export student progress to JSON
export function exportStudentDataJson(userId = 'guest-student'): string {
  const profile = getStudentProfile(userId);
  return JSON.stringify(profile, null, 2);
}

// Import student progress from JSON
export function importStudentDataJson(jsonStr: string, userId = 'guest-student'): boolean {
  try {
    const data = JSON.parse(jsonStr) as StudentProfile;
    if (!data || typeof data !== 'object' || !data.records) return false;
    data.userId = userId;
    saveStudentProfile(data);
    return true;
  } catch {
    return false;
  }
}
