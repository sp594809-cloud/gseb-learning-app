'use client';

import React, { useState } from 'react';
import { SolutionItem, Language } from '@/types/solution';
import { MixedText } from './MathRenderer';
import {
  verifyStudentPracticeAnswer,
  MathCheckResult,
} from '@/lib/math-checker';
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  ChevronRight,
  Eye,
  RefreshCw,
  HelpCircle,
  Send,
  Calculator,
  AlertTriangle,
} from 'lucide-react';

interface PracticeModeProps {
  solution: SolutionItem;
  lang: Language;
  onViewNotebook: () => void;
  onRecordScore?: (questionId: string, isCorrect: boolean) => void;
}

export function PracticeMode({
  solution,
  lang,
  onViewNotebook,
  onRecordScore,
}: PracticeModeProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textInput, setTextInput] = useState<string>('');
  const [checkResult, setCheckResult] = useState<MathCheckResult | null>(null);
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [revealedSteps, setRevealedSteps] = useState<number>(0);

  const hintsList = solution.hints ? solution.hints[lang] || [] : [];
  const options = solution.practiceOptions || [];
  const hasFreeForm = !!solution.practiceValidation;

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
    const result = verifyStudentPracticeAnswer(solution, { selectedOptionIndex: index });
    setCheckResult(result);
    onRecordScore?.(solution.id, result.isCorrect);
  };

  const handleSubmitTextAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const result = verifyStudentPracticeAnswer(solution, { textInput });
    setCheckResult(result);
    onRecordScore?.(solution.id, result.isCorrect);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setTextInput('');
    setCheckResult(null);
    setRevealedHints(0);
    setRevealedSteps(0);
  };

  return (
    <div className="practice-container w-full max-w-4xl mx-auto my-6 px-2 sm:px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-2xl text-slate-100">
        {/* Practice Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
          <div>
            <span className="px-2.5 py-1 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono text-xs uppercase tracking-wide">
              {lang === 'gu' ? 'સ્વ-મૂલ્યાંકન અને બુદ્ધિગમ્ય પ્રેક્ટિસ' : 'Intelligent Practice Engine'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-2 text-white">
              {lang === 'gu'
                ? `પ્રકરણ ${solution.chapterNumber} • સ્વાધ્યાય ${solution.exerciseNumber} • પ્રશ્ન ${solution.questionNumber}`
                : `Chapter ${solution.chapterNumber} • Exercise ${solution.exerciseNumber} • Question ${solution.questionNumber}`}
            </h2>
            <p className="text-slate-400 text-sm mt-0.5">{solution.topic[lang]}</p>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all border border-slate-700"
            title={lang === 'gu' ? 'ફરીથી પ્રયાસ કરો' : 'Reset practice attempt'}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{lang === 'gu' ? 'રીસેટ' : 'Reset'}</span>
          </button>
        </div>

        {/* Question Prompt */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 mb-6 shadow-sm">
          <div className="text-xs uppercase font-mono tracking-wider text-indigo-400 mb-2 font-bold">
            {lang === 'gu' ? 'પ્રશ્ન (Question):' : 'Question:'}
          </div>
          <div className="text-lg sm:text-xl font-medium text-white leading-relaxed">
            <MixedText text={solution.originalQuestion[lang]} />
          </div>
        </div>

        {/* Hints Reveal Section */}
        {hintsList.length > 0 && (
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                {lang === 'gu' ? 'મદદરૂપ સંકેતો (Hints)' : 'Helpful Hints'}
              </span>

              {revealedHints < hintsList.length && (
                <button
                  onClick={() => setRevealedHints((h) => Math.min(hintsList.length, h + 1))}
                  className="text-xs text-amber-300 hover:text-amber-200 underline font-semibold"
                >
                  {lang === 'gu' ? `સંકેત ${revealedHints + 1} દર્શાવો →` : `Reveal Hint ${revealedHints + 1} →`}
                </button>
              )}
            </div>

            {revealedHints > 0 && (
              <div className="space-y-2">
                {hintsList.slice(0, revealedHints).map((hint, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-xl text-sm text-amber-200 flex items-start gap-2.5"
                  >
                    <span className="font-bold text-amber-400">💡 {idx + 1}.</span>
                    <div className="leading-relaxed">
                      <MixedText text={hint} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mode A: Free-form Mathematical Input (Numerical, Fraction, or Algebraic) */}
        {hasFreeForm && (
          <div className="mb-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {solution.practiceValidation?.type === 'fraction'
                  ? lang === 'gu' ? 'ચોક્કસ અપૂર્ણાંક જવાબ દાખલ કરો (દા.ત. 3/4 અથવા -1/2):' : 'Enter exact fraction (e.g. 3/4 or -1/2):'
                  : solution.practiceValidation?.type === 'numerical'
                  ? lang === 'gu' ? 'સંખ્યાત્મક મૂલ્ય દાખલ કરો:' : 'Enter numerical value:'
                  : lang === 'gu' ? 'બીજગાણિતિક પદાવલિ દાખલ કરો:' : 'Enter algebraic expression:'}
              </span>
            </div>

            <form onSubmit={handleSubmitTextAnswer} className="flex gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={
                  solution.practiceValidation?.type === 'fraction'
                    ? '3/4, -1/2...'
                    : solution.practiceValidation?.type === 'numerical'
                    ? '18, 3.14...'
                    : 'x^2 - 1, sin(x)...'
                }
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-hidden focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30"
              >
                <Send className="w-4 h-4" />
                <span>{lang === 'gu' ? 'ચકાસો' : 'Verify'}</span>
              </button>
            </form>
          </div>
        )}

        {/* Mode B: Multiple Choice Options */}
        {options.length > 0 && (
          <div className="mb-6">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              {lang === 'gu' ? 'યોગ્ય વિકલ્પ પસંદ કરો:' : 'Select the correct option:'}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                let cardStyle =
                  'bg-slate-800/60 border-slate-700 hover:border-slate-500 text-slate-200';

                if (isSelected && checkResult) {
                  if (checkResult.isCorrect) {
                    cardStyle =
                      'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-900/20';
                  } else {
                    cardStyle =
                      'bg-rose-950/40 border-rose-500 text-rose-200 shadow-md shadow-rose-900/20';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-4 rounded-xl border text-left transition-all relative ${cardStyle}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-base leading-relaxed">
                        <MixedText text={option.text} />
                      </div>
                      {isSelected && checkResult && (
                        <div>
                          {checkResult.isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Unified Verification Feedback Card */}
        {checkResult && (
          <div
            className={`my-6 p-4 rounded-xl border ${
              checkResult.status === 'correct'
                ? 'bg-emerald-950/50 border-emerald-600/70 text-emerald-200'
                : checkResult.status === 'cannot_verify'
                ? 'bg-amber-950/50 border-amber-600/70 text-amber-200'
                : 'bg-rose-950/50 border-rose-600/70 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1">
              {checkResult.status === 'correct' && (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>{lang === 'gu' ? '✓ શાબાશ! તમારો જવાબ સાચો છે.' : '✓ Correct Answer!'}</span>
                </>
              )}
              {checkResult.status === 'incorrect' && (
                <>
                  <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  <span>{lang === 'gu' ? '✗ ખોટો જવાબ. સ્પષ્ટીકરણ વાંચો:' : '✗ Incorrect. Review explanation:'}</span>
                </>
              )}
              {checkResult.status === 'cannot_verify' && (
                <>
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span>{lang === 'gu' ? '⚠️ સ્વયંચાલિત ચકાસણી શક્ય નથી' : '⚠️ Cannot automatically verify'}</span>
                </>
              )}
            </div>
            <div className="text-sm pl-7 mt-1">
              <MixedText text={checkResult.feedback[lang]} />
            </div>
          </div>
        )}

        {/* Guided Step Reveal */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {lang === 'gu' ? 'માર્ગદર્શિત ઉકેલ પગલાં' : 'Guided Solution Steps'}
            </span>
            {revealedSteps < solution.steps.length && (
              <button
                onClick={() => setRevealedSteps((s) => Math.min(solution.steps.length, s + 1))}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>
                  {lang === 'gu'
                    ? `પગલું ${revealedSteps + 1} દર્શાવો`
                    : `Show Step ${revealedSteps + 1}`}
                </span>
              </button>
            )}
          </div>

          {revealedSteps > 0 && (
            <div className="space-y-3 mb-4">
              {solution.steps.slice(0, revealedSteps).map((st) => (
                <div
                  key={st.stepNumber}
                  className="p-3 bg-slate-800/70 border border-slate-700 rounded-lg text-sm"
                >
                  <div className="font-semibold text-slate-200 mb-1">
                    {lang === 'gu' ? `પગલું ${st.stepNumber}:` : `Step ${st.stepNumber}:`}{' '}
                    <MixedText text={st.explanation[lang]} />
                  </div>
                  <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800 overflow-x-auto text-white">
                    <MixedText text={st.math} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Jump to Complete Notebook Solution */}
          <div className="flex justify-end mt-4">
            <button
              onClick={onViewNotebook}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>{lang === 'gu' ? 'સંપૂર્ણ નોટબુક પેજ જુઓ' : 'View Full Notebook Page'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
