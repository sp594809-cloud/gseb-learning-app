'use client';

import React, { useState, useEffect } from 'react';
import { SolutionItem, Language } from '@/types/solution';
import { searchSolutions } from '@/lib/content';
import { MixedText } from './MathRenderer';
import { Search, X, BookOpen, ChevronRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onSelectSolution: (solution: SolutionItem) => void;
}

export function SearchModal({
  isOpen,
  onClose,
  lang,
  onSelectSolution,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SolutionItem[]>([]);

  useEffect(() => {
    if (query.trim()) {
      setResults(searchSolutions(query, lang));
    } else {
      setResults([]);
    }
  }, [query, lang]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              lang === 'gu'
                ? 'પ્રકરણ, સ્વાધ્યાય, પ્રશ્ન નંબર અથવા કીવર્ડ શોધો (દા.ત. સંકલન, શ્રેણિક, 7.6, matrix)...'
                : 'Search chapter, exercise, question, or keyword (e.g. matrix, integral, 7.6)...'
            }
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-white text-xs"
          >
            Esc
          </button>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-3 space-y-2 flex-grow">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40 text-indigo-400" />
              <p>
                {lang === 'gu'
                  ? 'કોઈપણ ગણિત વિષય, પ્રકરણ અથવા પ્રશ્ન શોધવા માટે લખો.'
                  : 'Type to search across any math topic, chapter, or question.'}
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              {lang === 'gu'
                ? `"${query}" માટે કોઈ પરિણામ મળ્યું નથી.`
                : `No solutions found matching "${query}".`}
            </div>
          ) : (
            results.map((sol) => (
              <button
                key={sol.id}
                onClick={() => {
                  onSelectSolution(sol);
                  onClose();
                }}
                className="w-full p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 text-left transition-all flex items-center justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                      Ch {sol.chapterNumber} • Ex {sol.exerciseNumber} • Q.{sol.questionNumber}
                    </span>
                    <span className="text-xs text-indigo-400 font-medium">
                      {sol.topic[lang]}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-white line-clamp-1">
                    <MixedText text={sol.originalQuestion[lang]} />
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 flex-shrink-0 transition-all" />
              </button>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
