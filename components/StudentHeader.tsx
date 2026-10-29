'use client';

import React from 'react';
import { Language } from '@/types/solution';
import { Menu, Search, Globe, Bookmark, Sparkles } from 'lucide-react';

interface StudentHeaderProps {
  lang: Language;
  onToggleLang: () => void;
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
  bookmarkCount: number;
  completedCount: number;
  totalCount: number;
  onOpenBookmarks: () => void;
}

export function StudentHeader({
  lang,
  onToggleLang,
  onOpenSidebar,
  onOpenSearch,
  bookmarkCount,
  completedCount,
  totalCount,
  onOpenBookmarks,
}: StudentHeaderProps) {
  return (
    <header className="print:hidden sticky top-0 z-30 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Sidebar toggle + Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-all"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-black text-white text-lg shadow-md shadow-indigo-600/30">
              ∫
            </div>
            <div className="hidden min-[420px]:block">
              <div className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-1.5">
                <span>GSEB</span>
                <span className="text-indigo-400 font-semibold">Learning Hub</span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                {lang === 'gu' ? 'ધોરણ ૧૨ ગણિત સોલ્યુશન્સ' : 'Class 12 Mathematics'}
              </div>
            </div>
          </div>
        </div>

        {/* Center: Search Button / Trigger */}
        <div className="flex-1 max-w-md mx-2 sm:mx-4">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-400 border border-slate-700/80 text-xs sm:text-sm transition-all shadow-inner"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span className="truncate">
                {lang === 'gu' ? 'શોધો... (પ્રશ્ન, સૂત્ર, સ્વાધ્યાય)' : 'Search questions, formulas...'}
              </span>
            </div>
            <span className="hidden sm:inline-block font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-700/80 text-slate-300">
              ⌘K
            </span>
          </button>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Bookmarks Counter */}
          <button
            onClick={onOpenBookmarks}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title={lang === 'gu' ? 'બુકમાર્ક્સ જુઓ' : 'View bookmarks'}
          >
            <Bookmark className={`w-4 h-4 ${bookmarkCount > 0 ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">({bookmarkCount})</span>
          </button>

          {/* Bilingual Language Switch */}
          <button
            onClick={onToggleLang}
            className="px-2.5 py-2 sm:px-3 sm:py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
            title={lang === 'gu' ? 'Switch to English' : 'ગુજરાતીમાં ફેરવો'}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">
              {lang === 'gu' ? 'ગુજરાતી · EN' : 'English · ગુ'}
            </span>
            <span className="md:hidden">
              {lang === 'gu' ? 'ગુ' : 'EN'}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
}
