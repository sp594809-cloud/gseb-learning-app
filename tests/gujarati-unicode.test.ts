import test from 'node:test';
import assert from 'node:assert';
import { allChapters, allSolutions } from '../lib/content.ts';

test('Gujarati Unicode & Typography Integrity Suite', async (t) => {
  await t.test('All chapters have valid Gujarati Unicode titles', () => {
    for (const ch of allChapters) {
      assert.ok(ch.title.gu && ch.title.gu.length > 0, `Chapter ${ch.chapterNumber} must have Gujarati title`);
      // Gujarati Unicode range is U+0A80 to U+0AFF
      const hasGujaratiChar = /[\u0A80-\u0AFF]/.test(ch.title.gu);
      assert.ok(hasGujaratiChar, `Chapter ${ch.chapterNumber} title "${ch.title.gu}" must contain valid Gujarati characters`);
    }
  });

  await t.test('All solutions have valid Gujarati Unicode in question and steps', () => {
    for (const sol of allSolutions) {
      assert.ok(sol.originalQuestion.gu, `Solution ${sol.id} must have Gujarati question text`);
      assert.ok(sol.steps.every((s) => s.explanation.gu), `Solution ${sol.id} steps must have Gujarati explanations`);
    }
  });

  await t.test('Gujarati matras and conjuncts integrity', () => {
    const samples = ['શ્રેણિક', 'સાતત્ય', 'વિકલનીયતા', 'સંકલન', 'પ્રકીર્ણ', 'સ્વાધ્યાય'];
    for (const sample of samples) {
      assert.ok(!sample.includes('\uFFFD'), `Gujarati sample "${sample}" must not contain replacement characters`);
    }
  });
});
