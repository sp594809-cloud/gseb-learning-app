export type Language = 'en' | 'gu';

export type VerificationStatus = 'missing' | 'draft' | 'needs_review' | 'verified' | 'published';

export type QuestionType =
  | 'mcq'
  | 'multi_select'
  | 'numerical'
  | 'fraction'
  | 'algebraic'
  | 'proof'
  | 'multi_part';

export interface BilingualText {
  en: string;
  gu: string;
}

export interface BilingualList {
  en: string[];
  gu: string[];
}

export interface SolutionStep {
  stepNumber: number;
  explanation: BilingualText;
  math: string; // LaTeX expression(s) for the step
  reason?: BilingualText; // Optional reason/justification e.g. "બંને બાજુ વર્ગ કરતાં" / "Squaring both sides"
}

export interface ParameterSlider {
  name: string; // e.g. "a", "k"
  label: BilingualText;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface GraphCurve {
  fn?: string; // Expression in terms of x and sliders, e.g. "a * sin(x)"
  points?: Array<[number, number]>;
  label?: string;
  color?: string;
  dashed?: boolean;
  domain?: [number, number]; // Explicit domain restriction e.g. [-1, 1] for arcsin
  discontinuities?: number[]; // Points of discontinuity e.g. [0] for 1/x
}

export interface GraphPoint {
  x: number;
  y: number;
  label?: string;
  color?: string;
  isOpenCircle?: boolean; // For removable/jump discontinuities
}

export interface GraphLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  color?: string;
  dashed?: boolean;
}

export interface GraphRegion {
  points: Array<[number, number]>;
  color?: string;
  label?: string;
}

export interface GraphData {
  type: 'cartesian' | 'function' | 'vector' | 'geometry' | 'lpp';
  title?: BilingualText;
  caption?: BilingualText;
  xRange: [number, number];
  yRange: [number, number];
  xLabel?: string;
  yLabel?: string;
  curves?: GraphCurve[];
  points?: GraphPoint[];
  lines?: GraphLine[];
  regions?: GraphRegion[];
  sliders?: ParameterSlider[];
  interactiveTangent?: boolean; // Enables scrubbable tangent line visualizer
  interactiveLimits?: {
    point: number;
    leftLimit: number;
    rightLimit: number;
    value?: number;
  };
  extremaPoints?: Array<{ x: number; y: number; type: 'min' | 'max'; label?: string }>;
}

export interface TableData {
  title?: BilingualText;
  headers: Array<string | BilingualText>;
  rows: Array<Array<string | number | BilingualText>>;
}

export interface DiagramData {
  type: 'triangle' | 'matrix_visual' | 'vector_diagram' | 'circle' | 'coordinate_quadrant';
  title?: BilingualText;
  svgContent?: string;
  description?: BilingualText;
}

export interface PracticeOption {
  id?: string;
  text: string;
  isCorrect: boolean;
  explanation: BilingualText;
}

export interface PracticeValidationConfig {
  type: QuestionType;
  expectedNumerical?: number;
  tolerance?: number; // e.g. 0.01
  expectedFraction?: {
    numerator: number;
    denominator: number;
  };
  expectedAlgebraic?: string; // Standard algebraic expression to check equivalence against
  variableNames?: string[]; // e.g. ["x"] or ["x", "y"]
  domainSampleRange?: [number, number]; // e.g. [0.1, 5] for log
}

export interface SolutionItem {
  schemaVersion?: string; // e.g. "2.0"
  id: string; // Stable unique identifier e.g. "ch01-ex1.1-q01"
  chapterNumber: string; // e.g. "01"
  exerciseNumber: string; // e.g. "1.1" or "સ્વાધ્યાય 1.1"
  questionNumber: string; // e.g. "1" or "1(i)"
  topic: BilingualText; // Topic name e.g. "Equivalence Relations" / "સામ્ય સંબંધ"
  questionType?: QuestionType; // Question classification
  
  // Content details
  originalQuestion: BilingualText; // Question text with LaTeX
  given: BilingualList | BilingualText; // Given information
  requiredResult: BilingualText; // Required result (To Find / To Prove)
  formulaOrTheorem: BilingualList | BilingualText; // Formulas or theorems used
  steps: SolutionStep[]; // Complete step-by-step solution
  finalAnswer: BilingualText | string; // Final answer clearly stated
  alternativeMethods?: SolutionStep[][]; // Alternative solution approaches
  
  // Verification and Status
  verificationStatus: VerificationStatus; // 'missing' | 'draft' | 'needs_review' | 'verified' | 'published'
  verifiedBy?: string; // Verifier name or "ChatGPT Verified"
  verifiedDate?: string; // Date of verification (ISO format)
  reviewNotes?: string;
  
  // Rich media support
  subQuestions?: SolutionItem[];
  graph?: GraphData;
  diagram?: DiagramData;
  table?: TableData;
  
  // Practice mode support
  practiceOptions?: PracticeOption[];
  practiceValidation?: PracticeValidationConfig;
  hints?: BilingualList;
}

export interface ChapterMeta {
  chapterNumber: string;
  title: BilingualText;
  part: 1 | 2; // GSEB Part 1 or Part 2
  description: BilingualText;
  exercises: string[];
}

// Grok's Raw PDF Extraction Inventory Format
export interface GrokQuestionInventoryItem {
  id: string;
  chapterNumber: string;
  exerciseNumber: string;
  questionNumber: string;
  rawQuestionGujarati: string;
  rawQuestionEnglish?: string;
  pageNumber?: number;
  hasFigure?: boolean;
  questionType?: string;
  options?: string[];
  notes?: string;
}

// Importer Reporting
export interface ImportReport {
  timestamp: string;
  totalParsed: number;
  importedCount: number;
  updatedCount: number;
  skippedCount: number;
  errors: Array<{
    itemIndex: number;
    id?: string;
    field?: string;
    message: string;
  }>;
  warnings: Array<{
    itemIndex: number;
    id?: string;
    message: string;
  }>;
}
