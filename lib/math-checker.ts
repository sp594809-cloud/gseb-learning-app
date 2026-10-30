import { BilingualText, SolutionItem, PracticeValidationConfig } from '../types/solution';
import { evaluateMathFunction } from '../components/InteractiveGraph';

export type MathCheckStatus = 'correct' | 'incorrect' | 'cannot_verify' | 'invalid_format';

export interface MathCheckResult {
  status: MathCheckStatus;
  isCorrect: boolean;
  feedback: BilingualText;
  method: 'exact' | 'fraction' | 'numerical_tolerance' | 'algebraic_sampling' | 'mcq' | 'manual_review';
  details?: string;
}

// 1. Parse simple fractions like "3/4", "-7/2", or "\frac{3}{4}"
export function parseFraction(input: string): { num: number; den: number } | null {
  if (!input) return null;
  const clean = input.trim().replace(/\s+/g, '');

  // LaTeX fraction \frac{a}{b}
  const latexMatch = clean.match(/^\\frac\{(-?\d+)\}\{([1-9]\d*)\}$/);
  if (latexMatch) {
    return { num: parseInt(latexMatch[1], 10), den: parseInt(latexMatch[2], 10) };
  }

  // Standard a/b
  const slashMatch = clean.match(/^(-?\d+)\/([1-9]\d*)$/);
  if (slashMatch) {
    return { num: parseInt(slashMatch[1], 10), den: parseInt(slashMatch[2], 10) };
  }

  // Pure integer: "5" -> 5/1
  const intMatch = clean.match(/^(-?\d+)$/);
  if (intMatch) {
    return { num: parseInt(intMatch[1], 10), den: 1 };
  }

  return null;
}

// Greatest Common Divisor for fraction reduction
function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

// 2. Check exact fractions
export function checkFractionAnswer(
  studentInput: string,
  expected: { numerator: number; denominator: number }
): MathCheckResult {
  const parsed = parseFraction(studentInput);
  if (!parsed) {
    return {
      status: 'invalid_format',
      isCorrect: false,
      feedback: {
        en: 'Invalid fraction format. Please enter as a/b (e.g. 3/4 or -1/2).',
        gu: 'અપૂર્ણાંકનું અમાન્ય સ્વરૂપ. કૃપા કરીને a/b સ્વરૂપે લખો (દા.ત. 3/4 અથવા -1/2).',
      },
      method: 'fraction',
    };
  }

  // Cross multiply to check numerical equality: a/b == c/d <=> a*d == b*c
  const isEquiv = parsed.num * expected.denominator === parsed.den * expected.numerator;

  if (isEquiv) {
    const g = gcd(parsed.num, parsed.den);
    const isReduced = g === 1;

    return {
      status: 'correct',
      isCorrect: true,
      feedback: {
        en: isReduced
          ? '✓ Correct! Exact fraction matched.'
          : `✓ Correct value, but consider simplifying to lowest terms: ${expected.numerator}/${expected.denominator}.`,
        gu: isReduced
          ? '✓ શાબાશ! તમારો અપૂર્ણાંક જવાબ સાચો છે.'
          : `✓ જવાબ સાચો છે, પરંતુ અતિસંક્ષિપ્ત સ્વરૂપ ${expected.numerator}/${expected.denominator} માં લખવાનો આગ્રહ રાખો.`,
      },
      method: 'fraction',
    };
  }

  return {
    status: 'incorrect',
    isCorrect: false,
    feedback: {
      en: '✗ Incorrect fraction value. Double check your calculation.',
      gu: '✗ ખોટો અપૂર્ણાંક જવાબ. ફરીથી ગણતરી ચકાસો.',
    },
    method: 'fraction',
  };
}

// 3. Check numerical values with tolerance
export function checkNumericalAnswer(
  studentInput: string,
  expected: number,
  tolerance = 0.005
): MathCheckResult {
  const clean = studentInput.trim();
  // Evaluate constants if typed, e.g. "pi" or "sqrt(2)"
  const val = evaluateMathFunction(clean, 0);

  if (isNaN(val) || !isFinite(val)) {
    return {
      status: 'invalid_format',
      isCorrect: false,
      feedback: {
        en: 'Could not parse numerical value. Enter numbers or standard math constants (e.g. 18, 3.14).',
        gu: 'સંખ્યાત્મક મૂલ્ય વાંચી શકાયું નથી. માન્ય સંખ્યા દાખલ કરો (દા.ત. 18, 3.14).',
      },
      method: 'numerical_tolerance',
    };
  }

  const diff = Math.abs(val - expected);
  if (diff <= tolerance) {
    return {
      status: 'correct',
      isCorrect: true,
      feedback: {
        en: `✓ Correct! Value: ${val} (Expected: ${expected}).`,
        gu: `✓ શાબાશ! સાચો જવાબ: ${val} (અપેક્ષિત: ${expected}).`,
      },
      method: 'numerical_tolerance',
    };
  }

  return {
    status: 'incorrect',
    isCorrect: false,
    feedback: {
      en: `✗ Incorrect value. Your answer: ${val}.`,
      gu: `✗ ખોટો જવાબ. તમારો જવાબ: ${val} છે.`,
    },
    method: 'numerical_tolerance',
  };
}

// 4. Check algebraic equivalence using safe randomized domain sampling
export function checkAlgebraicEquivalence(
  studentInput: string,
  expectedExpr: string,
  domain: [number, number] = [0.5, 4.5],
  variables = ['x']
): MathCheckResult {
  if (!studentInput || !studentInput.trim()) {
    return {
      status: 'invalid_format',
      isCorrect: false,
      feedback: {
        en: 'Please enter an algebraic expression.',
        gu: 'કૃપા કરીને બીજગાણિતિક પદાવલિ દાખલ કરો.',
      },
      method: 'algebraic_sampling',
    };
  }

  // 7 test points avoiding 0 and singularities
  const [min, max] = domain;
  const testPoints = [
    min + (max - min) * 0.12,
    min + (max - min) * 0.28,
    min + (max - min) * 0.44,
    min + (max - min) * 0.59,
    min + (max - min) * 0.73,
    min + (max - min) * 0.86,
    min + (max - min) * 0.95,
  ];

  let pointsTested = 0;
  for (const pt of testPoints) {
    const studentVal = evaluateMathFunction(studentInput, pt);
    const expectedVal = evaluateMathFunction(expectedExpr, pt);

    // If evaluator fails to parse expression safely
    if (isNaN(studentVal) || isNaN(expectedVal)) {
      return {
        status: 'cannot_verify',
        isCorrect: false,
        feedback: {
          en: 'Cannot automatically verify this algebraic expression. Please compare with the verified notebook steps.',
          gu: 'આ પદાવલિની સ્વયંચાલિત ચકાસણી શક્ય નથી. કૃપા કરીને નોટબુક ઉકેલ સાથે સરખાવો.',
        },
        method: 'manual_review',
        details: 'Evaluator encountered unparseable syntax or out-of-domain singularity.',
      };
    }

    const diff = Math.abs(studentVal - expectedVal);
    // Threshold 1e-4 allows small floating-point discrepancies in trig/powers
    if (diff > 0.001) {
      return {
        status: 'incorrect',
        isCorrect: false,
        feedback: {
          en: '✗ Expression is not algebraically equivalent to the required solution.',
          gu: '✗ આ પદાવલિ સાચા ઉકેલ સાથે બીજગાણિતિક રીતે સમકક્ષ નથી.',
        },
        method: 'algebraic_sampling',
      };
    }
    pointsTested++;
  }

  return {
    status: 'correct',
    isCorrect: true,
    feedback: {
      en: '✓ Mathematically equivalent algebraic expression verified!',
      gu: '✓ ગાણિતિક રીતે સમકક્ષ સાચી પદાવલિ ચકાસાયેલ છે!',
    },
    method: 'algebraic_sampling',
  };
}

// 5. Main unified verification function for any practice question
export function verifyStudentPracticeAnswer(
  solution: SolutionItem,
  studentAnswer: {
    selectedOptionIndex?: number | null;
    selectedOptionIndices?: number[];
    textInput?: string;
  }
): MathCheckResult {
  // Case A: MCQ Option selected
  if (
    studentAnswer.selectedOptionIndex !== undefined &&
    studentAnswer.selectedOptionIndex !== null &&
    solution.practiceOptions &&
    solution.practiceOptions[studentAnswer.selectedOptionIndex]
  ) {
    const opt = solution.practiceOptions[studentAnswer.selectedOptionIndex];
    return {
      status: opt.isCorrect ? 'correct' : 'incorrect',
      isCorrect: opt.isCorrect,
      feedback: opt.explanation,
      method: 'mcq',
    };
  }

  // Case B: Multi-select MCQs
  if (
    studentAnswer.selectedOptionIndices &&
    studentAnswer.selectedOptionIndices.length > 0 &&
    solution.practiceOptions
  ) {
    const correctIndices = solution.practiceOptions
      .map((opt, i) => (opt.isCorrect ? i : -1))
      .filter((i) => i !== -1);

    const isMatch =
      correctIndices.length === studentAnswer.selectedOptionIndices.length &&
      correctIndices.every((idx) => studentAnswer.selectedOptionIndices!.includes(idx));

    return {
      status: isMatch ? 'correct' : 'incorrect',
      isCorrect: isMatch,
      feedback: {
        en: isMatch
          ? '✓ All correct options identified!'
          : '✗ Some selected options were incorrect or missing.',
        gu: isMatch
          ? '✓ તમામ સાચા વિકલ્પો યોગ્ય રીતે પસંદ કર્યા છે!'
          : '✗ કેટલાક પસંદ કરેલા વિકલ્પો ખોટા છે અથવા બાકી રહી ગયા છે.',
      },
      method: 'mcq',
    };
  }

  // Case C: Free-form Text / Numerical / Algebraic Input
  if (studentAnswer.textInput && solution.practiceValidation) {
    const cfg = solution.practiceValidation;

    if (cfg.type === 'numerical' && cfg.expectedNumerical !== undefined) {
      return checkNumericalAnswer(studentAnswer.textInput, cfg.expectedNumerical, cfg.tolerance);
    }

    if (cfg.type === 'fraction' && cfg.expectedFraction) {
      return checkFractionAnswer(studentAnswer.textInput, cfg.expectedFraction);
    }

    if (cfg.type === 'algebraic' && cfg.expectedAlgebraic) {
      return checkAlgebraicEquivalence(
        studentAnswer.textInput,
        cfg.expectedAlgebraic,
        cfg.domainSampleRange,
        cfg.variableNames
      );
    }
  }

  // Fallback
  return {
    status: 'cannot_verify',
    isCorrect: false,
    feedback: {
      en: 'Cannot automatically verify this response type.',
      gu: 'આ પ્રકારના પ્રતિસાદની સ્વયંચાલિત ચકાસણી ઉપલબ્ધ નથી.',
    },
    method: 'manual_review',
  };
}
