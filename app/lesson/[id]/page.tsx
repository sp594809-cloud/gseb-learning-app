'use client';

import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import { getLesson, Language } from '../../../data/lessons';
import LessonView from '../../../components/LessonView';

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const lesson = getLesson(id);
  const [lang, setLang] = useState<Language>('gu');

  if (!lesson) {
    notFound();
  }

  return (
    <main className="shell">
      <LessonView
        lesson={lesson}
        lang={lang}
        onLangToggle={() => setLang((l) => (l === 'en' ? 'gu' : 'en'))}
        backHref="/"
      />
      <footer className="notice">
        Prototype: demonstration problems aligned with GSEB Class 12 syllabus. Progress is saved on
        this device only.
      </footer>
    </main>
  );
}
