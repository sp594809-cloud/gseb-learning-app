'use client';

import React, { useState } from 'react';
import { Language } from '@/types/solution';
import {
  getOverallStudentMetrics,
  getChapterMastery,
  getTopicAnalytics,
  exportStudentDataJson,
  importStudentDataJson,
} from '@/lib/progress';
import { getAllChapters } from '@/lib/content';
import {
  Award,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Bookmark,
  Clock,
  Download,
  Upload,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface MasteryDashboardProps {
  lang: Language;
  onSelectQuestion: (questionId: string) => void;
  onClose: () => void;
}

export function MasteryDashboard({
  lang,
  onSelectQuestion,
  onClose,
}: MasteryDashboardProps) {
  const metrics = getOverallStudentMetrics();
  const analytics = getTopicAnalytics();
  const chapters = getAllChapters();

  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExport = () => {
    const jsonStr = exportStudentDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gseb_maths_progress_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importStudentDataJson(content);
      if (success) {
        setImportStatus(lang === 'gu' ? '✓ પ્રગતિ સફળતાપૂર્વક પુનઃસ્થાપિત થઈ!' : '✓ Progress restored successfully!');
        window.location.reload();
      } else {
        setImportStatus(lang === 'gu' ? '✗ અમાન્ય ડેટા ફાઇલ.' : '✗ Invalid data file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Award className="w-5 h-5 text-indigo-400" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {lang === 'gu' ? 'વિદ્યાર્થી સિદ્ધિ અને પ્રગતિ ડેશબોર્ડ' : 'Student Mastery Dashboard'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {lang === 'gu'
                ? 'પારદર્શક મૂલ્યાંકન: પ્રયાસો, ચોકસાઈ દર અને પુનરાવર્તન વિશ્લેષણ'
                : 'Transparent metrics: completion rate, accuracy, and revision queue'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            {lang === 'gu' ? 'બંધ કરો ✕' : 'Close ✕'}
          </button>
        </div>

        {/* 4 Overview Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'gu' ? 'શીખી લીધેલ' : 'Learned'}</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {metrics.completedCount} <span className="text-xs text-slate-500 font-normal">/ {metrics.totalQuestions}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>{lang === 'gu' ? 'ચોકસાઈ દર' : 'Accuracy'}</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {metrics.accuracy}%
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>{lang === 'gu' ? 'પુનરાવર્તન લાયક' : 'Needs Revision'}</span>
            </div>
            <div className="text-2xl font-bold text-amber-300 font-mono">
              {metrics.revisionCount}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5 mb-1">
              <Bookmark className="w-4 h-4 text-purple-400" />
              <span>{lang === 'gu' ? 'બુકમાર્ક્સ' : 'Saved'}</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {metrics.bookmarkCount}
            </div>
          </div>
        </div>

        {/* Chapter-by-Chapter Mastery Breakdown */}
        <div className="my-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>{lang === 'gu' ? 'પ્રકરણવાર પ્રગતિ દર (Chapter Mastery)' : 'Chapter Mastery Progress'}</span>
          </h3>

          <div className="space-y-3">
            {chapters.slice(0, 6).map((ch) => {
              const m = getChapterMastery(ch.chapterNumber);
              return (
                <div
                  key={ch.chapterNumber}
                  className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="w-full sm:w-1/3">
                    <div className="font-bold text-sm text-white">
                      {lang === 'gu' ? `પ્રકરણ ${ch.chapterNumber}: ${ch.title.gu}` : `Ch ${ch.chapterNumber}: ${ch.title.en}`}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {m.completedQuestions} / {m.totalQuestions} {lang === 'gu' ? 'પ્રશ્નો પૂર્ણ' : 'completed'}
                    </div>
                  </div>

                  <div className="flex-1 sm:mx-4">
                    <div className="w-full bg-slate-700/60 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all"
                        style={{ width: `${m.masteryPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-right sm:w-20">
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {m.masteryPercentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Topic Strengths & Weaknesses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          {/* Strengths */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/40">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'gu' ? 'મજબૂત વિષયો (Strengths)' : 'Strong Topics (≥70%)'}</span>
            </div>
            {analytics.strengths.length > 0 ? (
              <div className="space-y-2 mt-2">
                {analytics.strengths.map((s, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-slate-200">{s.topic}</span>
                    <span className="font-mono font-bold text-emerald-400">{s.accuracy}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic mt-2">
                {lang === 'gu' ? 'હજુ પૂરતો પ્રેક્ટિસ ડેટા નથી.' : 'Practice more questions to see strong topics.'}
              </div>
            )}
          </div>

          {/* Weaknesses */}
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-800/40">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-300 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>{lang === 'gu' ? 'ધ્યાન આપવા જેવા વિષયો (Needs Work)' : 'Areas to Revise (<70%)'}</span>
            </div>
            {analytics.weaknesses.length > 0 ? (
              <div className="space-y-2 mt-2">
                {analytics.weaknesses.map((w, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-slate-200">{w.topic}</span>
                    <span className="font-mono font-bold text-rose-400">{w.accuracy}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic mt-2">
                {lang === 'gu' ? 'કોઈ નબળા વિષયો નોંધાયા નથી.' : 'No revision areas flagged yet.'}
              </div>
            )}
          </div>
        </div>

        {/* Data Backup & Restore */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-400">
            {importStatus && <span className="font-bold text-emerald-400 mr-2">{importStatus}</span>}
            <span>{lang === 'gu' ? 'તમારો પ્રોગ્રેસ ડેટા તમારા બ્રાઉઝરમાં સુરક્ષિત સંગ્રહિત છે.' : 'Your progress is securely isolated to your browser.'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang === 'gu' ? 'બેકઅપ ડાઉનલોડ' : 'Export Progress'}</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang === 'gu' ? 'રિસ્ટોર કરો' : 'Import Backup'}</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}
