import fs from 'node:fs';
import path from 'node:path';
import katex from 'katex';
import type { SolutionItem, VerificationStatus } from '../types/solution.ts';

interface ValidationError {
  file: string;
  id?: string;
  field?: string;
  message: string;
}

const errors: ValidationError[] = [];
const seenIds = new Set<string>();

const solutionsDir = path.resolve(import.meta.dirname || path.dirname(new URL(import.meta.url).pathname), '../data/solutions');

// Function to extract LaTeX formulas from mixed text or expressions
function extractFormulas(text: string): string[] {
  if (!text) return [];
  const formulas: string[] = [];
  // Match \( ... \)
  const inlineParen = text.match(/\\\((.*?)\\\)/g);
  if (inlineParen) {
    for (const match of inlineParen) {
      formulas.push(match.slice(2, -2).trim());
    }
  }
  // Match \[ ... \]
  const blockBracket = text.match(/\\\[([\s\S]*?)\\\]/g);
  if (blockBracket) {
    for (const match of blockBracket) {
      formulas.push(match.slice(2, -2).trim());
    }
  }
  // Match $$ ... $$
  const blockDollar = text.match(/\$\$([\s\S]*?)\$\$/g);
  if (blockDollar) {
    for (const match of blockDollar) {
      formulas.push(match.slice(2, -2).trim());
    }
  }
  // Match standalone $ ... $ (excluding escaped \$)
  const singleDollar = text.match(/(?<!\\)\$(.*?)(?<!\\)\$/g);
  if (singleDollar) {
    for (const match of singleDollar) {
      formulas.push(match.slice(1, -1).trim());
    }
  }
  return formulas;
}

function testKatexFormula(formula: string, file: string, id: string, field: string): boolean {
  if (!formula || !formula.trim()) return true;
  try {
    katex.renderToString(formula, {
      throwOnError: true,
      displayMode: true,
      output: 'html',
    });
    return true;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    errors.push({
      file,
      id,
      field,
      message: `Broken KaTeX formula: "${formula}". Error: ${errorMsg}`,
    });
    return false;
  }
}

function validateBilingualText(obj: unknown, file: string, id: string, field: string): boolean {
  if (!obj || typeof obj !== 'object') {
    errors.push({ file, id, field, message: `Field "${field}" must be an object with .en and .gu` });
    return false;
  }
  const b = obj as { en?: string; gu?: string };
  if (!b.en || typeof b.en !== 'string' || !b.en.trim()) {
    errors.push({ file, id, field: `${field}.en`, message: `Missing English text in "${field}"` });
  }
  if (!b.gu || typeof b.gu !== 'string' || !b.gu.trim()) {
    errors.push({ file, id, field: `${field}.gu`, message: `Missing Gujarati text in "${field}"` });
  }
  return true;
}

function validateSolutionItem(sol: SolutionItem, file: string) {
  const id = sol.id || 'UNKNOWN_ID';

  // 1. Unique ID
  if (!sol.id || typeof sol.id !== 'string' || !sol.id.trim()) {
    errors.push({ file, id, field: 'id', message: 'Missing or invalid question ID' });
  } else {
    if (seenIds.has(sol.id)) {
      errors.push({ file, id: sol.id, field: 'id', message: `Duplicate question ID detected: "${sol.id}"` });
    } else {
      seenIds.add(sol.id);
    }
  }

  // 2. Chapter, Exercise, Question Numbers
  if (!sol.chapterNumber) errors.push({ file, id, field: 'chapterNumber', message: 'Missing chapterNumber' });
  if (!sol.exerciseNumber) errors.push({ file, id, field: 'exerciseNumber', message: 'Missing exerciseNumber' });
  if (!sol.questionNumber) errors.push({ file, id, field: 'questionNumber', message: 'Missing questionNumber' });

  // 3. Topic & Question text
  validateBilingualText(sol.topic, file, id, 'topic');
  validateBilingualText(sol.originalQuestion, file, id, 'originalQuestion');
  if (sol.originalQuestion?.en) {
    for (const f of extractFormulas(sol.originalQuestion.en)) testKatexFormula(f, file, id, 'originalQuestion.en');
  }
  if (sol.originalQuestion?.gu) {
    for (const f of extractFormulas(sol.originalQuestion.gu)) testKatexFormula(f, file, id, 'originalQuestion.gu');
  }

  // 4. Given info
  if (!sol.given) {
    errors.push({ file, id, field: 'given', message: 'Missing given information' });
  }

  // 5. Required result
  validateBilingualText(sol.requiredResult, file, id, 'requiredResult');

  // 6. Formula or theorem
  if (!sol.formulaOrTheorem) {
    errors.push({ file, id, field: 'formulaOrTheorem', message: 'Missing formulaOrTheorem' });
  }

  // 7. Steps
  if (!Array.isArray(sol.steps) || sol.steps.length === 0) {
    errors.push({ file, id, field: 'steps', message: 'Missing solution steps (steps must be a non-empty array)' });
  } else {
    sol.steps.forEach((step, sIdx) => {
      const stepField = `steps[${sIdx}]`;
      if (!step.stepNumber) {
        errors.push({ file, id, field: `${stepField}.stepNumber`, message: 'Missing stepNumber' });
      }
      validateBilingualText(step.explanation, file, id, `${stepField}.explanation`);
      if (step.explanation?.en) {
        for (const f of extractFormulas(step.explanation.en)) testKatexFormula(f, file, id, `${stepField}.explanation.en`);
      }
      if (step.explanation?.gu) {
        for (const f of extractFormulas(step.explanation.gu)) testKatexFormula(f, file, id, `${stepField}.explanation.gu`);
      }
      if (!step.math || typeof step.math !== 'string' || !step.math.trim()) {
        errors.push({ file, id, field: `${stepField}.math`, message: 'Missing math expression in step' });
      } else {
        testKatexFormula(step.math, file, id, `${stepField}.math`);
      }
    });
  }

  // 8. Final Answer
  if (!sol.finalAnswer) {
    errors.push({ file, id, field: 'finalAnswer', message: 'Missing finalAnswer' });
  } else if (typeof sol.finalAnswer === 'object') {
    validateBilingualText(sol.finalAnswer, file, id, 'finalAnswer');
  } else if (typeof sol.finalAnswer === 'string') {
    testKatexFormula(sol.finalAnswer, file, id, 'finalAnswer');
  }

  // 9. Verification Status
  const validStatuses: VerificationStatus[] = ['verified', 'unverified', 'under_review'];
  if (!validStatuses.includes(sol.verificationStatus)) {
    errors.push({
      file,
      id,
      field: 'verificationStatus',
      message: `Invalid verificationStatus: "${sol.verificationStatus}". Must be one of: ${validStatuses.join(', ')}`,
    });
  }

  // 10. Subquestions (if present)
  if (sol.subQuestions && Array.isArray(sol.subQuestions)) {
    for (const sub of sol.subQuestions) {
      validateSolutionItem(sub, file);
    }
  }

  // 11. Practice options (if present)
  if (sol.practiceOptions && Array.isArray(sol.practiceOptions)) {
    sol.practiceOptions.forEach((opt, oIdx) => {
      if (opt.text) {
        testKatexFormula(opt.text, file, id, `practiceOptions[${oIdx}].text`);
      }
      validateBilingualText(opt.explanation, file, id, `practiceOptions[${oIdx}].explanation`);
    });
  }
}

export function validateAllContent(): { valid: boolean; totalChecked: number; errorCount: number } {
  console.log('🔍 Starting GSEB Mathematics Content Validation...');
  console.log(`Directory: ${solutionsDir}\n`);

  if (!fs.existsSync(solutionsDir)) {
    errors.push({ file: solutionsDir, message: 'Solutions directory does not exist!' });
    return { valid: false, totalChecked: 0, errorCount: 1 };
  }

  const files = fs.readdirSync(solutionsDir).filter((f) => f.endsWith('.json') && f.startsWith('chapter-'));
  let totalChecked = 0;

  for (const file of files) {
    const fullPath = path.join(solutionsDir, file);
    try {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const items: SolutionItem[] = JSON.parse(content);

      if (!Array.isArray(items)) {
        errors.push({ file, message: 'JSON root must be an array of SolutionItem objects.' });
        continue;
      }

      for (const item of items) {
        totalChecked++;
        validateSolutionItem(item, file);
      }
      console.log(`✓ Validated ${file} (${items.length} solution items)`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push({ file, message: `Failed to read/parse JSON: ${msg}` });
    }
  }

  console.log(`\n========================================`);
  console.log(`Total questions checked: ${totalChecked}`);
  console.log(`Unique IDs registered: ${seenIds.size}`);
  console.log(`Errors found: ${errors.length}`);
  console.log(`========================================\n`);

  if (errors.length > 0) {
    console.error('❌ Validation FAILED with errors:');
    errors.forEach((err, idx) => {
      console.error(`  ${idx + 1}. [${err.file}] ${err.id ? `ID: ${err.id} ` : ''}${err.field ? `(${err.field}): ` : ''}${err.message}`);
    });
    return { valid: false, totalChecked, errorCount: errors.length };
  }

  console.log('✨ All content validated successfully! 100% compliant with GSEB standards.');
  return { valid: true, totalChecked, errorCount: 0 };
}

// Run standalone if executed directly
if (process.argv[1] && process.argv[1].endsWith('validate-content.ts')) {
  const result = validateAllContent();
  process.exit(result.valid ? 0 : 1);
}
