'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { lessons, Language } from '../data/lessons';

export default function Home() {
  const [lang, setLang] = useState<Language>('gu');
  const [done, setDone] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      setDone(JSON.parse(localStorage.getItem('gseb-done') || '[]'));
      setAnswers(JSON.parse(localStorage.getItem('gseb-answers') || '{}'));
    } catch {}
  }, []);

  const questions = lessons.flatMap((l) => l.questions);
  const answered = questions.filter((q) => answers[q.id] !== undefined).length;
  const correct = questions.filter((q) => answers[q.id] === q.correct).length;
  const continueId = lessons.find((l) => l.id === 'inc-dec')?.id || lessons[0].id;

  return (
    <main className="shell">
      <header className="top">
        <div className="brand">
          <span className="logo">∫</span>
          <span>
            GSEB <span style={{ color: '#a78bfa' }}>Learning Hub</span>
          </span>
        </div>
        <button className="pill" onClick={() => setLang(lang === 'en' ? 'gu' : 'en')}>
          🌐 {lang === 'en' ? 'English · ગુજરાતી' : 'ગુજરાતી · English'}
        </button>
      </header>

      <div className="hero">
        <div className="tag">Class 12 · Mathematics · Demo</div>
        <h1>{lang === 'en' ? 'Make every step count.' : 'દરેક પગલું મહત્વનું છે.'}</h1>
        <p>
          {lang === 'en'
            ? 'Learn with worked examples, practice MCQs and track your progress. Built for Gujarati and English-medium students.'
            : 'ઉદાહરણો દ્વારા શીખો, MCQ પ્રેક્ટિસ કરો અને તમારી પ્રગતિ જુઓ. ગુજરાતી અને અંગ્રેજી માધ્યમ માટે.'}
        </p>
        <Link href={`/lesson/${continueId}`} className="btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
          {lang === 'en' ? 'Continue learning →' : 'અભ્યાસ શરૂ કરો →'}
        </Link>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="muted">{lang === 'en' ? 'Lessons completed' : 'પૂર્ણ પાઠ'}</div>
          <strong>
            {done.length}/{lessons.length}
          </strong>
        </div>
        <div className="stat">
          <div className="muted">{lang === 'en' ? 'Questions attempted' : 'પ્રયત્ન કરેલા પ્રશ્નો'}</div>
          <strong>
            {answered}/{questions.length}
          </strong>
        </div>
        <div className="stat">
          <div className="muted">{lang === 'en' ? 'Correct answers' : 'સાચા જવાબ'}</div>
          <strong>{correct}</strong>
        </div>
      </div>

      <div className="section">
        <h2>{lang === 'en' ? 'Explore chapters' : 'પ્રકરણો જુઓ'}</h2>
        <span className="muted">{lessons.length} lessons</span>
      </div>

      <div className="grid">
        {lessons.map((l) => (
          <Link key={l.id} href={`/lesson/${l.id}`} className="lesson" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="chapter">CHAPTER {l.chapter}</span>
            <h3>{l.title[lang]}</h3>
            <div className="muted">{l.subtitle[lang]}</div>
            <div className="bar">
              <span style={{ width: done.includes(l.id) ? '100%' : '0%' }} />
            </div>
            <div style={{ marginTop: 15, color: '#c4b5fd' }}>
              {done.includes(l.id)
                ? lang === 'en' ? '✓ Completed' : '✓ પૂર્ણ'
                : lang === 'en' ? 'Explore →' : 'જુઓ →'}
            </div>
          </Link>
        ))}
      </div>

      <footer className="notice">
        Prototype: demonstration problems aligned with GSEB Class 12 syllabus (Chapter 6 style
        increasing/decreasing example included). Progress is saved on this device only.
      </footer>
    </main>
  );
}
