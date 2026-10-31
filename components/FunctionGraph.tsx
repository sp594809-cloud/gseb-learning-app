'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import type { GraphConfig } from '../data/lessons';
import { sampleCurve, graphFns } from '../lib/graphFns';

type Props = {
  config: GraphConfig;
  lang: 'en' | 'gu';
  activeStep?: number;
  reducedMotion?: boolean;
};

const W = 340;
const H = 260;
const PAD = 36;

export default function FunctionGraph({ config, lang, activeStep = -1, reducedMotion }: Props) {
  const [zoom, setZoom] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const raf = useRef<number | null>(null);

  const xMin = config.xMin / zoom;
  const xMax = config.xMax / zoom;
  const yMin = config.yMin / zoom;
  const yMax = config.yMax / zoom;

  const pts = useMemo(() => sampleCurve(config.f, xMin, xMax, 160), [config.f, xMin, xMax]);

  function sx(x: number) {
    return PAD + ((x - xMin) / (xMax - xMin)) * (W - 2 * PAD);
  }
  function sy(y: number) {
    return H - PAD - ((y - yMin) / (yMax - yMin)) * (H - 2 * PAD);
  }

  const poly = pts.map((p) => `${sx(p.x)},${sy(p.y)}`).join(' ');

  useEffect(() => {
    if (!playing || reducedMotion) {
      if (raf.current) cancelAnimationFrame(raf.current);
      return;
    }
    const start = performance.now();
    const duration = 4000;
    const loop = (now: number) => {
      setT(((now - start) % duration) / duration);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [playing, reducedMotion]);

  const animX = xMin + t * (xMax - xMin);
  const animFn = graphFns[config.f];
  const animY = animFn ? animFn(animX) : 0;
  const primeFn = config.fPrime ? graphFns[config.fPrime] : null;
  const slope = primeFn ? primeFn(animX) : 0;
  const tangLen = 0.6;
  const showIntervals = activeStep >= 3 || activeStep === -1;

  const ariaDesc =
    lang === 'gu'
      ? `આલેખ: ${config.expression}. મહત્વના બિંદુઓ અને વધતા-ઘટતા અંતરાલ દર્શાવેલ છે.`
      : `Graph of ${config.expression}. Critical points and increasing/decreasing intervals are marked.`;

  return (
    <div className="graph-panel">
      <div className="graph-toolbar">
        <span className="tag">{lang === 'gu' ? 'આલેખ શોધો' : 'Explore graph'}</span>
        <div className="graph-actions">
          <button type="button" className="pill" onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}>+</button>
          <button type="button" className="pill" onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}>−</button>
          <button type="button" className="pill" onClick={() => { setZoom(1); setT(0); setPlaying(false); }}>
            {lang === 'gu' ? 'રીસેટ' : 'Reset'}
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="graph-svg" role="img" aria-label={ariaDesc}>
        <title>{ariaDesc}</title>
        <line x1={PAD} y1={sy(0)} x2={W - PAD} y2={sy(0)} stroke="#40506e" strokeWidth="1.5" />
        <line x1={sx(0)} y1={PAD} x2={sx(0)} y2={H - PAD} stroke="#40506e" strokeWidth="1.5" />
        {showIntervals &&
          config.intervals?.map((iv, i) => {
            const x1 = sx(Math.max(iv.from, xMin));
            const x2 = sx(Math.min(iv.to, xMax));
            if (x2 <= x1) return null;
            return (
              <rect key={i} x={x1} y={PAD} width={x2 - x1} height={H - 2 * PAD}
                fill={iv.kind === 'inc' ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)'} />
            );
          })}
        <polyline fill="none" stroke="#a78bfa" strokeWidth="2.5" points={poly} />
        {config.points?.map((pt, i) => (
          <g key={i}>
            <circle cx={sx(pt.x)} cy={sy(pt.y)} r="5" fill="#fbbf24" stroke="#0f172a" strokeWidth="1" />
            <text x={sx(pt.x) + 8} y={sy(pt.y) - 8} fontSize="10" fill="#e2e8f0">({pt.x}, {pt.y})</text>
          </g>
        ))}
        {playing && !reducedMotion && Number.isFinite(animY) && (
          <g>
            <line x1={sx(animX - tangLen)} y1={sy(animY - slope * tangLen)}
              x2={sx(animX + tangLen)} y2={sy(animY + slope * tangLen)}
              stroke="#34d399" strokeWidth="2" strokeDasharray="4 3" />
            <circle cx={sx(animX)} cy={sy(animY)} r="5" fill="#34d399" />
          </g>
        )}
        <text x={W - PAD + 4} y={sy(0) + 4} fontSize="11" fill="#9cacc8">x</text>
        <text x={sx(0) + 4} y={PAD - 6} fontSize="11" fill="#9cacc8">y</text>
      </svg>

      <div className="graph-legend muted">
        <span className="leg-inc">■ {lang === 'gu' ? 'વધતું' : 'Increasing'}</span>
        <span className="leg-dec">■ {lang === 'gu' ? 'ઘટતું' : 'Decreasing'}</span>
        <span>◆ {lang === 'gu' ? 'સ્થિર બિંદુ' : 'Stationary point'}</span>
      </div>

      <div className="anim-controls">
        <button type="button" className="pill" onClick={() => setPlaying((p) => !p)} disabled={reducedMotion}>
          {playing ? (lang === 'gu' ? 'થોભો' : 'Pause') : (lang === 'gu' ? 'સ્પર્શરેખા ચલાવો' : 'Play tangent')}
        </button>
        <button type="button" className="pill" onClick={() => { setPlaying(false); setT(0); }}>
          {lang === 'gu' ? 'છોડો' : 'Skip'}
        </button>
        {reducedMotion && (
          <span className="muted" style={{ fontSize: 12 }}>
            {lang === 'gu' ? 'એનિમેશન બંધ (reduced motion)' : 'Animation off (reduced motion)'}
          </span>
        )}
      </div>

      <p className="graph-caption muted">
        {lang === 'gu'
          ? `${config.expression}. પીળા બિંદુઓ સ્થાનિક મહત્તમ/લઘુત્તમ દર્શાવે છે.`
          : `${config.expression}. Yellow markers show local max/min.`}
      </p>
    </div>
  );
}
