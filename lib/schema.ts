import katex from 'katex';
import type {
  SolutionItem,
  VerificationStatus,
  QuestionType,
  BilingualText,
  ImportReport,
} from '../types/solution';

export interface SchemaValidationResult {
  valid: boolean;
  errors: Array<{
    id?: string;
    field?: string;
    message: string;
  }>;
  warnings: Array<{
    id?: string;
    field?: string;
    message: string;
  }>;
}

// Extract LaTeX formulas from text
export function extractLatexFormulas(text: string): string[] {
  if (!text) return [];
  const formulas: string[] = [];
  
  // Match \( ... \)
  const inlineParen = text.match(/\\\(([\s\S]*?)\\\)/g);
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
  // Match single $ ... $ (excluding escaped \$)
  const singleDollar = text.match(/(?<!\\)\$(.*?)(?<!\\)\$/g);
  if (singleDollar) {
    for (const match of singleDollar) {
      formulas.push(match.slice(1, -1).trim());
    }
  }
  return formulas;
}

// Validate KaTeX syntax safely
export function validateKatexFormula(formula: string): { valid: boolean; error?: string } {
  if (!formula || !formula.trim()) return { valid: true };
  try {
    katex.renderToString(formula, {
      throwOnError: true,
      displayMode: true,
      output: 'html',
    });
    return { valid: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { valid: false, error: msg };
  }
}

// Validate Gujarati Unicode range (0x0A80 to 0x0AFF)
export function containsGujaratiUnicode(text: string): boolean {
  if (!text) return false;
  return /[\u0A80-\u0AFF]/.test(text);
}

// Validate individual bilingual text
export function validateBilingual(
  obj: unknown,
  field: string,
  id: string,
  errors: SchemaValidationResult['errors']
): boolean {
  if (!obj || typeof obj !== 'object') {
    errors.push({ id, field, message: `Field "${field}" must be an object with .en and .gu strings.` });
    return false;
  }
  const b = obj as { en?: string; gu?: string };
  let isValid = true;
  if (!b.en || typeof b.en !== 'string' || !b.en.trim()) {
    errors.push({ id, field: `${field}.en`, message: `Missing English text in "${field}".` });
    isValid = false;
  }
  if (!b.gu || typeof b.gu !== 'string' || !b.gu.trim()) {
    errors.push({ id, field: `${field}.gu`, message: `Missing Gujarati text in "${field}".` });
    isValid = false;
  } else if (!containsGujaratiUnicode(b.gu)) {
    // Check if the Gujarati field actually contains Gujarati characters
    errors.push({ id, field: `${field}.gu`, message: `Gujarati text in "${field}" lacks Gujarati Unicode characters.` });
    isValid = false;
  }
  return isValid;
}

// Validate SolutionItem schema
export function validateSolutionItem(
  sol: unknown,
  existingIds = new Set<string>()
): SchemaValidationResult {
  const errors: SchemaValidationResult['errors'] = [];
  const warnings: SchemaValidationResult['warnings'] = [];

  if (!sol || typeof sol !== 'object') {
    return {
      valid: false,
      errors: [{ message: 'SolutionItem must be a valid JSON object.' }],
      warnings: [],
    };
  }

  const item = sol as Partial<SolutionItem>;
  const id = item.id || 'UNKNOWN_ID';

  // 1. Stable Identifier
  if (!item.id || typeof item.id !== 'string' || !item.id.trim()) {
    errors.push({ id, field: 'id', message: 'Missing or invalid unique identifier (id).' });
  } else {
    if (existingIds.has(item.id)) {
      errors.push({ id: item.id, field: 'id', message: `Duplicate question ID detected: "${item.id}".` });
    } else {
      existingIds.add(item.id);
    }
  }

  // 2. Chapter, Exercise, Question Numbers
  if (!item.chapterNumber || typeof item.chapterNumber !== 'string') {
    errors.push({ id, field: 'chapterNumber', message: 'Missing or non-string chapterNumber.' });
  }
  if (!item.exerciseNumber || typeof item.exerciseNumber !== 'string') {
    errors.push({ id, field: 'exerciseNumber', message: 'Missing or non-string exerciseNumber.' });
  }
  if (!item.questionNumber || typeof item.questionNumber !== 'string') {
    errors.push({ id, field: 'questionNumber', message: 'Missing or non-string questionNumber.' });
  }

  // 3. Topic
  validateBilingual(item.topic, 'topic', id, errors);

  // 4. Original Question
  if (validateBilingual(item.originalQuestion, 'originalQuestion', id, errors)) {
    // Check LaTeX formulas inside question text
    for (const f of extractLatexFormulas(item.originalQuestion!.en)) {
      const kRes = validateKatexFormula(f);
      if (!kRes.valid) {
        errors.push({ id, field: 'originalQuestion.en', message: `KaTeX syntax error in question: ${kRes.error}` });
      }
    }
    for (const f of extractLatexFormulas(item.originalQuestion!.gu)) {
      const kRes = validateKatexFormula(f);
      if (!kRes.valid) {
        errors.push({ id, field: 'originalQuestion.gu', message: `KaTeX syntax error in question: ${kRes.error}` });
      }
    }
  }

  // 5. Given & Required Result
  if (!item.given) {
    errors.push({ id, field: 'given', message: 'Missing given information.' });
  }
  validateBilingual(item.requiredResult, 'requiredResult', id, errors);

  // 6. Formula or Theorem
  if (!item.formulaOrTheorem) {
    errors.push({ id, field: 'formulaOrTheorem', message: 'Missing formula or theorem.' });
  }

  // 7. Solution Steps
  if (!Array.isArray(item.steps) || item.steps.length === 0) {
    errors.push({ id, field: 'steps', message: 'steps must be a non-empty array of SolutionStep.' });
  } else {
    item.steps.forEach((step, idx) => {
      const stepPath = `steps[${idx}]`;
      if (typeof step.stepNumber !== 'number') {
        errors.push({ id, field: `${stepPath}.stepNumber`, message: 'stepNumber must be a number.' });
      }
      validateBilingual(step.explanation, `${stepPath}.explanation`, id, errors);

      if (!step.math || typeof step.math !== 'string' || !step.math.trim()) {
        errors.push({ id, field: `${stepPath}.math`, message: 'Missing mathematical expression in step.' });
      } else {
        const kRes = validateKatexFormula(step.math);
        if (!kRes.valid) {
          errors.push({ id, field: `${stepPath}.math`, message: `KaTeX syntax error in step math: ${kRes.error}` });
        }
      }

      if (step.reason) {
        validateBilingual(step.reason, `${stepPath}.reason`, id, errors);
      }
    });
  }

  // 8. Final Answer
  if (!item.finalAnswer) {
    errors.push({ id, field: 'finalAnswer', message: 'Missing finalAnswer.' });
  } else if (typeof item.finalAnswer === 'object') {
    validateBilingual(item.finalAnswer, 'finalAnswer', id, errors);
  } else if (typeof item.finalAnswer === 'string') {
    const kRes = validateKatexFormula(item.finalAnswer);
    if (!kRes.valid) {
      warnings.push({ id, field: 'finalAnswer', message: `KaTeX warning in string finalAnswer: ${kRes.error}` });
    }
  }

  // 9. Verification Status
  const validStatuses: VerificationStatus[] = ['missing', 'draft', 'needs_review', 'verified', 'published'];
  if (!item.verificationStatus || !validStatuses.includes(item.verificationStatus)) {
    errors.push({
      id,
      field: 'verificationStatus',
      message: `Invalid verificationStatus: "${item.verificationStatus}". Expected one of: ${validStatuses.join(', ')}`,
    });
  } else if (item.verificationStatus === 'verified') {
    if (!item.verifiedBy || !item.verifiedBy.trim()) {
      errors.push({
        id,
        field: 'verifiedBy',
        message: 'Status is "verified" but "verifiedBy" is missing. Unverified content cannot be silently promoted.',
      });
    }
  }

  // 10. Graph validation (if present)
  if (item.graph) {
    if (!item.graph.xRange || item.graph.xRange.length !== 2 || item.graph.xRange[0] >= item.graph.xRange[1]) {
      errors.push({ id, field: 'graph.xRange', message: 'graph.xRange must be [min, max] with min < max.' });
    }
    if (!item.graph.yRange || item.graph.yRange.length !== 2 || item.graph.yRange[0] >= item.graph.yRange[1]) {
      errors.push({ id, field: 'graph.yRange', message: 'graph.yRange must be [min, max] with min < max.' });
    }
  }

  // 11. Practice options validation (if present)
  if (item.practiceOptions && Array.isArray(item.practiceOptions)) {
    item.practiceOptions.forEach((opt, idx) => {
      const optPath = `practiceOptions[${idx}]`;
      if (!opt.text) errors.push({ id, field: `${optPath}.text`, message: 'Missing practice option text.' });
      validateBilingual(opt.explanation, `${optPath}.explanation`, id, errors);
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// Migration helper: converts older v1 schemas to v2
export function migrateSolutionToV2(item: any): SolutionItem {
  const version = item.schemaVersion || '1.0';
  if (version === '2.0') return item as SolutionItem;

  const migrated: SolutionItem = {
    ...item,
    schemaVersion: '2.0',
    verificationStatus:
      item.verificationStatus === 'under_review'
        ? 'needs_review'
        : item.verificationStatus === 'unverified'
        ? 'draft'
        : item.verificationStatus || 'draft',
    questionType: item.questionType || (item.practiceOptions && item.practiceOptions.length > 0 ? 'mcq' : 'algebraic'),
  };

  return migrated;
}
