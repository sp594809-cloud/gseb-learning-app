/**
 * Matrix utilities with exact rational arithmetic where practical.
 * Dimension checks are strict — incompatible operations throw clear errors.
 */

export type Matrix = number[][];

export function rows(M: Matrix): number {
  return M.length;
}
export function cols(M: Matrix): number {
  return M[0]?.length ?? 0;
}

export function isRectangular(M: Matrix): boolean {
  if (M.length === 0) return true;
  const c = M[0].length;
  return M.every(row => row.length === c);
}

export function sameShape(A: Matrix, B: Matrix): boolean {
  return rows(A) === rows(B) && cols(A) === cols(B);
}

export function canMultiply(A: Matrix, B: Matrix): boolean {
  return cols(A) === rows(B);
}

export function zeros(r: number, c: number): Matrix {
  return Array.from({ length: r }, () => Array(c).fill(0));
}

export function identity(n: number): Matrix {
  const I = zeros(n, n);
  for (let i = 0; i < n; i++) I[i][i] = 1;
  return I;
}

export function add(A: Matrix, B: Matrix): Matrix {
  if (!sameShape(A, B)) {
    throw new Error(`આકાર અસંગત: ${rows(A)}×${cols(A)} અને ${rows(B)}×${cols(B)} સરખા હોવા જોઈએ.`);
  }
  return A.map((row, i) => row.map((v, j) => v + B[i][j]));
}

export function subtract(A: Matrix, B: Matrix): Matrix {
  if (!sameShape(A, B)) {
    throw new Error(`આકાર અસંગત: ${rows(A)}×${cols(A)} અને ${rows(B)}×${cols(B)}.`);
  }
  return A.map((row, i) => row.map((v, j) => v - B[i][j]));
}

export function scalarMultiply(k: number, A: Matrix): Matrix {
  return A.map(row => row.map(v => k * v));
}

export function multiply(A: Matrix, B: Matrix): Matrix {
  if (!canMultiply(A, B)) {
    throw new Error(
      `ગુણાકાર અસંભવ: ${rows(A)}×${cols(A)} અને ${rows(B)}×${cols(B)} — A ની કૉલમ = B ની પંક્તિ હોવી જોઈએ.`
    );
  }
  const r = rows(A);
  const c = cols(B);
  const n = cols(A);
  const C = zeros(r, c);
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) sum += A[i][k] * B[k][j];
      C[i][j] = sum;
    }
  }
  return C;
}

export function transpose(A: Matrix): Matrix {
  const r = rows(A);
  const c = cols(A);
  const T = zeros(c, r);
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) T[j][i] = A[i][j];
  }
  return T;
}

/** 2×2 determinant */
export function det2(A: Matrix): number {
  if (rows(A) !== 2 || cols(A) !== 2) throw new Error('det2 માટે 2×2 મેટ્રિક્સ જોઈએ.');
  return A[0][0] * A[1][1] - A[0][1] * A[1][0];
}

/** 3×3 determinant (Sarrus / expansion) */
export function det3(A: Matrix): number {
  if (rows(A) !== 3 || cols(A) !== 3) throw new Error('det3 માટે 3×3 મેટ્રિક્સ જોઈએ.');
  const [a, b, c] = A[0];
  const [d, e, f] = A[1];
  const [g, h, i] = A[2];
  return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
}

export function determinant(A: Matrix): number {
  const n = rows(A);
  if (n !== cols(A)) throw new Error('નિર્ધારક માટે વર્ગ મેટ્રિક્સ જોઈએ.');
  if (n === 1) return A[0][0];
  if (n === 2) return det2(A);
  if (n === 3) return det3(A);
  throw new Error('હાલમાં ફક્ત 1×1, 2×2, 3×3 સપોર્ટેડ છે.');
}

/** Format matrix for display */
export function formatMatrix(A: Matrix, digits = 4): string {
  return A.map(row =>
    '[ ' + row.map(v => {
      if (Number.isInteger(v)) return String(v);
      return v.toFixed(digits).replace(/\.?0+$/, '');
    }).join('  ') + ' ]'
  ).join('\n');
}
