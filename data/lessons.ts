export type Language = 'en' | 'gu';

export type Question = {
  id: string;
  topic: string;
  prompt: string;
  options: string[];
  correct: number;
  explanation: { en: string; gu: string };
};

export type GraphConfig = {
  expression: string;
  f: string;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  points?: { x: number; y: number; label: string }[];
  intervals?: { from: number; to: number; kind: 'inc' | 'dec' }[];
  fPrime?: string;
};

export type Lesson = {
  id: string;
  chapter: string;
  title: { en: string; gu: string };
  subtitle: { en: string; gu: string };
  formula: string;
  worked: {
    question: string;
    steps: { en: string[]; gu: string[] };
    answer: string;
  };
  questions: Question[];
  graph?: GraphConfig;
};

export const lessons: Lesson[] = [
  {
    id: 'integration',
    chapter: '07',
    title: { en: 'Integrals', gu: 'સંકલન' },
    subtitle: { en: 'Integration by parts', gu: 'ભાગશઃ સંકલન' },
    formula: '\\int u\\,dv=uv-\\int v\\,du',
    worked: {
      question: '\\int xe^x\\,dx',
      steps: {
        en: [
          'Use integration by parts.',
          'Choose \\(u=x\\) and \\(dv=e^x\\,dx\\).',
          'Then \\(du=dx\\) and \\(v=e^x\\).',
          'So \\(\\int xe^x dx=xe^x-\\int e^x dx\\).',
        ],
        gu: [
          'ભાગશઃ સંકલનની રીત વાપરો.',
          '\\(u=x\\) અને \\(dv=e^x\\,dx\\) લો.',
          'પછી \\(du=dx\\) અને \\(v=e^x\\) થાય.',
          'તેથી \\(\\int xe^x dx=xe^x-\\int e^x dx\\).',
        ],
      },
      answer: 'e^x(x-1)+C',
    },
    questions: [
      {
        id: 'i1',
        topic: 'Integration by parts',
        prompt: '\\int x\\cos x\\,dx',
        options: ['x\\sin x+\\cos x+C', 'x\\sin x-\\cos x+C', '\\sin x+C', 'x\\cos x+C'],
        correct: 0,
        explanation: {
          en: 'Use integration by parts: u=x, dv=cos x dx. Thus x sin x − ∫sin x dx = x sin x + cos x + C.',
          gu: 'ભાગશઃ સંકલન કરો: u=x અને dv=cos x dx. તેથી x sin x − ∫sin x dx = x sin x + cos x + C.',
        },
      },
      {
        id: 'i2',
        topic: 'Basic integration',
        prompt: '\\int 2x\\,dx',
        options: ['2x^2+C', 'x^2+C', '2+C', 'x+C'],
        correct: 1,
        explanation: {
          en: 'The power rule gives 2 × x²/2 = x² + C.',
          gu: 'ઘાતના નિયમ મુજબ 2 × x²/2 = x² + C.',
        },
      },
    ],
  },
  {
    id: 'derivatives',
    chapter: '06',
    title: { en: 'Applications of Derivatives', gu: 'વિકલનના ઉપયોગો' },
    subtitle: { en: 'Tangents and rates of change', gu: 'સ્પર્શરેખા અને ફેરફારનો દર' },
    formula: '\\frac{d}{dx}(x^n)=nx^{n-1}',
    worked: {
      question: '\\frac{d}{dx}(x^3+2x)',
      steps: {
        en: [
          'Differentiate each term separately.',
          'Derivative of x³ is 3x².',
          'Derivative of 2x is 2.',
        ],
        gu: [
          'દરેક પદનું અલગથી વિકલન કરો.',
          'x³ નું વિકલન 3x² છે.',
          '2x નું વિકલન 2 છે.',
        ],
      },
      answer: '3x^2+2',
    },
    questions: [
      {
        id: 'd1',
        topic: 'Differentiation',
        prompt: '\\frac{d}{dx}(x^4)',
        options: ['x^3', '4x^3', '4x^4', 'x^4/4'],
        correct: 1,
        explanation: {
          en: 'Apply the power rule: d(x⁴)/dx = 4x³.',
          gu: 'ઘાતનો નિયમ વાપરો: d(x⁴)/dx = 4x³.',
        },
      },
    ],
  },
  {
    id: 'inc-dec',
    chapter: '06',
    title: {
      en: 'Increasing and Decreasing Functions',
      gu: 'વધતાં અને ઘટતાં વિધેયો',
    },
    subtitle: {
      en: 'First derivative test · Chapter 6',
      gu: 'પ્રથમ વિકલન કસોટી · પ્રકરણ 6',
    },
    formula: "f'(x)>0 \\Rightarrow \\text{increasing},\\quad f'(x)<0 \\Rightarrow \\text{decreasing}",
    worked: {
      question: 'f(x)=x^3-3x',
      steps: {
        en: [
          "Find the derivative: \\(f'(x)=3x^2-3\\).",
          "Factor: \\(f'(x)=3(x^2-1)=3(x-1)(x+1)\\).",
          "Critical points where \\(f'(x)=0\\): \\(x=-1\\) and \\(x=1\\).",
          "Sign of \\(f'\\): on \\((-\\infty,-1)\\) both factors negative → \\(f'>0\\) (increasing).",
          "On \\((-1,1)\\): \\((x+1)>0\\), \\((x-1)<0\\) → \\(f'<0\\) (decreasing).",
          "On \\((1,\\infty)\\) both factors positive → \\(f'>0\\) (increasing).",
          'Also check endpoints of closed intervals if required by the question.',
        ],
        gu: [
          "વિકલન શોધો: \\(f'(x)=3x^2-3\\).",
          "અવયવ કરો: \\(f'(x)=3(x^2-1)=3(x-1)(x+1)\\).",
          "જ્યાં \\(f'(x)=0\\): \\(x=-1\\) અને \\(x=1\\).",
          "\\((-\\infty,-1)\\) પર બંને અવયવ ઋણ → \\(f'>0\\) (વધતું).",
          "\\((-1,1)\\) પર \\((x+1)>0\\), \\((x-1)<0\\) → \\(f'<0\\) (ઘટતું).",
          "\\((1,\\infty)\\) પર બંને અવયવ ધન → \\(f'>0\\) (વધતું).",
          'પ્રશ્ન મુજબ બંધ અંતરાલના અંત્યબિંદુઓ પણ ચકાસો.',
        ],
      },
      answer:
        '\\text{Increasing on }(-\\infty,-1]\\cup[1,\\infty);\\; \\text{Decreasing on }[-1,1]',
    },
    graph: {
      expression: 'f(x) = x³ − 3x',
      f: 'x3m3x',
      fPrime: '3x2m3',
      xMin: -2.5,
      xMax: 2.5,
      yMin: -3,
      yMax: 3,
      points: [
        { x: -1, y: 2, label: '(-1, 2) local max' },
        { x: 1, y: -2, label: '(1, −2) local min' },
        { x: 0, y: 0, label: '(0, 0)' },
      ],
      intervals: [
        { from: -2.5, to: -1, kind: 'inc' },
        { from: -1, to: 1, kind: 'dec' },
        { from: 1, to: 2.5, kind: 'inc' },
      ],
    },
    questions: [
      {
        id: 'id1',
        topic: 'Increasing / decreasing',
        prompt: 'f(x)=x^3-3x\\text{ is decreasing on}',
        options: ['(-\\infty,-1)', '[-1,1]', '(1,\\infty)', '(-\\infty,\\infty)'],
        correct: 1,
        explanation: {
          en: "f′(x)=3(x−1)(x+1)<0 on (−1,1), so f is decreasing on [−1,1].",
          gu: "f′(x)=3(x−1)(x+1)<0 થાય (−1,1) પર, તેથી f, [−1,1] પર ઘટતું છે.",
        },
      },
      {
        id: 'id2',
        topic: 'Critical points',
        prompt: 'Critical points of f(x)=x^3-3x are',
        options: ['x=0', 'x=\\pm1', 'x=\\pm3', 'x=3'],
        correct: 1,
        explanation: {
          en: 'f′(x)=3x²−3=0 ⇒ x²=1 ⇒ x=±1.',
          gu: 'f′(x)=3x²−3=0 ⇒ x²=1 ⇒ x=±1.',
        },
      },
    ],
  },
];

export function getLesson(id: string) {
  return lessons.find((l) => l.id === id);
}
