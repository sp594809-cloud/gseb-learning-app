'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  arcsin,
  arccos,
  arctan,
  toDegrees,
  toRadians,
  formatAngle,
  sampleInverse,
  unitCirclePoint,
  PRINCIPAL_RANGES,
} from '../../../lib/math/inverseTrig';

const COLORS = {
  indigo: '#1E3A5F',
  blue: '#3B82F6',
  saffron: '#F59E0B',
  emerald: '#10B981',
  rose: '#F43F5E',
  muted: '#64748B',
  canvas: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
};

type Mode = 'unit-circle' | 'arcsin' | 'arccos' | 'arctan';

export default function InverseTrigLabPage() {
  const [mode, setMode] = useState<Mode>('unit-circle');
  const [angleDeg, setAngleDeg] = useState(45);
  const [inputX, setInputX] = useState(0.5);
  const [unit, setUnit] = useState<'rad' | 'deg'>('deg');

  const angleRad = toRadians(angleDeg);
  const point = unitCirclePoint(angleRad);

  const asinVal = arcsin(inputX);
  const acosVal = arccos(inputX);
  const atanVal = arctan(inputX);

  const graphPoints = useMemo(() => {
    if (mode === 'unit-circle') return [];
    return sampleInverse(mode as 'arcsin' | 'arccos' | 'arctan', 100);
  }, [mode]);

  // SVG graph bounds
  const graphW = 320;
  const graphH = 220;
  const pad = 30;

  function xToSvg(x: number, xMin: number, xMax: number) {
    return pad + ((x - xMin) / (xMax - xMin)) * (graphW - 2 * pad);
  }
  function yToSvg(y: number, yMin: number, yMax: number) {
    return graphH - pad - ((y - yMin) / (yMax - yMin)) * (graphH - 2 * pad);
  }

  const xMin = mode === 'arctan' ? -6 : -1.2;
  const xMax = mode === 'arctan' ? 6 : 1.2;
  const yMin = mode === 'arccos' ? -0.2 : -Math.PI / 2 - 0.2;
  const yMax = mode === 'arcsin' || mode === 'arctan' ? Math.PI / 2 + 0.2 : Math.PI + 0.2;

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: COLORS.canvas,
        color: COLORS.indigo,
        fontFamily: "'Inter', 'Noto Sans Gujarati', system-ui, sans-serif",
      }}
    >
      <header
        style={{
          background: COLORS.surface,
          borderBottom: `1px solid ${COLORS.border}`,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        <Link href="/lab" style={{ textDecoration: 'none', color: COLORS.muted, fontSize: 14 }}>
          ← લેબ
        </Link>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, flex: 1 }}>
          વિકોણમિતીય પ્રતિવિધેયો લેબ
        </h1>
      </header>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '16px 16px 80px' }}>
        {/* Mode tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {(
            [
              ['unit-circle', 'યુનિટ સર્કલ'],
              ['arcsin', 'sin⁻¹'],
              ['arccos', 'cos⁻¹'],
              ['arctan', 'tan⁻¹'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              style={{
                padding: '8px 14px',
                borderRadius: 10,
                border: 'none',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                background: mode === id ? '#8B5CF6' : COLORS.surface,
                color: mode === id ? 'white' : COLORS.indigo,
                boxShadow: mode === id ? '0 2px 8px rgba(139,92,246,0.35)' : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Unit Circle Mode */}
        {mode === 'unit-circle' && (
          <section
            style={{
              background: COLORS.surface,
              borderRadius: 16,
              border: `1px solid ${COLORS.border}`,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <h2 style={{ margin: '0 0 12px', fontSize: 16 }}>યુનિટ સર્કલ</h2>

            <svg viewBox="0 0 280 280" style={{ width: '100%', maxWidth: 300, display: 'block', margin: '0 auto' }}>
              {/* Axes */}
              <line x1="20" y1="140" x2="260" y2="140" stroke="#CBD5E1" strokeWidth="1" />
              <line x1="140" y1="20" x2="140" y2="260" stroke="#CBD5E1" strokeWidth="1" />
              {/* Circle */}
              <circle cx="140" cy="140" r="100" fill="none" stroke="#8B5CF6" strokeWidth="2" />
              {/* Angle arc */}
              <path
                d={`M 240 140 A 100 100 0 ${angleDeg > 180 || angleDeg < 0 ? 1 : 0} ${angleDeg >= 0 ? 0 : 1} ${140 + 100 * point.x} ${140 - 100 * point.y}`}
                fill="none"
                stroke={COLORS.saffron}
                strokeWidth="2"
              />
              {/* Radius line */}
              <line
                x1="140"
                y1="140"
                x2={140 + 100 * point.x}
                y2={140 - 100 * point.y}
                stroke={COLORS.blue}
                strokeWidth="2.5"
              />
              {/* Point */}
              <circle
                cx={140 + 100 * point.x}
                cy={140 - 100 * point.y}
                r="6"
                fill={COLORS.saffron}
              />
              {/* Labels */}
              <text x="250" y="135" fontSize="12" fill={COLORS.muted}>x</text>
              <text x="145" y="30" fontSize="12" fill={COLORS.muted}>y</text>
            </svg>

            <div style={{ marginTop: 16 }}>
              <label style={{ fontSize: 13, color: COLORS.muted }}>
                કોણ (degrees): {angleDeg}°
              </label>
              <input
                type="range"
                min={-180}
                max={180}
                value={angleDeg}
                onChange={e => setAngleDeg(Number(e.target.value))}
                style={{ width: '100%', marginTop: 6 }}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
                marginTop: 14,
                fontSize: 14,
              }}
            >
              <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 10 }}>
                <div style={{ color: COLORS.muted, fontSize: 12 }}>sin θ</div>
                <strong>{point.y.toFixed(4)}</strong>
              </div>
              <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 10 }}>
                <div style={{ color: COLORS.muted, fontSize: 12 }}>cos θ</div>
                <strong>{point.x.toFixed(4)}</strong>
              </div>
              <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 10 }}>
                <div style={{ color: COLORS.muted, fontSize: 12 }}>θ (rad)</div>
                <strong>{formatAngle(angleRad, 'rad')}</strong>
              </div>
              <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 10 }}>
                <div style={{ color: COLORS.muted, fontSize: 12 }}>θ (deg)</div>
                <strong>{angleDeg}°</strong>
              </div>
            </div>
          </section>
        )}

        {/* Inverse function modes */}
        {mode !== 'unit-circle' && (
          <section
            style={{
              background: COLORS.surface,
              borderRadius: 16,
              border: `1px solid ${COLORS.border}`,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <h2 style={{ margin: '0 0 12px', fontSize: 16 }}>
              {mode === 'arcsin' && 'y = sin⁻¹(x)  ·  મુખ્ય કિંમત [−π/2, π/2]'}
              {mode === 'arccos' && 'y = cos⁻¹(x)  ·  મુખ્ય કિંમત [0, π]'}
              {mode === 'arctan' && 'y = tan⁻¹(x)  ·  મુખ્ય કિંમત (−π/2, π/2)'}
            </h2>

            {/* Graph */}
            <svg
              viewBox={`0 0 ${graphW} ${graphH}`}
              style={{ width: '100%', background: '#F8FAFC', borderRadius: 12 }}
            >
              {/* Axes */}
              <line
                x1={pad}
                y1={yToSvg(0, yMin, yMax)}
                x2={graphW - pad}
                y2={yToSvg(0, yMin, yMax)}
                stroke="#CBD5E1"
              />
              <line
                x1={xToSvg(0, xMin, xMax)}
                y1={pad}
                x2={xToSvg(0, xMin, xMax)}
                y2={graphH - pad}
                stroke="#CBD5E1"
              />
              {/* Curve */}
              <polyline
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="2.5"
                points={graphPoints
                  .filter(p => p.y !== null)
                  .map(p => `${xToSvg(p.x, xMin, xMax)},${yToSvg(p.y!, yMin, yMax)}`)
                  .join(' ')}
              />
              {/* Current point */}
              {(() => {
                const y =
                  mode === 'arcsin' ? asinVal : mode === 'arccos' ? acosVal : atanVal;
                if (y === null) return null;
                const x = mode === 'arctan' ? inputX : Math.max(-1, Math.min(1, inputX));
                return (
                  <circle
                    cx={xToSvg(x, xMin, xMax)}
                    cy={yToSvg(y, yMin, yMax)}
                    r="6"
                    fill={COLORS.saffron}
                  />
                );
              })()}
            </svg>

            <div style={{ marginTop: 16 }}>
              <label style={{ fontSize: 13, color: COLORS.muted }}>
                x = {inputX.toFixed(3)}
                {mode !== 'arctan' && (inputX < -1 || inputX > 1) && (
                  <span style={{ color: COLORS.rose }}> (ડોમેન બહાર)</span>
                )}
              </label>
              <input
                type="range"
                min={mode === 'arctan' ? -6 : -1}
                max={mode === 'arctan' ? 6 : 1}
                step={0.01}
                value={inputX}
                onChange={e => setInputX(Number(e.target.value))}
                style={{ width: '100%', marginTop: 6 }}
              />
            </div>

            <div
              style={{
                marginTop: 14,
                padding: 12,
                background: '#F5F3FF',
                borderRadius: 12,
                fontSize: 15,
              }}
            >
              {mode === 'arcsin' && (
                <>
                  sin⁻¹({inputX.toFixed(3)}) ={' '}
                  <strong>
                    {asinVal === null
                      ? 'અપરિભાષિત'
                      : formatAngle(asinVal, unit)}
                  </strong>
                </>
              )}
              {mode === 'arccos' && (
                <>
                  cos⁻¹({inputX.toFixed(3)}) ={' '}
                  <strong>
                    {acosVal === null
                      ? 'અપરિભાષિત'
                      : formatAngle(acosVal, unit)}
                  </strong>
                </>
              )}
              {mode === 'arctan' && (
                <>
                  tan⁻¹({inputX.toFixed(3)}) ={' '}
                  <strong>
                    {atanVal === null
                      ? 'અપરિભાષિત'
                      : formatAngle(atanVal, unit)}
                  </strong>
                </>
              )}
            </div>

            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
              <button
                onClick={() => setUnit('rad')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: `1px solid ${COLORS.border}`,
                  background: unit === 'rad' ? '#8B5CF6' : 'white',
                  color: unit === 'rad' ? 'white' : COLORS.indigo,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                રેડિયન
              </button>
              <button
                onClick={() => setUnit('deg')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: `1px solid ${COLORS.border}`,
                  background: unit === 'deg' ? '#8B5CF6' : 'white',
                  color: unit === 'deg' ? 'white' : COLORS.indigo,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                ડિગ્રી
              </button>
            </div>
          </section>
        )}

        {/* Principal value explanation */}
        <section
          style={{
            background: '#F5F3FF',
            borderRadius: 16,
            padding: 16,
            border: '1px solid #DDD6FE',
          }}
        >
          <h3 style={{ margin: '0 0 8px', fontSize: 15 }}>મુખ્ય કિંમત (Principal Value)</h3>
          <div style={{ fontSize: 14, lineHeight: 1.6 }}>
            <p>
              <strong>sin⁻¹ x</strong> ની મુખ્ય કિંમત{' '}
              <code>[−π/2, π/2]</code> માં હોય છે.
            </p>
            <p>
              <strong>cos⁻¹ x</strong> ની મુખ્ય કિંમત <code>[0, π]</code> માં હોય છે.
            </p>
            <p>
              <strong>tan⁻¹ x</strong> ની મુખ્ય કિંમત <code>(−π/2, π/2)</code> માં હોય છે.
            </p>
            <p style={{ marginBottom: 0 }}>
              ડોમેન બહારની કિંમતો માટે વિધેય અપરિભાષિત (undefined) ગણાય છે.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
