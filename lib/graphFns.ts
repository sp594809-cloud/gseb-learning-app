/** Named function evaluators used by GraphConfig.f keys — pure, no eval() */
export const graphFns: Record<string, (x: number) => number> = {
  x3m3x: (x) => x * x * x - 3 * x,
  '3x2m3': (x) => 3 * x * x - 3,
};

export function sampleCurve(
  fnKey: string,
  xMin: number,
  xMax: number,
  n = 120
): { x: number; y: number }[] {
  const fn = graphFns[fnKey];
  if (!fn) return [];
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= n; i++) {
    const x = xMin + ((xMax - xMin) * i) / n;
    const y = fn(x);
    if (Number.isFinite(y)) pts.push({ x, y });
  }
  return pts;
}
