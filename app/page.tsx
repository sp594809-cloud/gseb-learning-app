'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { SolutionItem, Language, ChapterMeta } from '@/types/solution';
import {
  allSolutions,
  allChapters,
  getSolutionById,
  getSolutionsByChapter,
  getChapterMeta,
} from '@/lib/content';
import { NotebookPage } from '@/components/NotebookPage';
import { PracticeMode } from '@/components/PracticeMode';
import { ChapterSidebar } from '@/components/ChapterSidebar';
import { StudentHeader } from '@/components/StudentHeader';
import { SearchModal } from '@/components/SearchModal';
import { MasteryDashboard } from '@/components/MasteryDashboard';
import { AdminCMS } from '@/components/AdminCMS';
import { MixedText } from '@/components/MathRenderer';
import { registerServiceWorker } from '@/lib/offline';
import { recordStudentAttempt } from '@/lib/progress';
import {
  BookOpen,
  CheckCircle2,
  Bookmark,
  Award,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  FileText,
  PlayCircle,
  HelpCircle,
  Layers,
  Flame,
} from 'lucide-react';

export default function Home() {
  const [lang, setLang] = useState<Language>('gu');
  const [activeSolutionId, setActiveSolutionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'notebook' | 'practice'>('notebook');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'bookmarks' | 'completed'>('all');
  const [masteryOpen, setMasteryOpen] = useState(false);
  const [cmsOpen, setCmsOpen] = useState(false);

  // Persistence States
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [completedList, setCompletedList] = useState<string[]>([]);
  const [lastStudied, setLastStudied] = useState<{ id: string; chapter: string; topic: string } | null>(null);
  const [practiceScores, setPracticeScores] = useState<Record<string, boolean>>({});

  // Hydrate persistence from localStorage
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('gseb-lang') as Language;
      if (savedLang) setLang(savedLang);

      const savedBookmarks = JSON.parse(localStorage.getItem('gseb-bookmarks') || '[]');
      setBookmarks(savedBookmarks);

      const savedCompleted = JSON.parse(localStorage.getItem('gseb-completed') || '[]');
      setCompletedList(savedCompleted);

      const savedLast = JSON.parse(localStorage.getItem('gseb-last-studied') || 'null');
      setLastStudied(savedLast);

      const savedScores = JSON.parse(localStorage.getItem('gseb-scores') || '{}');
      setPracticeScores(savedScores);
    } catch {
      // ignore parsing error
    }
    // Register offline service worker
    registerServiceWorker();
  }, []);

  // Save changes to localStorage
  const toggleLanguage = () => {
    const nextLang: Language = lang === 'gu' ? 'en' : 'gu';
    setLang(nextLang);
    try {
      localStorage.setItem('gseb-lang', nextLang);
    } catch {}
  };

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const updated = prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id];
      try {
        localStorage.setItem('gseb-bookmarks', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const toggleComplete = (id: string) => {
    setCompletedList((prev) => {
      const updated = prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id];
      try {
        localStorage.setItem('gseb-completed', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const recordPracticeScore = (questionId: string, isCorrect: boolean) => {
    setPracticeScores((prev) => {
      const updated = { ...prev, [questionId]: isCorrect };
      try {
        localStorage.setItem('gseb-scores', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleSelectSolution = (sol: SolutionItem) => {
    setActiveSolutionId(sol.id);
    const newLast = {
      id: sol.id,
      chapter: sol.chapterNumber,
      topic: sol.topic[lang],
    };
    setLastStudied(newLast);
    try {
      localStorage.setItem('gseb-last-studied', JSON.stringify(newLast));
    } catch {}
  };

  // Keyboard shortcut: Cmd+K / Ctrl+K opens search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeSolution = useMemo(() => {
    if (!activeSolutionId) return null;
    return getSolutionById(activeSolutionId) || null;
  }, [activeSolutionId]);

  const activeChapterMeta = useMemo(() => {
    if (!activeSolution) return null;
    return getChapterMeta(activeSolution.chapterNumber) || null;
  }, [activeSolution]);

  // Questions in the same chapter for exercise/question switching
  const chapterSolutions = useMemo(() => {
    if (!activeSolution) return [];
    return getSolutionsByChapter(activeSolution.chapterNumber);
  }, [activeSolution]);

  // Exercises available in current chapter
  const exercisesInChapter = useMemo(() => {
    if (!chapterSolutions) return [];
    const set = new Set<string>();
    chapterSolutions.forEach((s) => set.add(s.exerciseNumber));
    return Array.from(set);
  }, [chapterSolutions]);

  const questionsInCurrentExercise = useMemo(() => {
    if (!activeSolution) return [];
    return chapterSolutions.filter((s) => s.exerciseNumber === activeSolution.exerciseNumber);
  }, [activeSolution, chapterSolutions]);

  // Global prev/next solution navigation
  const globalSolutionIndex = useMemo(() => {
    if (!activeSolutionId) return -1;
    return allSolutions.findIndex((s) => s.id === activeSolutionId);
  }, [activeSolutionId]);

  const hasPrev = globalSolutionIndex > 0;
  const hasNext = globalSolutionIndex < allSolutions.length - 1;

  const goToPrevSolution = () => {
    if (hasPrev) handleSelectSolution(allSolutions[globalSolutionIndex - 1]);
  };

  const goToNextSolution = () => {
    if (hasNext) handleSelectSolution(allSolutions[globalSolutionIndex + 1]);
  };

  // Calculations for dashboard stats
  const totalSolutions = allSolutions.length;
  const completedCount = completedList.length;
  const progressPercentage = Math.round((completedCount / (totalSolutions || 1)) * 100);
  const correctCount = Object.values(practiceScores).filter(Boolean).length;
  const totalAttempted = Object.keys(practiceScores).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header */}
      <StudentHeader
        lang={lang}
        onToggleLang={toggleLanguage}
        onOpenSidebar={() => setSidebarOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        bookmarkCount={bookmarks.length}
        completedCount={completedCount}
        totalCount={totalSolutions}
        onOpenBookmarks={() => {
          setFilterMode('bookmarks');
          setSidebarOpen(true);
        }}
        onOpenMastery={() => setMasteryOpen(true)}
        onOpenCMS={() => setCmsOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-grow flex w-full">
        
        {/* Chapter Navigation Sidebar */}
        <ChapterSidebar
          chapters={allChapters}
          solutions={allSolutions}
          currentChapter={activeSolution?.chapterNumber || '07'}
          currentExercise={activeSolution?.exerciseNumber || ''}
          currentSolutionId={activeSolution?.id || ''}
          onSelectSolution={handleSelectSolution}
          onSelectChapter={(ch) => {
            const chSols = getSolutionsByChapter(ch);
            if (chSols.length > 0) handleSelectSolution(chSols[0]);
          }}
          onSelectExercise={(ex) => {
            if (activeSolution) {
              const sol = chapterSolutions.find((s) => s.exerciseNumber === ex);
              if (sol) handleSelectSolution(sol);
            }
          }}
          bookmarks={bookmarks}
          completedList={completedList}
          lang={lang}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          filterMode={filterMode}
          onSetFilterMode={setFilterMode}
        />

        {/* Content Body Area */}
        <main className="flex-1 w-full lg:ml-80 transition-all p-3 sm:p-6 pb-20">
          
          {/* View 1: ACTIVE SOLUTION VIEW (Notebook or Practice) */}
          {activeSolution ? (
            <div className="w-full max-w-5xl mx-auto">
              
              {/* Back to Dashboard & Navigation Strip */}
              <div className="print:hidden flex flex-wrap items-center justify-between gap-3 mb-4">
                <button
                  onClick={() => setActiveSolutionId(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{lang === 'gu' ? 'ડેશબોર્ડ' : 'Dashboard'}</span>
                </button>

                {/* Tab Switcher: Notebook Solution vs Practice Mode */}
                <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
                  <button
                    onClick={() => setActiveTab('notebook')}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'notebook'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{lang === 'gu' ? 'નોટબુક સોલ્યુશન' : 'Notebook Solution'}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('practice')}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'practice'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>{lang === 'gu' ? 'પ્રેક્ટિસ મોડ' : 'Practice Mode'}</span>
                  </button>
                </div>
              </div>

              {/* Exercise & Question Jump Strip */}
              <div className="print:hidden bg-slate-900/60 border border-slate-800 rounded-xl p-3 mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                
                {/* Chapter & Exercise Breadcrumbs */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white">
                    {lang === 'gu' ? `પ્રકરણ ${activeSolution.chapterNumber}` : `Chapter ${activeSolution.chapterNumber}`}: {activeChapterMeta?.title[lang]}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-indigo-400 font-semibold">
                    {lang === 'gu' ? `સ્વાધ્યાય ${activeSolution.exerciseNumber}` : `Exercise ${activeSolution.exerciseNumber}`}
                  </span>
                </div>

                {/* Question Pills Strip */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {questionsInCurrentExercise.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => handleSelectSolution(q)}
                      className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all ${
                        activeSolution.id === q.id
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                      title={q.topic[lang]}
                    >
                      Q.{q.questionNumber}
                    </button>
                  ))}
                </div>
              </div>

              {/* Render Active View */}
              {activeTab === 'notebook' ? (
                <NotebookPage
                  solution={activeSolution}
                  lang={lang}
                  isBookmarked={bookmarks.includes(activeSolution.id)}
                  onToggleBookmark={toggleBookmark}
                  isCompleted={completedList.includes(activeSolution.id)}
                  onToggleComplete={toggleComplete}
                  onNextQuestion={hasNext ? goToNextSolution : undefined}
                  onPrevQuestion={hasPrev ? goToPrevSolution : undefined}
                  hasNext={hasNext}
                  hasPrev={hasPrev}
                />
              ) : (
                <PracticeMode
                  solution={activeSolution}
                  lang={lang}
                  onViewNotebook={() => setActiveTab('notebook')}
                  onRecordScore={(id, correct) => {
                    recordPracticeScore(id, correct);
                    if (activeSolution) recordStudentAttempt(activeSolution, correct);
                  }}
                />
              )}

            </div>
          ) : (
            
            /* View 2: DASHBOARD VIEW */
            <div className="w-full max-w-5xl mx-auto space-y-6">
              
              {/* Continue Studying Banner (if student previously studied) */}
              {lastStudied && (
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/90 via-purple-900/80 to-slate-900 p-5 sm:p-6 border border-indigo-700/50 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Flame className="w-4 h-4 text-amber-400" />
                        <span className="text-xs uppercase font-bold tracking-wider text-amber-300 font-mono">
                          {lang === 'gu' ? 'અભ્યાસ ચાલુ રાખો' : 'CONTINUE STUDYING'}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        {lang === 'gu' ? `પ્રકરણ ${lastStudied.chapter}: ${lastStudied.topic}` : `Chapter ${lastStudied.chapter}: ${lastStudied.topic}`}
                      </h3>
                      <p className="text-xs text-indigo-200/80 mt-1">
                        {lang === 'gu' ? 'તમે છેલ્લે જ્યાંથી છોડ્યું હતું ત્યાંથી અભ્યાસ ફરી શરૂ કરો.' : 'Resume from where you left off.'}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const sol = getSolutionById(lastStudied.id);
                        if (sol) handleSelectSolution(sol);
                        else handleSelectSolution(allSolutions[0]);
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs sm:text-sm shadow-md hover:bg-indigo-50 transition-all flex-shrink-0"
                    >
                      <span>{lang === 'gu' ? 'અભ્યાસ શરૂ કરો →' : 'Resume Learning →'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Hero Banner (if no previous study or as introduction) */}
              {!lastStudied && (
                <div className="rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 p-6 sm:p-8 border border-indigo-900/60 shadow-xl">
                  <span className="px-2.5 py-1 rounded-full bg-indigo-900/80 text-indigo-300 border border-indigo-700/80 text-xs font-bold uppercase tracking-wider font-mono">
                    GSEB STD. 12 MATHEMATICS (ધોરણ ૧૨ ગણિત)
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-black text-white mt-3 leading-tight">
                    {lang === 'gu'
                      ? 'વાસ્તવિક નોટબુક પેજ પર દરેક ગણતરી અને પગલું સમજો.'
                      : 'Master every step with realistic notebook solutions.'}
                  </h1>
                  <p className="text-slate-300 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
                    {lang === 'gu'
                      ? 'ગુજરાત બોર્ડ ધોરણ ૧૨ ગણિતના પાઠ્યપુસ્તકના દાખલાઓ, વ્યાખ્યાઓ, પ્રમેયો અને સ્વાધ્યાયના પ્રશ્નો વાસ્તવિક લાઈનવાળી નોટબુકના સ્વરૂપમાં.'
                      : 'Step-by-step textbook solutions, formulas, theorems, and practice exercises formatted on realistic white notebook pages.'}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-5">
                    <button
                      onClick={() => handleSelectSolution(allSolutions[0])}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all"
                    >
                      {lang === 'gu' ? 'શરૂઆત કરો (Ch 7: સંકલન) →' : 'Get Started (Ch 7: Integrals) →'}
                    </button>
                    <button
                      onClick={() => setSearchOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-sm transition-all"
                    >
                      {lang === 'gu' ? 'પ્રશ્નો શોધો' : 'Search Questions'}
                    </button>
                  </div>
                </div>
              )}

              {/* Progress & Study Overview Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                
                {/* Stat 1: Completed */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>{lang === 'gu' ? 'પૂર્ણ કરેલ સોલ્યુશન' : 'Completed Solutions'}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white">
                    {completedCount} <span className="text-sm font-normal text-slate-500">/ {totalSolutions}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Stat 2: Bookmarks */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>{lang === 'gu' ? 'સાચવેલા પ્રશ્નો' : 'Bookmarked Questions'}</span>
                    <Bookmark className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-white">
                    {bookmarks.length} <span className="text-sm font-normal text-slate-500">{lang === 'gu' ? 'પ્રશ્નો' : 'questions'}</span>
                  </div>
                  <div className="text-xs text-amber-300/80 mt-2">
                    {lang === 'gu' ? 'પુનરાવર્તન માટે સાચવેલ' : 'Saved for revision'}
                  </div>
                </div>

                {/* Stat 3: Practice Accuracy */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>{lang === 'gu' ? 'પ્રેક્ટિસ સફળતા દર' : 'Practice Accuracy'}</span>
                    <Award className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-black text-white">
                    {totalAttempted > 0 ? `${Math.round((correctCount / totalAttempted) * 100)}%` : '0%'}
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    {correctCount} {lang === 'gu' ? 'સાચા જવાબ' : 'correct'} / {totalAttempted} {lang === 'gu' ? 'પ્રયાસ' : 'attempted'}
                  </div>
                </div>

              </div>

              {/* Bookmarked Questions Quick Tray (if any) */}
              {bookmarks.length > 0 && (
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <h3 className="font-bold text-sm sm:text-base text-white">
                        {lang === 'gu' ? 'તમારા બુકમાર્ક્સ' : 'Your Bookmarks'} ({bookmarks.length})
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {bookmarks.slice(0, 4).map((bId) => {
                      const bSol = getSolutionById(bId);
                      if (!bSol) return null;
                      return (
                        <button
                          key={bId}
                          onClick={() => handleSelectSolution(bSol)}
                          className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-all flex items-center justify-between gap-3 group"
                        >
                          <div>
                            <span className="text-[10px] font-mono font-bold text-indigo-400 block mb-0.5">
                              Ch {bSol.chapterNumber} • Ex {bSol.exerciseNumber} Q.{bSol.questionNumber}
                            </span>
                            <div className="text-xs font-semibold text-white line-clamp-1">
                              <MixedText text={bSol.originalQuestion[lang]} />
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 flex-shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Chapters Syllabus Explorer */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-400" />
                      <span>{lang === 'gu' ? 'સંપૂર્ણ ધોરણ ૧૨ અભ્યાસક્રમ' : 'Class 12 Mathematics Syllabus'}</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {lang === 'gu' ? 'ભાગ ૧ અને ભાગ ૨ ના તમામ પ્રકરણો' : 'All 13 Chapters across Part 1 & Part 2'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {allChapters.map((ch) => {
                    const chSolutions = getSolutionsByChapter(ch.chapterNumber);
                    const chCompleted = chSolutions.filter((s) => completedList.includes(s.id)).length;
                    const chPercent = chSolutions.length > 0 ? Math.round((chCompleted / chSolutions.length) * 100) : 0;

                    return (
                      <div
                        key={ch.chapterNumber}
                        className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                              {lang === 'gu' ? `પ્રકરણ ${ch.chapterNumber}` : `Chapter ${ch.chapterNumber}`}
                            </span>
                            <span className="text-[11px] font-medium text-slate-400">
                              {ch.part === 1 ? (lang === 'gu' ? 'ભાગ-૧' : 'Part 1') : (lang === 'gu' ? 'ભાગ-૨' : 'Part 2')}
                            </span>
                          </div>

                          <h3 className="font-bold text-base sm:text-lg text-white mb-1">
                            {ch.title[lang]}
                          </h3>

                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                            {ch.description[lang]}
                          </p>
                        </div>

                        <div>
                          {/* Exercises badges */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {ch.exercises.slice(0, 4).map((ex, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono"
                              >
                                {ex}
                              </span>
                            ))}
                            {ch.exercises.length > 4 && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-500 font-mono">
                                +{ch.exercises.length - 4}
                              </span>
                            )}
                          </div>

                          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                            <span className="text-xs text-indigo-400 font-semibold">
                              {chSolutions.length > 0
                                ? `${chSolutions.length} ${lang === 'gu' ? 'સોલ્યુશન્સ તૈયાર' : 'solutions'}`
                                : lang === 'gu' ? 'અભ્યાસક્રમ નોંધ' : 'In curriculum'}
                            </span>

                            <button
                              onClick={() => {
                                if (chSolutions.length > 0) {
                                  handleSelectSolution(chSolutions[0]);
                                } else {
                                  // Jump to search or open sidebar
                                  setSidebarOpen(true);
                                }
                              }}
                              className="flex items-center gap-1 text-xs font-bold text-white hover:text-indigo-300"
                            >
                              <span>{lang === 'gu' ? 'અભ્યાસ કરો' : 'Study'}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* Instant Search Modal (Cmd+K) */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        lang={lang}
        onSelectSolution={handleSelectSolution}
      />

      {/* Mastery Dashboard Modal — self-contains fixed overlay */}
      {masteryOpen && (
        <MasteryDashboard
          lang={lang}
          onClose={() => setMasteryOpen(false)}
          onSelectQuestion={(qId) => {
            const sol = getSolutionById(qId);
            if (sol) {
              handleSelectSolution(sol);
              setMasteryOpen(false);
            }
          }}
        />
      )}

      {/* Admin CMS Modal — self-contains fixed overlay */}
      {cmsOpen && (
        <AdminCMS
          lang={lang}
          onClose={() => setCmsOpen(false)}
          onPreviewSolution={(sol) => {
            handleSelectSolution(sol);
            setCmsOpen(false);
          }}
        />
      )}

    </div>
  );
}