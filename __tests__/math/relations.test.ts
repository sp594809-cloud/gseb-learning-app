/**
 * Automated verification for Relations & Functions classifiers.
 * Run with: npx tsx __tests__/math/relations.test.ts
 * (or integrate with vitest/jest later)
 */

import {
  isReflexive,
  isSymmetric,
  isTransitive,
  analyzeRelation,
  isFunction,
  analyzeFunction,
  compose,
} from '../../lib/math/relations';

let passed = 0;
let failed = 0;

function assert(cond: boolean, msg: string) {
  if (cond) {
    passed++;
    console.log('  ✓', msg);
  } else {
    failed++;
    console.error('  ✗', msg);
  }
}

console.log('\n=== Reflexive ===');
assert(isReflexive([[1,1],[2,2]], [1,2]), 'full diagonal is reflexive');
assert(!isReflexive([[1,1]], [1,2]), 'missing (2,2) is not reflexive');
assert(isReflexive([], []), 'empty set is vacuously reflexive');

console.log('\n=== Symmetric ===');
assert(isSymmetric([[1,2],[2,1]]), 'symmetric pair');
assert(!isSymmetric([[1,2]]), 'one-way pair is not symmetric');
assert(isSymmetric([[1,1]]), 'single loop is symmetric');

console.log('\n=== Transitive ===');
assert(isTransitive([[1,2],[2,3],[1,3]]), 'transitive chain');
assert(!isTransitive([[1,2],[2,3]]), 'missing (1,3) breaks transitivity');
assert(isTransitive([]), 'empty relation is transitive');

console.log('\n=== Equivalence ===');
const eq = analyzeRelation(
  [[1,1],[2,2],[3,3],[1,2],[2,1]],
  [1,2,3]
);
assert(eq.isEquivalence === false, 'missing (3 linked) is not full equivalence on {1,2,3}');
assert(eq.isReflexive && eq.isSymmetric, 'partial equivalence properties detected');

const fullEq = analyzeRelation(
  [[1,1],[2,2],[1,2],[2,1]],
  [1,2]
);
assert(fullEq.isEquivalence, 'full equivalence on {1,2}');
assert(fullEq.equivalenceClasses.length === 1, 'one class {1,2}');

console.log('\n=== Function ===');
assert(isFunction([[1,'a'],[2,'b']], [1,2]), 'valid function');
assert(!isFunction([[1,'a'],[1,'b']], [1]), 'two images → not a function');
assert(!isFunction([[1,'a']], [1,2]), 'missing domain element → not a function');

const fn = analyzeFunction(
  [[1,'a'],[2,'b'],[3,'c']],
  [1,2,3],
  ['a','b','c']
);
assert(fn.isBijective, 'identity-like is bijective');

const notOnto = analyzeFunction(
  [[1,'a'],[2,'a']],
  [1,2],
  ['a','b']
);
assert(notOnto.isFunction && notOnto.isOneOne === false && notOnto.isOnto === false, 'constant-like fails one-one and onto');

console.log('\n=== Composition ===');
const f = [[1,2],[2,3]] as [number,number][];
const g = [[2,10],[3,20]] as [number,number][];
const gof = compose(f, g, [1,2]);
assert(gof.length === 2 && gof[0][1] === 10 && gof[1][1] === 20, 'g∘f maps correctly');

console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
