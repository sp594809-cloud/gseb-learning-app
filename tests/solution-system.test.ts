import test from 'node:test';
import assert from 'node:assert';
import {
  allSolutions,
  allChapters,
  getSolutionById,
  getSolutionsByChapter,
  searchSolutions,
} from '../lib/content.ts';

test('Solution System & Content Repository Suite', async (t) => {
  await t.test('All chapters loaded', () => {
    assert.strictEqual(allChapters.length, 13, 'Expected all 13 GSEB Class 12 chapters to be present');
    const ch07 = allChapters.find((c) => c.chapterNumber === '07');
    assert.ok(ch07, 'Chapter 07 should exist');
    assert.strictEqual(ch07?.title.gu, 'સંકલન');
  });

  await t.test('Solutions loaded with valid IDs', () => {
    assert.ok(allSolutions.length >= 8, `Expected at least 8 solutions, found ${allSolutions.length}`);
    const q1 = getSolutionById('ch07-ex7.6-q01');
    assert.ok(q1, 'Should find ch07-ex7.6-q01');
    assert.strictEqual(q1?.verificationStatus, 'verified', 'Must be verified');
    assert.ok(q1?.steps.length > 0, 'Must contain solution steps');
  });

  await t.test('Subquestion lookup works', () => {
    const sub = getSolutionById('ch03-ex3.1-q01-sub1');
    assert.ok(sub, 'Should find subquestion by ID');
    assert.strictEqual(sub?.questionNumber, '1(i)');
  });

  await t.test('Filtering by chapter works', () => {
    const ch03Sols = getSolutionsByChapter('03');
    assert.ok(ch03Sols.length >= 2, 'Chapter 3 should have solutions');
  });

  await t.test('Search finds Gujarati and English keywords', () => {
    const searchGu = searchSolutions('સંકલન', 'gu');
    assert.ok(searchGu.length > 0, 'Search should find Gujarati keyword');

    const searchEn = searchSolutions('matrix', 'en');
    assert.ok(searchEn.length > 0, 'Search should find English keyword');

    const searchByEx = searchSolutions('7.6', 'gu');
    assert.ok(searchByEx.length > 0, 'Search should find exercise number');
  });

  await t.test('Legacy lessons compatibility', () => {
    const legacySol = getSolutionById('legacy-integration');
    assert.ok(legacySol, 'Legacy integration lesson must be preserved');
    assert.strictEqual(legacySol?.chapterNumber, '07');
  });
});
