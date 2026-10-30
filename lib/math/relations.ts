/**
 * Pure mathematical utilities for Relations and Functions.
 * All classification is done by exhaustive checking of applicable pairs.
 * Handles empty sets and finite-set edge cases correctly.
 */

export type Element = string | number;
export type Pair = [Element, Element];
export type Relation = Pair[];

export interface RelationAnalysis {
  isReflexive: boolean;
  isSymmetric: boolean;
  isTransitive: boolean;
  isEquivalence: boolean;
  missingReflexive: Pair[];
  missingSymmetric: Pair[];
  missingTransitive: Array<{ a: Element; b: Element; c: Element }>;
  equivalenceClasses: Element[][];
}

export interface FunctionAnalysis {
  isFunction: boolean;
  isOneOne: boolean;
  isOnto: boolean;
  isBijective: boolean;
  domain: Element[];
  codomain: Element[];
  image: Element[];
  reasons: string[];
}

/** Create Cartesian product A × B */
export function cartesianProduct(A: Element[], B: Element[]): Pair[] {
  const result: Pair[] = [];
  for (const a of A) {
    for (const b of B) {
      result.push([a, b]);
    }
  }
  return result;
}

/** Check whether a pair exists in the relation (order-sensitive) */
export function hasPair(R: Relation, a: Element, b: Element): boolean {
  return R.some(([x, y]) => x === a && y === b);
}

/**
 * Reflexive on set S: ∀a ∈ S, (a,a) ∈ R
 * Empty set is vacuously reflexive.
 */
export function isReflexive(R: Relation, S: Element[]): boolean {
  if (S.length === 0) return true;
  return S.every(a => hasPair(R, a, a));
}

/**
 * Symmetric: (a,b) ∈ R ⇒ (b,a) ∈ R
 */
export function isSymmetric(R: Relation): boolean {
  return R.every(([a, b]) => hasPair(R, b, a));
}

/**
 * Transitive: (a,b) ∈ R ∧ (b,c) ∈ R ⇒ (a,c) ∈ R
 */
export function isTransitive(R: Relation): boolean {
  for (const [a, b] of R) {
    for (const [x, c] of R) {
      if (b === x && !hasPair(R, a, c)) {
        return false;
      }
    }
  }
  return true;
}

/** Full analysis with missing pairs for teaching feedback */
export function analyzeRelation(R: Relation, S: Element[]): RelationAnalysis {
  const missingReflexive: Pair[] = [];
  for (const a of S) {
    if (!hasPair(R, a, a)) missingReflexive.push([a, a]);
  }

  const missingSymmetric: Pair[] = [];
  for (const [a, b] of R) {
    if (!hasPair(R, b, a)) {
      // avoid duplicates
      if (!missingSymmetric.some(([x, y]) => x === b && y === a)) {
        missingSymmetric.push([b, a]);
      }
    }
  }

  const missingTransitive: Array<{ a: Element; b: Element; c: Element }> = [];
  for (const [a, b] of R) {
    for (const [x, c] of R) {
      if (b === x && !hasPair(R, a, c)) {
        missingTransitive.push({ a, b, c });
      }
    }
  }

  const reflexive = missingReflexive.length === 0;
  const symmetric = missingSymmetric.length === 0;
  const transitive = missingTransitive.length === 0;
  const isEquivalence = reflexive && symmetric && transitive;

  let equivalenceClasses: Element[][] = [];
  if (isEquivalence && S.length > 0) {
    const visited = new Set<Element>();
    for (const a of S) {
      if (visited.has(a)) continue;
      const cls = S.filter(b => hasPair(R, a, b));
      cls.forEach(x => visited.add(x));
      equivalenceClasses.push(cls);
    }
  }

  return {
    isReflexive: reflexive,
    isSymmetric: symmetric,
    isTransitive: transitive,
    isEquivalence,
    missingReflexive,
    missingSymmetric,
    missingTransitive,
    equivalenceClasses,
  };
}

/**
 * A relation R ⊆ A × B is a function if every element of A appears
 * in exactly one ordered pair as the first component.
 */
export function isFunction(R: Relation, A: Element[]): boolean {
  if (A.length === 0) return true;
  for (const a of A) {
    const images = R.filter(([x]) => x === a);
    if (images.length !== 1) return false;
  }
  // also reject pairs whose first component is outside A
  for (const [a] of R) {
    if (!A.includes(a)) return false;
  }
  return true;
}

export function analyzeFunction(
  R: Relation,
  A: Element[],
  B: Element[]
): FunctionAnalysis {
  const reasons: string[] = [];
  const func = isFunction(R, A);

  if (!func) {
    reasons.push('દરેક a ∈ A માટે બરાબર એક જ (a, b) હોવું જોઈએ.');
  }

  // image
  const image = Array.from(new Set(R.map(([, b]) => b)));

  // one-one (injective)
  let oneOne = func;
  if (func) {
    const seen = new Map<Element, Element>();
    for (const [a, b] of R) {
      if (seen.has(b) && seen.get(b) !== a) {
        oneOne = false;
        reasons.push(`f(${seen.get(b)}) = f(${a}) = ${b}, તેથી એક-એક નથી.`);
        break;
      }
      seen.set(b, a);
    }
  }

  // onto (surjective)
  let onto = func && B.every(b => image.includes(b));
  if (func && !onto) {
    const missing = B.filter(b => !image.includes(b));
    reasons.push(`સહપ્રદેશના ઘટકો ${missing.join(', ')} કોઈ પણ a નું ચિત્ર નથી.`);
  }

  return {
    isFunction: func,
    isOneOne: oneOne,
    isOnto: onto,
    isBijective: oneOne && onto,
    domain: A,
    codomain: B,
    image,
    reasons,
  };
}

/** Function composition g ∘ f */
export function compose(
  f: Relation,
  g: Relation,
  domainF: Element[]
): Relation {
  const result: Relation = [];
  for (const a of domainF) {
    const fPairs = f.filter(([x]) => x === a);
    if (fPairs.length !== 1) continue;
    const b = fPairs[0][1];
    const gPairs = g.filter(([x]) => x === b);
    if (gPairs.length === 1) {
      result.push([a, gPairs[0][1]]);
    }
  }
  return result;
}

/** Example presets for the lab */
export const PRESETS = {
  equivalence: {
    nameGu: 'સામ્ય સંબંધ ઉદાહરણ',
    A: [1, 2, 3, 4],
    pairs: [[1,1],[2,2],[3,3],[4,4],[1,2],[2,1],[3,4],[4,3]] as Pair[],
  },
  notReflexive: {
    nameGu: 'સ્વવાચક નથી',
    A: [1, 2, 3],
    pairs: [[1,1],[2,2],[1,2],[2,1]] as Pair[],
  },
  notSymmetric: {
    nameGu: 'સમિત નથી',
    A: [1, 2, 3],
    pairs: [[1,1],[2,2],[3,3],[1,2]] as Pair[],
  },
  notTransitive: {
    nameGu: 'પરંપરિત નથી',
    A: [1, 2, 3],
    pairs: [[1,1],[2,2],[3,3],[1,2],[2,3]] as Pair[],
  },
  bijection: {
    nameGu: 'એક-એક અને વ્યાપ્ત વિધેય',
    A: [1, 2, 3],
    B: ['a', 'b', 'c'],
    pairs: [[1,'a'],[2,'b'],[3,'c']] as Pair[],
  },
};
