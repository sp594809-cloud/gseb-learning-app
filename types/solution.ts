export type Language = 'en' | 'gu';

export type VerificationStatus = 'verified' | 'unverified' | 'under_review';

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

export interface GraphCurve {
  fn?: string;
  points?: Array<[number, number]>;
  label?: string;
  color?: string;
  dashed?: boolean;
}

export interface GraphPoint {
  x: number;
  y: number;
  label?: string;
  color?: string;
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
  text: string;
  isCorrect: boolean;
  explanation: BilingualText;
}

export interface SolutionItem {
  id: string; // Stable unique identifier e.g. "ch07-ex7.6-q01"
  chapterNumber: string; // e.g. "07"
  exerciseNumber: string; // e.g. "7.6" or "સ્વાધ્યાય 7.6"
  questionNumber: string; // e.g. "1" or "1(i)"
  topic: BilingualText; // Topic name e.g. "Integration by parts" / "ભાગશઃ સંકલન"
  
  // Task 2 requirements:
  originalQuestion: BilingualText; // Question text with LaTeX
  given: BilingualList | BilingualText; // Given information
  requiredResult: BilingualText; // Required result (To Find / To Prove)
  formulaOrTheorem: BilingualList | BilingualText; // Formulas or theorems used
  steps: SolutionStep[]; // Complete step-by-step solution
  finalAnswer: BilingualText | string; // Final answer clearly stated
  verificationStatus: VerificationStatus; // 'verified' | 'unverified' | 'under_review'
  verifiedBy?: string; // Verifier name
  verifiedDate?: string; // Date of verification
  
  // Rich media support:
  subQuestions?: SolutionItem[];
  graph?: GraphData;
  diagram?: DiagramData;
  table?: TableData;
  
  // Practice mode support:
  practiceOptions?: PracticeOption[];
  hints?: BilingualList;
}

export interface ChapterMeta {
  chapterNumber: string;
  title: BilingualText;
  part: 1 | 2; // GSEB Part 1 or Part 2
  description: BilingualText;
  exercises: string[];
}
