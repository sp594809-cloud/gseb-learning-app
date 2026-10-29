'use client';

import React from 'react';
import { SolutionItem, Language } from '@/types/solution';
import { MathRenderer, MixedText } from './MathRenderer';
import { MathGraph } from './MathGraph';
import { MathDiagram } from './MathDiagram';
import { CheckCircle2, Bookmark, BookmarkCheck, Printer, ShieldCheck, AlertCircle, Clock } from 'lucide-react';

interface NotebookPageProps {
  solution: SolutionItem;
  lang: Language;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  isCompleted: boolean;
  onToggleComplete: (id: string) => void;
}

export function NotebookPage({
  solution,
  lang,
  isBookmarked,
  onToggleBookmark,
  isCompleted,
  onToggleComplete,
}: NotebookPageProps) {
  const handlePrint = () => {
    window.print();
  };

  const finalAnswerText = typeof solution.finalAnswer === 'string'
    ? solution.finalAnswer
    : solution.finalAnswer[lang];

  return (
    <div className="notebook-container w-full max-w-4xl mx-auto my-6 px-2 sm:px-4">
      {/* Notebook Action Toolbar (hidden during print) */}
      <div className="notebook-toolbar print:hidden flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-900/80 backdrop-blur border border-slate-800 p-3 rounded-xl text-sm">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono text-xs font-semibold">
            {solution.id}
          </span>
          <span className="text-slate-400 text-xs hidden sm:inline">
            {lang === 'gu' ? 'ધોરણ ૧૨ ગણિત સોલ્યુશન' : 'Std. 12 Maths Solution'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(solution.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs font-medium ${
              isBookmarked
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title={lang === 'gu' ? 'બુકમાર્ક કરો' : 'Bookmark question'}
          >
            {isBookmarked ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'gu' ? 'સાચવેલ' : 'Saved'}</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span>{lang === 'gu' ? 'બુકમાર્ક' : 'Bookmark'}</span>
              </>
            )}
          </button>

          {/* Mark as Completed */}
          <button
            onClick={() => onToggleComplete(solution.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs font-medium ${
              isCompleted
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title={lang === 'gu' ? 'પૂર્ણ તરીકે ચિહ્નિત કરો' : 'Mark as learned'}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>
              {isCompleted
                ? lang === 'gu' ? 'શીખી લીધું ✓' : 'Learned ✓'
                : lang === 'gu' ? 'પૂર્ણ ચિહ્નિત કરો' : 'Mark Learned'}
            </span>
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-sm transition-all"
            title={lang === 'gu' ? 'નોટબુક પેજ પ્રિન્ટ કરો' : 'Print notebook solution'}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{lang === 'gu' ? 'પ્રિન્ટ / PDF' : 'Print / PDF'}</span>
          </button>
        </div>
      </div>

      {/* Realistic Notebook Page */}
      <div className="notebook-page relative bg-white text-slate-900 rounded-lg shadow-xl border border-slate-300 overflow-hidden font-sans print:shadow-none print:border-none print:m-0 print:p-0">
        
        {/* Top Notebook Header Strip */}
        <div className="notebook-header-band bg-white px-6 sm:px-10 pt-6 pb-4 border-b-2 border-red-400/80">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-red-600 font-bold font-mono">
                  GSEB CLASS 12 MATHEMATICS
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-xs text-slate-600 font-medium">
                  {lang === 'gu' ? 'ગુજરાત માધ્યમિક શિક્ષણ બોર્ડ' : 'Gujarat Secondary Education Board'}
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
              <div className="border border-slate-300 rounded px-2.5 py-1 bg-slate-50 text-slate-600">
                <span className="text-[10px] text-slate-400 block uppercase">PAGE NO</span>
                <span className="font-bold text-slate-800">{solution.chapterNumber}-{solution.exerciseNumber}-{solution.questionNumber}</span>
              </div>
              <div className="border border-slate-300 rounded px-2.5 py-1 bg-slate-50 text-slate-600">
                <span className="text-[10px] text-slate-400 block uppercase">DATE</span>
                <span className="font-bold text-slate-800">{new Date().toISOString().slice(0, 10)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ruled Notebook Paper Body with Margin Line */}
        <div className="notebook-body relative flex min-h-[500px]">
          
          {/* Left Margin (Margin Line in Red) */}
          <div className="notebook-margin-gutter w-12 sm:w-16 border-r-2 border-red-400/80 bg-red-50/15 flex-shrink-0 flex flex-col items-center pt-6 text-xs font-mono font-bold text-red-700 select-none">
            <span className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded text-[11px] mb-6">
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
            <div className="notebook-section mb-6 pb-4 border-b border-dashed border-slate-300">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                {lang === 'gu' ? 'મૂળ પ્રશ્ન (Original Question)' : 'Original Question'}
              </div>
              <div className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed pl-1">
                <MixedText text={solution.originalQuestion[lang]} />
              </div>
            </div>

            {/* 2. Given Information */}
            <div className="notebook-section mb-5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                {lang === 'gu' ? 'આપેલ વિગત (Given Information)' : 'Given Information'}
              </div>
              <div className="bg-blue-50/60 border border-blue-200/60 rounded-lg p-3 text-sm text-slate-800">
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
            <div className="notebook-section mb-5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                {lang === 'gu' ? 'સાબિત કરવાનું / શોધવાનું (Required Result)' : 'To Find / To Prove'}
              </div>
              <div className="bg-purple-50/60 border border-purple-200/60 rounded-lg p-3 text-sm text-slate-800 font-medium">
                <MixedText text={solution.requiredResult[lang]} />
              </div>
            </div>

            {/* 4. Formulas / Theorems Used */}
            <div className="notebook-section mb-6">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                {lang === 'gu' ? 'મુખ્ય સૂત્ર અથવા પ્રમેય (Formula / Theorem)' : 'Formula / Theorem'}
              </div>
              <div className="bg-amber-50/60 border border-amber-200/70 rounded-lg p-3 text-sm text-slate-900">
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

            {/* Rich Media: Graphs or Diagrams if present */}
            {solution.graph && (
              <div className="notebook-section mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  {lang === 'gu' ? 'આલેખ નિરૂપણ (Graph Representation)' : 'Graph Representation'}
                </div>
                <MathGraph data={solution.graph} lang={lang} />
              </div>
            )}

            {solution.diagram && (
              <div className="notebook-section mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                  {lang === 'gu' ? 'ભૂમિતિ / સદિશ આકૃતિ (Diagram)' : 'Diagram'}
                </div>
                <MathDiagram data={solution.diagram} lang={lang} />
              </div>
            )}

            {/* Rich Media: Structured Tables if present */}
            {solution.table && (
              <div className="notebook-section mb-6 overflow-x-auto">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  {solution.table.title ? solution.table.title[lang] : lang === 'gu' ? 'કોષ્ટક (Table)' : 'Table'}
                </div>
                <table className="w-full text-xs sm:text-sm text-left border-collapse border border-slate-300 bg-white">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300">
                      {solution.table.headers.map((h, hIdx) => (
                        <th key={hIdx} className="p-2.5 font-bold text-slate-700 border-r border-slate-300 last:border-r-0">
                          {typeof h === 'object' ? h[lang] : h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {solution.table.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="border-b border-slate-200 hover:bg-slate-50">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-2.5 text-slate-800 border-r border-slate-200 last:border-r-0">
                            {typeof cell === 'object' ? cell[lang] : String(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 5. Complete Step-by-Step Solution */}
            <div className="notebook-section mb-8">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-1.5 border-b border-indigo-200 pb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                {lang === 'gu' ? 'પગલુંવાર સંપૂર્ણ ઉકેલ (Step-by-Step Solution)' : 'Step-by-Step Solution'}
              </div>

              <div className="space-y-5">
                {solution.steps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="solution-step pl-3 border-l-2 border-indigo-300/80 py-1"
                  >
                    {/* Step Title / Explanation */}
                    <div className="text-sm font-semibold text-slate-800 mb-1 flex items-baseline gap-2">
                      <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                        પગલું {step.stepNumber}
                      </span>
                      <span>
                        <MixedText text={step.explanation[lang]} />
                      </span>
                    </div>

                    {/* Step Mathematical Expression */}
                    <div className="notebook-math-line bg-slate-50/80 border border-slate-200 rounded-lg p-2.5 my-1.5 overflow-x-auto text-slate-900">
                      <MathRenderer math={step.math} block={true} />
                    </div>

                    {/* Step Reason / Justification */}
                    {step.reason && (
                      <div className="text-xs text-slate-500 italic flex items-center gap-1 mt-1 pl-1">
                        <span className="font-sans font-semibold text-slate-600">
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

            {/* Subquestions (if any) */}
            {solution.subQuestions && solution.subQuestions.length > 0 && (
              <div className="notebook-section mb-8 pl-3 border-l-2 border-slate-300">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                  {lang === 'gu' ? 'પેટા પ્રશ્નો (Sub-Questions)' : 'Sub-Questions'}
                </div>
                <div className="space-y-4">
                  {solution.subQuestions.map((sub) => (
                    <div key={sub.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="font-bold text-sm text-slate-900 mb-1">
                        {sub.questionNumber}. <MixedText text={sub.originalQuestion[lang]} />
                      </div>
                      {sub.steps.map((s) => (
                        <div key={s.stepNumber} className="my-1.5 text-xs">
                          <span className="text-slate-600">{s.explanation[lang]}:</span>
                          <MathRenderer math={s.math} block={true} />
                        </div>
                      ))}
                      <div className="mt-2 text-xs font-bold text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-200">
                        {lang === 'gu' ? 'જવાબ' : 'Answer'}: <MixedText text={typeof sub.finalAnswer === 'string' ? sub.finalAnswer : sub.finalAnswer[lang]} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Final Answer Box (Authentic Notebook Highlight Box) */}
            <div className="notebook-final-answer my-6 p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50/50 shadow-sm">
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
                ) : solution.verificationStatus === 'under_review' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold border border-blue-300">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>{lang === 'gu' ? 'સમીક્ષા હેઠળ (Under Review)' : 'Under Review'}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold border border-amber-300">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>{lang === 'gu' ? 'અચકાસાયેલ (Unverified)' : 'Unverified'}</span>
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

        {/* Notebook Bottom Ruled Footer Line */}
        <div className="notebook-footer-band px-6 py-2 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-400 font-mono">
          GSEB Std. 12 Mathematics (ગુજરાત માધ્યમિક અને ઉચ્ચતર માધ્યમિક શિક્ષણ બોર્ડ) • Made for Students
        </div>
      </div>
    </div>
  );
}
