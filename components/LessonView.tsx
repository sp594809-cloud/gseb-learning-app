'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import katex from 'katex';
import { Lesson, Language } from '../data/lessons';
import StepControls from './StepControls';
import FunctionGraph from './FunctionGraph';

function MathText({ value }: { value: string }) {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(value, { throwOnError: false, output: 'html' }),
      }}
    />
  );
}

function Mixed({ value }: { value: string }) {
  const parts = value.split(/(\\\([^)]*\\\))/g);
  return (
    <span>
      {parts.map((p, i) =>
        p.startsWith('\\(') && p.endsWith('\\)') ? (
          <MathText key={i} value={p.slice(2, -2)} />
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </span>
  );
}

type Props = {
  lesson: Lesson;
  lang: Language;
  onLangToggle: () => void;
  backHref?: string;
};

export default function LessonView({ lesson, lang, onLangToggle, backHref = '/' }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState<string[]>([]);
  const [tab, setTab] = useState<'solution' | 'quiz' | 'graph'>('solution');
  const [stepIdx, setStepIdx] = useState(-1);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    try {
      setAnswers(JSON.parse(localStorage.getItem('gseb-answers') || '{}'));
      setDone(JSON.parse(localStorage.getItem('gseb-done') || '[]'));
    } catch {}
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    setStepIdx(-1);
    setTab('solution');
  }, [lesson.id]);

  const choose = (id: string, n: number) => {
    const updated = { ...answers, [id]: n };
    setAnswers(updated);
    localStorage.setItem('gseb-answers', JSON.stringify(updated));
  };

  const complete = (id: string) => {
    const updated = Array.from(new Set([...done, id]));
    setDone(updated);
    localStorage.setItem('gseb-done', JSON.stringify(updated));
  };

  const steps = lesson.worked.steps[lang];
  const visibleCount = stepIdx < 0 ? 0 : Math.min(stepIdx + 1, steps.length);

  return (
    <>
      <header className="top">
        <div className="brand">
          <span className="logo">∫</span>
          <span>
            GSEB <span style={{ color: '#a78bfa' }}>Learning Hub</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="pill" onClick={() => setReducedMotion((v) => !v)}>
            {reducedMotion
              ? lang === 'gu' ? 'એનિમેશન બંધ' : 'Motion off'
              : lang === 'gu' ? 'એનિમેશન ચાલુ' : 'Motion on'}
          </button>
          <button className="pill" onClick={onLangToggle}>
            🌐 {lang === 'en' ? 'English · ગુજરાતી' : 'ગુજરાતી · English'}
          </button>
        </div>
      </header>

      <div style={{ marginTop: 28 }}>
        <Link href={backHref} className="pill" style={{ textDecoration: 'none', display: 'inline-block' }}>
          ← {lang === 'en' ? 'Dashboard' : 'ડેશબોર્ડ'}
        </Link>
      </div>

      <div className="section">
        <div>
          <div className="tag">CHAPTER {lesson.chapter}</div>
          <h1>{lesson.title[lang]}</h1>
          <p className="muted">{lesson.subtitle[lang]}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, margin: '20px 0', flexWrap: 'wrap' }}>
        <button className={'pill ' + (tab === 'solution' ? 'active' : '')} onClick={() => setTab('solution')}>
          {lang === 'en' ? 'Worked solution' : 'ઉકેલ'}
        </button>
        {lesson.graph && (
          <button className={'pill ' + (tab === 'graph' ? 'active' : '')} onClick={() => setTab('graph')}>
            {lang === 'en' ? 'Explore graph' : 'આલેખ શોધો'}
          </button>
        )}
        <button className={'pill ' + (tab === 'quiz' ? 'active' : '')} onClick={() => setTab('quiz')}>
          {lang === 'en' ? 'Practice MCQ' : 'MCQ પ્રેક્ટિસ'}
        </button>
      </div>

      {tab === 'solution' && (
        <section className="panel working notebook">
          <div className="tag">{lang === 'en' ? 'Key formula' : 'મુખ્ય સૂત્ર'}</div>
          <p style={{ fontSize: 22 }}>
            <MathText value={lesson.formula} />
          </p>
          <h2>{lang === 'en' ? 'Example' : 'ઉદાહરણ'}</h2>
          <p style={{ fontSize: 22 }}>
            <MathText value={lesson.worked.question} />
          </p>

          <StepControls
            total={steps.length}
            current={stepIdx}
            lang={lang}
            onPrev={() => setStepIdx((s) => Math.max(-1, s - 1))}
            onNext={() => setStepIdx((s) => Math.min(steps.length - 1, s + 1))}
            onShowAll={() => setStepIdx(steps.length - 1)}
            onReset={() => setStepIdx(-1)}
          />

          <ol className="steps">
            {steps.slice(0, visibleCount).map((s, i) => (
              <li key={i} className={i === stepIdx ? 'step-current' : ''}>
                <Mixed value={s} />
              </li>
            ))}
          </ol>

          {visibleCount === steps.length && steps.length > 0 && (
            <div className="final-answer">
              <h3>
                {lang === 'en' ? 'Final answer' : 'અંતિમ જવાબ'}:{' '}
                <MathText value={lesson.worked.answer} />
              </h3>
            </div>
          )}

          {lesson.graph && visibleCount > 0 && (
            <div style={{ marginTop: 18 }}>
              <button className="btn secondary" onClick={() => setTab('graph')}>
                {lang === 'en' ? 'See matching graph →' : 'સંબંધિત આલેખ જુઓ →'}
              </button>
            </div>
          )}

          <button className="btn" style={{ marginTop: 16 }} onClick={() => complete(lesson.id)}>
            ✓{' '}
            {done.includes(lesson.id)
              ? lang === 'en' ? 'Completed' : 'પૂર્ણ થયું'
              : lang === 'en' ? 'Mark as learned' : 'શીખી લીધું'}
          </button>
        </section>
      )}

      {tab === 'graph' && lesson.graph && (
        <section className="panel">
          <FunctionGraph config={lesson.graph} lang={lang} activeStep={stepIdx} reducedMotion={reducedMotion} />
          <button className="btn secondary" style={{ marginTop: 12 }} onClick={() => setTab('solution')}>
            {lang === 'en' ? '← Back to solution' : '← ઉકેલ પર પાછા'}
          </button>
        </section>
      )}

      {tab === 'quiz' && (
        <section className="panel">
          {lesson.questions.map((q, index) => (
            <div key={q.id} style={{ marginBottom: 32 }}>
              <div className="tag">
                {lang === 'en' ? 'Question' : 'પ્રશ્ન'} {index + 1}
              </div>
              <h2>
                <MathText value={q.prompt} />
              </h2>
              <div className="choices">
                {q.options.map((option, i) => (
                  <button
                    key={i}
                    className={'choice ' + (answers[q.id] === i ? 'selected' : '')}
                    onClick={() => choose(q.id, i)}
                  >
                    <MathText value={option} />
                  </button>
                ))}
              </div>
              {answers[q.id] !== undefined && (
                <div className="feedback">
                  <b>
                    {answers[q.id] === q.correct
                      ? lang === 'en' ? '✓ Correct' : '✓ સાચું'
                      : lang === 'en' ? 'Review this answer' : 'જવાબ ફરી જુઓ'}
                  </b>
                  <p>{q.explanation[lang]}</p>
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </>
  );
}
