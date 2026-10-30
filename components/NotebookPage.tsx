'use client';

import React, { useState } from 'react';
import { SolutionItem, Language } from '@/types/solution';
import { MathRenderer, MixedText } from './MathRenderer';
import { InteractiveGraph } from './InteractiveGraph';
import { MathDiagram } from './MathDiagram';
import {
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Printer,
  ShieldCheck,
  AlertCircle,
  Clock,
  BookOpen,
  FileText,
  Layers,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  Sparkles,
} from 'lucide-react';

export type SolutionViewMode = 'notebook' | 'textbook' | 'interactive';

interface NotebookPageProps {
  solution: SolutionItem;
  lang: Language;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  isCompleted: boolean;
  onToggleComplete: (id: string) => void;
  onNextQuestion?: () => void;
  onPrevQuestion?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export function NotebookPage({
  solution,
  lang,
  isBookmarked,
  onToggleBookmark,
  isCompleted,
  onToggleComplete,
  onNextQuestion,
  onPrevQuestion,
  hasNext,
  hasPrev,
}: NotebookPageProps) {
  const [viewMode, setViewMode] = useState<SolutionViewMode>('notebook');
  const [revealedStepIndex, setRevealedStepIndex] = useState<number>(1);
  const [understoodSteps, setUnderstoodSteps] = useState<Record<number, boolean>>({});

  const handlePrint = () => {
    window.print();
  };

  const finalAnswerText =
    typeof solution.finalAnswer === 'string'
      ? solution.finalAnswer
      : solution.finalAnswer[lang];

  const totalSteps = solution.steps.length;

  const toggleStepUnderstood = (stepNum: number) => {
    setUnderstoodSteps((prev) => ({
      ...prev,
      [stepNum]: !prev[stepNum],
    }));
  };

  return (
    <div className="notebook-container w-full max-w-4xl mx-auto my-6 px-2 sm:px-4">
      {/* Action & View Toolbar (hidden during print) */}
      <div className="notebook-toolbar print:hidden flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-900/90 backdrop-blur border border-slate-800 p-3 rounded-2xl text-sm shadow-xl">
        {/* Left: View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => setViewMode('notebook')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'notebook'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={lang === 'gu' ? 'વાસ્તવિક નોટબુક વ્યૂ' : 'Realistic Notebook View'}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{lang === 'gu' ? 'નોટબુક પેજ' : 'Notebook'}</span>
          </button>

          <button
            onClick={() => setViewMode('textbook')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'textbook'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={lang === 'gu' ? 'પુસ્તક મુદ્રણ વ્યૂ' : 'Clean Textbook View'}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'gu' ? 'પાઠ્યપુસ્તક' : 'Textbook'}</span>
          </button>

          <button
            onClick={() => setViewMode('interactive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'interactive'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={lang === 'gu' ? 'પગલુંવાર ઇન્ટરેક્ટિવ વ્યૂ' : 'Step-by-Step Interactive View'}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{lang === 'gu' ? 'પગલુંવાર ઉકેલ' : 'Step-by-Step'}</span>
          </button>
        </div>

        {/* Right: Actions (Bookmark, Complete, Print, Next/Prev) */}
        <div className="flex items-center gap-2">
          {/* Previous / Next Question Navigation */}
          {hasPrev && onPrevQuestion && (
            <button
              onClick={onPrevQuestion}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
              title={lang === 'gu' ? 'પાછળનો પ્રશ્ન' : 'Previous question'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {hasNext && onNextQuestion && (
            <button
              onClick={onNextQuestion}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
              title={lang === 'gu' ? 'આગળનો પ્રશ્ન' : 'Next question'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(solution.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all text-xs font-medium ${
              isBookmarked
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title={lang === 'gu' ? 'બુકમાર્ક કરો' : 'Bookmark question'}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Bookmark className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{isBookmarked ? (lang === 'gu' ? 'સાચવેલ' : 'Saved') : (lang === 'gu' ? 'બુકમાર્ક' : 'Bookmark')}</span>
          </button>

          {/* Mark as Completed */}
          <button
            onClick={() => onToggleComplete(solution.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all text-xs font-medium ${
              isCompleted
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title={lang === 'gu' ? 'પૂર્ણ તરીકે ચિહ્નિત કરો' : 'Mark as learned'}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">
              {isCompleted ? (lang === 'gu' ? 'પૂર્ણ ✓' : 'Learned ✓') : (lang === 'gu' ? 'પૂર્ણ' : 'Mark')}
            </span>
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-sm transition-all"
            title={lang === 'gu' ? 'પ્રિન્ટ / PDF ડાઉનલોડ' : 'Print / Download PDF'}
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'gu' ? 'પ્રિન્ટ' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VIEW 1: AUTHENTIC REALISTIC NOTEBOOK VIEW                 */}
      {/* ========================================================= */}
      {viewMode === 'notebook' && (
        <div className="notebook-page relative bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-300 overflow-hidden font-sans print:shadow-none print:border-none print:m-0 print:p-0 transition-all">
          {/* Top Notebook Header Strip */}
          <div className="notebook-header-band bg-white px-6 sm:px-10 pt-6 pb-4 border-b-2 border-red-400/80">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-widest text-red-600 font-bold font-mono">
                    GSEB STD 12 MATHEMATICS
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-xs text-slate-600 font-medium">
                    {lang === 'gu' ? 'ગુજરાત માધ્યમિક અને ઉચ્ચતર માધ્યમિક શિક્ષણ બોર્ડ' : 'Gujarat Secondary Education Board'}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                  {lang === 'gu'
                    ? `પ્રકરણ ${solution.chapterNumber} • સ્વાધ્યાય ${solution.exerciseNumber} • પ્રશ્ન ${solution.questionNumber}`
                    : `Chapter ${solution.chapterNumber} • Exercise ${solution.exerciseNumber} • Question ${solution.questionNumber}`}
                </h2>
                <p className="text-xs text-indigo-700 font-semibold mt-0.5">
                  📌 {solution.topic[lang]}
                </p>
              </div>

              {/* Notebook Date & Page Stamp */}
              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="border border-slate-300 rounded px-2.5 py-1 bg-slate-50 text-slate-600 shadow-xs">
                  <span className="text-[10px] text-slate-400 block uppercase">PAGE NO</span>
                  <span className="font-bold text-slate-800">{solution.chapterNumber}-{solution.exerciseNumber}-{solution.questionNumber}</span>
                </div>
                <div className="border border-slate-300 rounded px-2.5 py-1 bg-slate-50 text-slate-600 shadow-xs">
                  <span className="text-[10px] text-slate-400 block uppercase">DATE</span>
                  <span className="font-bold text-slate-800">{new Date().toISOString().slice(0, 10)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ruled Notebook Paper Body with Margin Line */}
          <div
            className="notebook-body relative flex min-h-[550px]"
            style={{
              backgroundImage: 'repeating-linear-gradient(white, white 27px, #e2e8f0 28px)',
              backgroundAttachment: 'local',
            }}
          >
            {/* Left Margin (Margin Line in Red) */}
            <div className="notebook-margin-gutter w-12 sm:w-16 border-r-2 border-red-400/80 bg-red-50/20 flex-shrink-0 flex flex-col items-center pt-6 text-xs font-mono font-bold text-red-700 select-none">
              <span className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded text-[11px] mb-6 shadow-xs">
                {lang === 'gu' ? `પ્ર.${solution.questionNumber}` : `Q.${solution.questionNumber}`}
              </span>
              <div className="space-y-12 text-slate-400 text-[10px]">
                <div>(i)</div>
                <div>(ii)</div>
                <div>(iii)</div>
                <div>⇒</div>
                <div>Ans</div>
              </div>
            </div>

            {/* Main Solution Ruled Lines Content */}
            <div className="notebook-ruled-content flex-grow px-4 sm:px-8 py-6 text-slate-800">
              {/* 1. Original Question */}
              <div className="notebook-section mb-6 bg-white/90 p-4 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  {lang === 'gu' ? 'મૂળ પ્રશ્ન (Original Question)' : 'Original Question'}
                </div>
                <div className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
                  <MixedText text={solution.originalQuestion[lang]} />
                </div>
              </div>

              {/* 2. Given Information */}
              <div className="notebook-section mb-5 bg-white/90 p-3.5 rounded-xl border border-blue-200/80 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  {lang === 'gu' ? 'આપેલ વિગત (Given Information)' : 'Given Information'}
                </div>
                <div className="text-sm text-slate-800">
                  {Array.isArray((solution.given as any)[lang] || solution.given) ? (
                    <ul className="list-disc list-inside space-y-1 pl-1">
                      {((solution.given as any)[lang] || solution.given).map((g: string, i: number) => (
                        <li key={i} className="leading-relaxed">
                          <MixedText text={g} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="leading-relaxed">
                      <MixedText text={(solution.given as any)[lang] || String(solution.given)} />
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Required Result */}
              <div className="notebook-section mb-5 bg-white/90 p-3.5 rounded-xl border border-purple-200/80 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  {lang === 'gu' ? 'સાબિત કરવાનું / શોધવાનું (Required Result)' : 'To Find / To Prove'}
                </div>
                <div className="text-sm text-slate-900 font-medium">
                  <MixedText text={solution.requiredResult[lang]} />
                </div>
              </div>

              {/* 4. Formulas / Theorems Used */}
              <div className="notebook-section mb-6 bg-white/90 p-3.5 rounded-xl border border-amber-200/80 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  {lang === 'gu' ? 'મુખ્ય સૂત્ર અથવા પ્રમેય (Formula / Theorem)' : 'Formula / Theorem'}
                </div>
                <div className="text-sm text-slate-900">
                  {Array.isArray((solution.formulaOrTheorem as any)[lang] || solution.formulaOrTheorem) ? (
                    <div className="space-y-1.5">
                      {((solution.formulaOrTheorem as any)[lang] || solution.formulaOrTheorem).map((f: string, i: number) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-amber-700 font-bold">•</span>
                          <div className="leading-relaxed">
                            <MixedText text={f} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="leading-relaxed">
                      <MixedText text={(solution.formulaOrTheorem as any)[lang] || String(solution.formulaOrTheorem)} />
                    </div>
                  )}
                </div>
              </div>

              {/* Interactive Graph if present */}
              {solution.graph && (
                <div className="notebook-section mb-6 bg-white p-3 rounded-xl border border-slate-200">
                  <InteractiveGraph data={solution.graph} lang={lang} />
                </div>
              )}

              {/* Diagram if present */}
              {solution.diagram && (
                <div className="notebook-section mb-6 bg-white p-3 rounded-xl border border-slate-200">
                  <MathDiagram data={solution.diagram} lang={lang} />
                </div>
              )}

              {/* 5. Complete Step-by-Step Solution */}
              <div className="notebook-section mb-8 bg-white/95 p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-4 flex items-center gap-1.5 border-b border-indigo-100 pb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  {lang === 'gu' ? 'પગલુંવાર સંપૂર્ણ ઉકેલ (Step-by-Step Solution)' : 'Step-by-Step Solution'}
                </div>

                <div className="space-y-6">
                  {solution.steps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="solution-step pl-3.5 border-l-2 border-indigo-400 py-1"
                    >
                      {/* Step Header */}
                      <div className="text-sm font-semibold text-slate-900 mb-1.5 flex items-baseline gap-2">
                        <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-bold">
                          {lang === 'gu' ? `પગલું ${step.stepNumber}` : `Step ${step.stepNumber}`}
                        </span>
                        <span>
                          <MixedText text={step.explanation[lang]} />
                        </span>
                      </div>

                      {/* Step Mathematical Expression */}
                      <div className="notebook-math-line bg-slate-50 border border-slate-200/90 rounded-xl p-3 my-2 overflow-x-auto text-slate-900 shadow-2xs">
                        <MathRenderer math={step.math} block={true} />
                      </div>

                      {/* Step Reason */}
                      {step.reason && (
                        <div className="text-xs text-slate-500 italic flex items-center gap-1.5 mt-1 pl-1">
                          <span className="font-semibold text-slate-600">
                            [{lang === 'gu' ? 'કારણ' : 'Reason'}:
                          </span>
                          <MixedText text={step.reason[lang]} />
                          <span>]</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Final Answer Box */}
              <div className="notebook-final-answer my-6 p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50/70 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800">
                    {lang === 'gu' ? 'અંતિમ જવાબ (Final Answer)' : 'Final Answer'}
                  </span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-emerald-950 pl-1 mt-1">
                  <MixedText text={finalAnswerText} />
                </div>
              </div>

              {/* 7. Verification Status Badge */}
              <div className="notebook-verification-footer pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  {solution.verificationStatus === 'verified' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{lang === 'gu' ? 'ચકાસાયેલ સોલ્યુશન (Verified)' : 'Verified Solution'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold border border-amber-300">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>{lang === 'gu' ? 'સમીક્ષા હેઠળ' : 'Under Review'}</span>
                    </span>
                  )}
                  {solution.verifiedBy && (
                    <span className="text-slate-500 text-[11px]">
                      {lang === 'gu' ? `દ્વારા: ${solution.verifiedBy}` : `By: ${solution.verifiedBy}`}
                    </span>
                  )}
                </div>
                {solution.verifiedDate && (
                  <div className="text-slate-400 font-mono text-[11px]">
                    {lang === 'gu' ? `તારીખ: ${solution.verifiedDate}` : `Verified: ${solution.verifiedDate}`}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: CLEAN ACADEMIC TEXTBOOK VIEW                      */}
      {/* ========================================================= */}
      {viewMode === 'textbook' && (
        <div className="textbook-page bg-[#fafaf9] text-stone-900 rounded-2xl p-6 sm:p-10 shadow-lg border border-stone-300 font-serif">
          {/* Header */}
          <div className="border-b-2 border-stone-900 pb-3 mb-6">
            <div className="flex justify-between items-center text-xs font-sans uppercase tracking-widest text-stone-600">
              <span>{lang === 'gu' ? `પ્રકરણ ${solution.chapterNumber}` : `Chapter ${solution.chapterNumber}`}</span>
              <span>{lang === 'gu' ? `સ્વાધ્યાય ${solution.exerciseNumber}` : `Exercise ${solution.exerciseNumber}`}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 mt-2 font-sans">
              {lang === 'gu' ? `પ્રશ્ન ${solution.questionNumber}.` : `Question ${solution.questionNumber}.`}
            </h1>
            <p className="text-xs text-stone-600 font-sans italic mt-0.5">
              {solution.topic[lang]}
            </p>
          </div>

          {/* Question Text */}
          <div className="mb-6 text-base sm:text-lg leading-relaxed text-stone-900 font-sans">
            <MixedText text={solution.originalQuestion[lang]} />
          </div>

          {/* Theorem / Formula Box */}
          <div className="my-6 p-4 border border-stone-400 bg-stone-100 rounded-lg text-sm font-sans">
            <div className="font-bold text-stone-800 uppercase text-xs tracking-wider mb-1.5">
              {lang === 'gu' ? 'પ્રમેય / નિયમ / સૂત્ર' : 'Theorem / Formula Reference'}
            </div>
            <div className="italic text-stone-800">
              {Array.isArray((solution.formulaOrTheorem as any)[lang] || solution.formulaOrTheorem) ? (
                ((solution.formulaOrTheorem as any)[lang] || solution.formulaOrTheorem).map((f: string, i: number) => (
                  <div key={i} className="my-1">
                    <MixedText text={f} />
                  </div>
                ))
              ) : (
                <MixedText text={(solution.formulaOrTheorem as any)[lang] || String(solution.formulaOrTheorem)} />
              )}
            </div>
          </div>

          {/* Solution Body */}
          <div className="my-6 space-y-4 font-sans">
            <div className="font-bold text-sm text-stone-900 uppercase tracking-wider mb-2">
              {lang === 'gu' ? 'ઉકેલ (Solution):' : 'Solution:'}
            </div>

            {solution.steps.map((st) => (
              <div key={st.stepNumber} className="pl-4 border-l border-stone-300">
                <div className="text-sm text-stone-700 mb-1">
                  <span className="font-bold text-stone-900">({st.stepNumber})</span>{' '}
                  <MixedText text={st.explanation[lang]} />
                </div>
                <div className="my-2 py-1 overflow-x-auto text-stone-950">
                  <MathRenderer math={st.math} block={true} />
                </div>
                {st.reason && (
                  <div className="text-xs text-stone-500 italic">
                    ∵ <MixedText text={st.reason[lang]} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Final Answer Conclusion */}
          <div className="mt-8 pt-4 border-t border-stone-300 flex items-center justify-between font-sans">
            <div className="font-bold text-base text-stone-900">
              {lang === 'gu' ? 'જવાબ:' : 'Answer:'}{' '}
              <span className="ml-2 font-mono">
                <MixedText text={finalAnswerText} />
              </span>
            </div>
            <span className="text-stone-700 text-lg select-none" title="Q.E.D. / સાબિતી પૂર્ણ">
              ■
            </span>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 3: STEP-BY-STEP INTERACTIVE DISCLOSURE VIEW          */}
      {/* ========================================================= */}
      {viewMode === 'interactive' && (
        <div className="interactive-stepper-page bg-slate-900 text-slate-100 rounded-2xl p-5 sm:p-8 border border-slate-800 shadow-xl">
          {/* Header & Stepper Progress */}
          <div className="mb-6 pb-4 border-b border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <span className="px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono text-xs uppercase">
                {lang === 'gu' ? 'પગલુંવાર માર્ગદર્શિત અધ્યયન' : 'Guided Step-by-Step Study'}
              </span>
              <span className="font-mono text-xs text-indigo-400 font-bold">
                {lang === 'gu' ? `પગલું ${revealedStepIndex} / ${totalSteps}` : `Step ${revealedStepIndex} of ${totalSteps}`}
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-indigo-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${(revealedStepIndex / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Original Question Card */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 mb-6">
            <div className="text-xs uppercase font-mono tracking-wider text-indigo-400 mb-1">
              {lang === 'gu' ? 'મૂળ પ્રશ્ન' : 'Problem Statement'}
            </div>
            <div className="text-base sm:text-lg text-white font-medium">
              <MixedText text={solution.originalQuestion[lang]} />
            </div>
          </div>

          {/* Visible Steps up to revealedStepIndex */}
          <div className="space-y-4 mb-6">
            {solution.steps.slice(0, revealedStepIndex).map((st) => {
              const isUnderstood = understoodSteps[st.stepNumber];
              return (
                <div
                  key={st.stepNumber}
                  className="p-4 bg-slate-800/60 border border-slate-700/80 rounded-xl transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono text-xs font-bold border border-indigo-800/60">
                      {lang === 'gu' ? `પગલું ${st.stepNumber}` : `Step ${st.stepNumber}`}
                    </span>

                    {/* Step Self-Check Toggle */}
                    <button
                      onClick={() => toggleStepUnderstood(st.stepNumber)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        isUnderstood
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-600/50'
                          : 'bg-slate-700/70 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isUnderstood ? (lang === 'gu' ? 'સમજાઈ ગયું ✓' : 'Understood ✓') : (lang === 'gu' ? 'સમજાયું?' : 'Understood?')}</span>
                    </button>
                  </div>

                  <div className="text-sm font-medium text-slate-200 mb-2 leading-relaxed">
                    <MixedText text={st.explanation[lang]} />
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg overflow-x-auto text-white">
                    <MathRenderer math={st.math} block={true} />
                  </div>

                  {st.reason && (
                    <div className="mt-2 text-xs text-indigo-300 italic pl-1">
                      💡 [{lang === 'gu' ? 'કારણ' : 'Reason'}: <MixedText text={st.reason[lang]} />]
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Stepper Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                disabled={revealedStepIndex <= 1}
                onClick={() => setRevealedStepIndex((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {lang === 'gu' ? '← પાછળનું પગલું' : '← Previous Step'}
              </button>

              <button
                disabled={revealedStepIndex >= totalSteps}
                onClick={() => setRevealedStepIndex((prev) => Math.min(totalSteps, prev + 1))}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-indigo-600/30 transition-all"
              >
                {lang === 'gu' ? 'આગળનું પગલું →' : 'Next Step →'}
              </button>
            </div>

            <button
              onClick={() =>
                setRevealedStepIndex((prev) => (prev === totalSteps ? 1 : totalSteps))
              }
              className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
            >
              {revealedStepIndex === totalSteps
                ? lang === 'gu' ? 'પ્રથમ પગલાં પર પાછા ફરો' : 'Reset to Step 1'
                : lang === 'gu' ? 'બધા પગલાં દર્શાવો' : 'Reveal All Steps'}
            </button>
          </div>

          {/* Final Answer revealed when all steps are seen */}
          {revealedStepIndex === totalSteps && (
            <div className="mt-6 p-4 rounded-xl border border-emerald-600/70 bg-emerald-950/40 text-emerald-200">
              <div className="flex items-center gap-2 font-bold mb-1">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>{lang === 'gu' ? 'અંતિમ પરિણામ (Final Answer):' : 'Final Answer:'}</span>
              </div>
              <div className="text-lg font-bold pl-7 font-mono">
                <MixedText text={finalAnswerText} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Footer Note */}
      <div className="text-center text-xs text-slate-500 mt-4 print:hidden">
        {lang === 'gu'
          ? 'ધોરણ ૧૨ ગણિત • ગુજરાત માધ્યમિક અને ઉચ્ચતર માધ્યમિક શિક્ષણ બોર્ડ'
          : 'GSEB Std. 12 Mathematics Learning Engine • Gujarati Medium'}
      </div>
    </div>
  );
}
