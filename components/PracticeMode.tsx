'use client';

import React, { useState } from 'react';
import { SolutionItem, Language } from '@/types/solution';
import { MixedText } from './MathRenderer';
import { CheckCircle2, XCircle, Lightbulb, ChevronRight, Eye, RefreshCw } from 'lucide-react';

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
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [revealedSteps, setRevealedSteps] = useState<number>(0);

  const hintsList = solution.hints ? solution.hints[lang] || [] : [];
  const options = solution.practiceOptions || [];

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
    if (options[index]) {
      onRecordScore?.(solution.id, options[index].isCorrect);
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setRevealedHints(0);
    setRevealedSteps(0);
  };

  return (
    <div className="practice-container w-full max-w-4xl mx-auto my-6 px-2 sm:px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-xl text-slate-100">
        
        {/* Practice Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
          <div>
            <span className="px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono text-xs uppercase">
              {lang === 'gu' ? 'સ્વ-મૂલ્યાંકન અને પ્રેક્ટિસ' : 'Self-Assessment & Practice'}
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
            title={lang === 'gu' ? 'ફરીથી પ્રયાસ કરો' : 'Reset practice'}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{lang === 'gu' ? 'રીસેટ' : 'Reset'}</span>
          </button>
        </div>

        {/* Question Prompt */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 mb-6">
          <div className="text-xs uppercase font-mono tracking-wider text-indigo-400 mb-2">
            {lang === 'gu' ? 'પ્રશ્ન' : 'Question'}
          </div>
          <div className="text-lg sm:text-xl font-medium text-white leading-relaxed">
            <MixedText text={solution.originalQuestion[lang]} />
          </div>
        </div>

        {/* Step-by-Step Hint Reveals */}
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
                  className="text-xs text-amber-300 hover:text-amber-200 underline font-medium"
                >
                  {lang === 'gu' ? `સંકેત ${revealedHints + 1} જુઓ →` : `Reveal Hint ${revealedHints + 1} →`}
                </button>
              )}
            </div>

            {revealedHints > 0 && (
              <div className="space-y-2">
                {hintsList.slice(0, revealedHints).map((hint, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-lg text-sm text-amber-200 flex items-start gap-2"
                  >
                    <span className="font-bold text-amber-400">💡 {idx + 1}.</span>
                    <div>
                      <MixedText text={hint} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Practice Options (MCQ mode) */}
        {options.length > 0 && (
          <div className="mb-6">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              {lang === 'gu' ? 'યોગ્ય વિકલ્પ પસંદ કરો:' : 'Select the correct option:'}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                let cardStyle = 'bg-slate-800/60 border-slate-700 hover:border-slate-500 text-slate-200';

                if (isSelected) {
                  if (option.isCorrect) {
                    cardStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-900/20';
                  } else {
                    cardStyle = 'bg-rose-950/40 border-rose-500 text-rose-200 shadow-md shadow-rose-900/20';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-4 rounded-xl border text-left transition-all relative ${cardStyle}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-base">
                        <MixedText text={option.text} />
                      </div>
                      {isSelected && (
                        <div>
                          {option.isCorrect ? (
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

            {/* Answer Feedback */}
            {selectedOption !== null && options[selectedOption] && (
              <div
                className={`mt-4 p-4 rounded-xl border ${
                  options[selectedOption].isCorrect
                    ? 'bg-emerald-950/50 border-emerald-600/70 text-emerald-200'
                    : 'bg-rose-950/50 border-rose-600/70 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  {options[selectedOption].isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>{lang === 'gu' ? '✓ શાબાશ! તમારો જવાબ સાચો છે.' : '✓ Well done! Correct answer.'}</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-400" />
                      <span>{lang === 'gu' ? '✗ ખોટો જવાબ. ફરી પ્રયત્ન કરો અથવા સ્પષ્ટીકરણ વાંચો:' : '✗ Incorrect. Check explanation:'}</span>
                    </>
                  )}
                </div>
                <div className="text-sm pl-7 mt-1">
                  <MixedText text={options[selectedOption].explanation[lang]} />
                </div>
              </div>
            )}
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
                    પગલું {st.stepNumber}: <MixedText text={st.explanation[lang]} />
                  </div>
                  <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800">
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
