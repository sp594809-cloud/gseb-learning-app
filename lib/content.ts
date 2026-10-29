import type { SolutionItem, ChapterMeta, Language } from '../types/solution';
import chaptersData from '../data/solutions/chapters.json' with { type: 'json' };
import ch03Solutions from '../data/solutions/chapter-03.json' with { type: 'json' };
import ch06Solutions from '../data/solutions/chapter-06.json' with { type: 'json' };
import ch07Solutions from '../data/solutions/chapter-07.json' with { type: 'json' };
import ch10Solutions from '../data/solutions/chapter-10.json' with { type: 'json' };
import ch12Solutions from '../data/solutions/chapter-12.json' with { type: 'json' };
import { lessons } from '../data/lessons.ts';

// Convert existing legacy lessons from lessons.ts into the reusable SolutionItem format to preserve working features
function adaptLegacyLesson(lesson: typeof lessons[0]): SolutionItem {
  return {
    id: `legacy-${lesson.id}`,
    chapterNumber: lesson.chapter,
    exerciseNumber: 'ઉદાહરણ / Example',
    questionNumber: 'Ex-1',
    topic: {
      en: lesson.subtitle.en,
      gu: lesson.subtitle.gu,
    },
    originalQuestion: {
      en: `Find the value: \\( ${lesson.worked.question} \\)`,
      gu: `મૂલ્ય શોધો: \\( ${lesson.worked.question} \\)`,
    },
    given: {
      en: ['Given expression from standard syllabus.'],
      gu: ['પ્રમાણિત અભ્યાસક્રમ આધારિત પદાવલિ આપેલ છે.'],
    },
    requiredResult: {
      en: `Evaluate \\( ${lesson.worked.question} \\)`,
      gu: `\\( ${lesson.worked.question} \\) નું મૂલ્યાંકન કરો`,
    },
    formulaOrTheorem: {
      en: [`Key formula: \\( ${lesson.formula} \\)`],
      gu: [`મુખ્ય સૂત્ર: \\( ${lesson.formula} \\)`],
    },
    steps: lesson.worked.steps.en.map((stepEn, idx) => ({
      stepNumber: idx + 1,
      explanation: {
        en: stepEn,
        gu: lesson.worked.steps.gu[idx] || stepEn,
      },
      math: lesson.formula,
    })),
    finalAnswer: {
      en: lesson.worked.answer,
      gu: lesson.worked.answer,
    },
    verificationStatus: 'verified',
    verifiedBy: 'Original Prototype Verification',
    practiceOptions: lesson.questions.flatMap((q) =>
      q.options.map((opt, i) => ({
        text: opt,
        isCorrect: i === q.correct,
        explanation: {
          en: q.explanation.en,
          gu: q.explanation.gu,
        },
      }))
    ),
  };
}

const legacyAdaptedSolutions: SolutionItem[] = lessons.map(adaptLegacyLesson);

// Aggregate all solutions with stable IDs
export const allSolutions: SolutionItem[] = [
  ...(ch07Solutions as SolutionItem[]),
  ...(ch03Solutions as SolutionItem[]),
  ...(ch06Solutions as SolutionItem[]),
  ...(ch10Solutions as SolutionItem[]),
  ...(ch12Solutions as SolutionItem[]),
  ...legacyAdaptedSolutions,
];

export const allChapters: ChapterMeta[] = chaptersData as ChapterMeta[];

export function getAllChapters(): ChapterMeta[] {
  return allChapters;
}

export function getChapterMeta(chapterNumber: string): ChapterMeta | undefined {
  const norm = chapterNumber.padStart(2, '0');
  return allChapters.find((c) => c.chapterNumber === norm || c.chapterNumber === chapterNumber);
}

export function getAllSolutions(): SolutionItem[] {
  return allSolutions;
}

export function getSolutionById(id: string): SolutionItem | undefined {
  // Search main solutions and subquestions
  for (const sol of allSolutions) {
    if (sol.id === id) return sol;
    if (sol.subQuestions) {
      const sub = sol.subQuestions.find((s) => s.id === id);
      if (sub) return sub;
    }
  }
  return undefined;
}

export function getSolutionsByChapter(chapterNumber: string): SolutionItem[] {
  const norm = chapterNumber.padStart(2, '0');
  return allSolutions.filter((s) => s.chapterNumber === norm || s.chapterNumber === chapterNumber);
}

export function getSolutionsByExercise(chapterNumber: string, exerciseNumber: string): SolutionItem[] {
  const norm = chapterNumber.padStart(2, '0');
  return allSolutions.filter(
    (s) =>
      (s.chapterNumber === norm || s.chapterNumber === chapterNumber) &&
      (s.exerciseNumber === exerciseNumber || s.exerciseNumber.includes(exerciseNumber))
  );
}

export function searchSolutions(query: string, lang: Language = 'gu'): SolutionItem[] {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();

  return allSolutions.filter((sol) => {
    // Check chapter number / exercise / question
    if (sol.chapterNumber.includes(q)) return true;
    if (sol.exerciseNumber.toLowerCase().includes(q)) return true;
    if (sol.questionNumber.toLowerCase().includes(q)) return true;
    if (sol.id.toLowerCase().includes(q)) return true;

    // Check topic
    if (sol.topic.en.toLowerCase().includes(q) || sol.topic.gu.toLowerCase().includes(q)) return true;

    // Check question text
    if (sol.originalQuestion.en.toLowerCase().includes(q) || sol.originalQuestion.gu.toLowerCase().includes(q)) return true;

    // Check final answer
    const ansEn = typeof sol.finalAnswer === 'string' ? sol.finalAnswer : sol.finalAnswer.en;
    const ansGu = typeof sol.finalAnswer === 'string' ? sol.finalAnswer : sol.finalAnswer.gu;
    if (ansEn.toLowerCase().includes(q) || ansGu.toLowerCase().includes(q)) return true;

    return false;
  });
}
