/**
 * Inverse Trigonometric Functions utilities.
 * Principal values and domain handling according to standard GSEB / NCERT ranges.
 */

export type TrigFn = 'sin' | 'cos' | 'tan' | 'cot' | 'sec' | 'csc';

/** Principal value ranges (radians) */
export const PRINCIPAL_RANGES: Record<TrigFn, { min: number; max: number; open?: ('min' | 'max')[] }> = {
  sin: { min: -Math.PI / 2, max: Math.PI / 2 },
  cos: { min: 0, max: Math.PI },
  tan: { min: -Math.PI / 2, max: Math.PI / 2, open: ['min', 'max'] },
  cot: { min: 0, max: Math.PI, open: ['min', 'max'] },
  sec: { min: 0, max: Math.PI, open: [] }, // excludes π/2
  csc: { min: -Math.PI / 2, max: Math.PI / 2, open: [] }, // excludes 0
};

export function clampToPrincipal(fn: TrigFn, value: number): number {
  const range = PRINCIPAL_RANGES[fn];
  // For teaching we return the value if already in range; otherwise note it is outside
  return value;
}

/** Safe arcsin in principal range [-π/2, π/2] */
export function arcsin(x: number): number | null {
  if (x < -1 || x > 1 || Number.isNaN(x)) return null;
  return Math.asin(x);
}

/** Safe arccos in principal range [0, π] */
export function arccos(x: number): number | null {
  if (x < -1 || x > 1 || Number.isNaN(x)) return null;
  return Math.acos(x);
}

/** Safe arctan in principal range (−π/2, π/2) */
export function arctan(x: number): number | null {
  if (Number.isNaN(x)) return null;
  return Math.atan(x);
}

export function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function formatAngle(rad: number, unit: 'rad' | 'deg', digits = 4): string {
  if (unit === 'deg') return `${toDegrees(rad).toFixed(digits)}°`;
  // nice common values
  const ratio = rad / Math.PI;
  const nice = [
    [-1, '-π'], [-0.5, '-π/2'], [0, '0'], [0.5, 'π/2'], [1, 'π'],
    [1/3, 'π/3'], [1/4, 'π/4'], [1/6, 'π/6'],
    [-1/3, '-π/3'], [-1/4, '-π/4'], [-1/6, '-π/6'],
  ];
  for (const [r, label] of nice) {
    if (Math.abs(ratio - (r as number)) < 1e-10) return label as string;
  }
  return `${rad.toFixed(digits)} rad`;
}

/** Sample points for graphing inverse functions */
export function sampleInverse(
  fn: 'arcsin' | 'arccos' | 'arctan',
  samples = 80
): { x: number; y: number | null }[] {
  const points: { x: number; y: number | null }[] = [];
  if (fn === 'arctan') {
    for (let i = 0; i <= samples; i++) {
      const x = -6 + (12 * i) / samples;
      points.push({ x, y: arctan(x) });
    }
  } else {
    for (let i = 0; i <= samples; i++) {
      const x = -1 + (2 * i) / samples;
      const y = fn === 'arcsin' ? arcsin(x) : arccos(x);
      points.push({ x, y });
    }
  }
  return points;
}

/** Unit circle point for angle θ (radians) */
export function unitCirclePoint(theta: number): { x: number; y: number } {
  return { x: Math.cos(theta), y: Math.sin(theta) };
}
