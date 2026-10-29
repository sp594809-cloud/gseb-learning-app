'use client';

import React, { useState } from 'react';
import { ChapterMeta, SolutionItem, Language } from '@/types/solution';
import { BookOpen, CheckCircle2, Bookmark, X, ChevronDown, ChevronRight, Layers } from 'lucide-react';

interface ChapterSidebarProps {
  chapters: ChapterMeta[];
  solutions: SolutionItem[];
  currentChapter: string;
  currentExercise: string;
  currentSolutionId: string;
  onSelectSolution: (sol: SolutionItem) => void;
  onSelectChapter: (chNumber: string) => void;
  onSelectExercise: (exNumber: string) => void;
  bookmarks: string[];
  completedList: string[];
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  filterMode: 'all' | 'bookmarks' | 'completed';
  onSetFilterMode: (mode: 'all' | 'bookmarks' | 'completed') => void;
}

export function ChapterSidebar({
  chapters,
  solutions,
  currentChapter,
  currentExercise,
  currentSolutionId,
  onSelectSolution,
  onSelectChapter,
  onSelectExercise,
  bookmarks,
  completedList,
  lang,
  isOpen,
  onClose,
  filterMode,
  onSetFilterMode,
}: ChapterSidebarProps) {
  const [expandedChapter, setExpandedChapter] = useState<string>(currentChapter || '07');

  // Filter solutions based on filterMode
  const filteredSolutions = solutions.filter((sol) => {
    if (filterMode === 'bookmarks') return bookmarks.includes(sol.id);
    if (filterMode === 'completed') return completedList.includes(sol.id);
    return true;
  });

  const part1Chapters = chapters.filter((c) => c.part === 1);
  const part2Chapters = chapters.filter((c) => c.part === 2);

  const getChapterProgress = (chNum: string) => {
    const chSols = solutions.filter((s) => s.chapterNumber === chNum);
    if (chSols.length === 0) return 0;
    const completedCount = chSols.filter((s) => completedList.includes(s.id)).length;
    return Math.round((completedCount / chSols.length) * 100);
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-80 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-base">
              ∫
            </div>
            <div>
              <div className="font-bold text-sm text-white">GSEB Maths Std. 12</div>
              <div className="text-[11px] text-slate-400">ધોરણ ૧૨ ગણિત માર્ગદર્શિકા</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-3 pt-3 pb-2 flex gap-1.5 border-b border-slate-800/80 bg-slate-950/40">
          <button
            onClick={() => onSetFilterMode('all')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterMode === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'gu' ? 'બધા પ્રશ્નો' : 'All'}
          </button>
          <button
            onClick={() => onSetFilterMode('bookmarks')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
              filterMode === 'bookmarks'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3 h-3" />
            <span>({bookmarks.length})</span>
          </button>
          <button
            onClick={() => onSetFilterMode('completed')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
              filterMode === 'completed'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>({completedList.length})</span>
          </button>
        </div>

        {/* Chapter Tree Scroll Area */}
        <div className="flex-grow overflow-y-auto p-3 space-y-4">
          
          {/* Part 1 Chapters */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2 flex items-center gap-1">
              <Layers className="w-3 h-3 text-indigo-400" />
              <span>{lang === 'gu' ? 'ભાગ - ૧ (પ્રકરણ ૧ થી ૬)' : 'PART 1 (Chapters 1 to 6)'}</span>
            </div>
            <div className="space-y-1">
              {part1Chapters.map((ch) => {
                const isExpanded = expandedChapter === ch.chapterNumber;
                const progress = getChapterProgress(ch.chapterNumber);
                const chSolutions = filteredSolutions.filter((s) => s.chapterNumber === ch.chapterNumber);

                return (
                  <div key={ch.chapterNumber} className="rounded-xl overflow-hidden border border-slate-800/60 bg-slate-800/20">
                    <button
                      onClick={() => {
                        setExpandedChapter(isExpanded ? '' : ch.chapterNumber);
                        onSelectChapter(ch.chapterNumber);
                      }}
                      className={`w-full p-2.5 flex items-center justify-between text-left transition-all ${
                        currentChapter === ch.chapterNumber
                          ? 'bg-slate-800 text-white font-medium'
                          : 'text-slate-300 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden pr-2">
                        <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-900 flex-shrink-0">
                          Ch {ch.chapterNumber}
                        </span>
                        <span className="text-xs font-medium truncate">
                          {ch.title[lang]}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {chSolutions.length > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-700 text-slate-300">
                            {chSolutions.length}
                          </span>
                        )}
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </div>
                    </button>

                    {/* Expanded Exercises and Questions */}
                    {isExpanded && (
                      <div className="p-2 pt-1 border-t border-slate-800/50 bg-slate-950/30 space-y-2">
                        {chSolutions.length === 0 ? (
                          <div className="text-[11px] text-slate-500 p-2 italic text-center">
                            {lang === 'gu' ? 'કોઈ પ્રશ્નો ઉપલબ્ધ નથી' : 'No questions in this filter'}
                          </div>
                        ) : (
                          chSolutions.map((sol) => (
                            <button
                              key={sol.id}
                              onClick={() => {
                                onSelectSolution(sol);
                                if (window.innerWidth < 1024) onClose();
                              }}
                              className={`w-full p-2 rounded-lg text-left text-xs transition-all flex items-center justify-between ${
                                currentSolutionId === sol.id
                                  ? 'bg-indigo-600 text-white font-semibold'
                                  : 'text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              <div className="truncate pr-2">
                                <span className="font-mono font-bold mr-1">
                                  Ex {sol.exerciseNumber} Q.{sol.questionNumber}:
                                </span>
                                <span>{sol.topic[lang]}</span>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {bookmarks.includes(sol.id) && (
                                  <Bookmark className="w-3 h-3 text-amber-400 fill-amber-400" />
                                )}
                                {completedList.includes(sol.id) && (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                )}
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Part 2 Chapters */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2 flex items-center gap-1">
              <Layers className="w-3 h-3 text-indigo-400" />
              <span>{lang === 'gu' ? 'ભાગ - ૨ (પ્રકરણ ૭ થી ૧૩)' : 'PART 2 (Chapters 7 to 13)'}</span>
            </div>
            <div className="space-y-1">
              {part2Chapters.map((ch) => {
                const isExpanded = expandedChapter === ch.chapterNumber;
                const chSolutions = filteredSolutions.filter((s) => s.chapterNumber === ch.chapterNumber);

                return (
                  <div key={ch.chapterNumber} className="rounded-xl overflow-hidden border border-slate-800/60 bg-slate-800/20">
                    <button
                      onClick={() => {
                        setExpandedChapter(isExpanded ? '' : ch.chapterNumber);
                        onSelectChapter(ch.chapterNumber);
                      }}
                      className={`w-full p-2.5 flex items-center justify-between text-left transition-all ${
                        currentChapter === ch.chapterNumber
                          ? 'bg-slate-800 text-white font-medium'
                          : 'text-slate-300 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden pr-2">
                        <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-900 flex-shrink-0">
                          Ch {ch.chapterNumber}
                        </span>
                        <span className="text-xs font-medium truncate">
                          {ch.title[lang]}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {chSolutions.length > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-700 text-slate-300">
                            {chSolutions.length}
                          </span>
                        )}
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </div>
                    </button>

                    {/* Expanded Exercises and Questions */}
                    {isExpanded && (
                      <div className="p-2 pt-1 border-t border-slate-800/50 bg-slate-950/30 space-y-2">
                        {chSolutions.length === 0 ? (
                          <div className="text-[11px] text-slate-500 p-2 italic text-center">
                            {lang === 'gu' ? 'કોઈ પ્રશ્નો ઉપલબ્ધ નથી' : 'No questions in this filter'}
                          </div>
                        ) : (
                          chSolutions.map((sol) => (
                            <button
                              key={sol.id}
                              onClick={() => {
                                onSelectSolution(sol);
                                if (window.innerWidth < 1024) onClose();
                              }}
                              className={`w-full p-2 rounded-lg text-left text-xs transition-all flex items-center justify-between ${
                                currentSolutionId === sol.id
                                  ? 'bg-indigo-600 text-white font-semibold'
                                  : 'text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              <div className="truncate pr-2">
                                <span className="font-mono font-bold mr-1">
                                  Ex {sol.exerciseNumber} Q.{sol.questionNumber}:
                                </span>
                                <span>{sol.topic[lang]}</span>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {bookmarks.includes(sol.id) && (
                                  <Bookmark className="w-3 h-3 text-amber-400 fill-amber-400" />
                                )}
                                {completedList.includes(sol.id) && (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                )}
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Sidebar Footer Stats */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/70 text-xs text-slate-400 flex items-center justify-between">
          <span>{lang === 'gu' ? 'પ્રગતિ' : 'Progress'}:</span>
          <span className="font-bold text-white">
            {completedList.length}/{solutions.length} ({Math.round((completedList.length / (solutions.length || 1)) * 100)}%)
          </span>
        </div>
      </aside>
    </>
  );
}
