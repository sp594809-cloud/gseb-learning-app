import test from 'node:test';
import assert from 'node:assert';
import { validateAllContent } from '../scripts/validate-content.ts';

test('GSEB Mathematics Content Validation Suite', () => {
  const result = validateAllContent();
  assert.strictEqual(result.valid, true, `Validation failed with ${result.errorCount} errors`);
  assert.ok(result.totalChecked >= 5, `Expected at least 5 questions, found ${result.totalChecked}`);
  assert.strictEqual(result.errorCount, 0, 'Expected 0 validation errors');
});
