'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  Element,
  Pair,
  Relation,
  analyzeRelation,
  analyzeFunction,
  compose,
  PRESETS,
  hasPair,
} from '../../../lib/math/relations';

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

function Badge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 600,
        background: ok ? '#ECFDF5' : '#FEF2F2',
        color: ok ? '#047857' : '#BE123C',
        border: `1px solid ${ok ? '#A7F3D0' : '#FECDD3'}`,
      }}
    >
      {ok ? '✓' : '✗'} {label}
    </span>
  );
}

export default function RelationsLabPage() {
  const [setA, setSetA] = useState<Element[]>([1, 2, 3]);
  const [setB, setSetB] = useState<Element[]>([1, 2, 3]);
  const [pairs, setPairs] = useState<Relation>([
    [1, 1],
    [2, 2],
    [3, 3],
  ]);
  const [newA, setNewA] = useState('');
  const [newB, setNewB] = useState('');
  const [pairFrom, setPairFrom] = useState('');
  const [pairTo, setPairTo] = useState('');
  const [mode, setMode] = useState<'relation' | 'function'>('relation');
  const [showExplain, setShowExplain] = useState(true);

  const analysis = useMemo(() => analyzeRelation(pairs, setA), [pairs, setA]);
  const fnAnalysis = useMemo(
    () => analyzeFunction(pairs, setA, setB),
    [pairs, setA, setB]
  );

  const addElement = (which: 'A' | 'B') => {
    const val = which === 'A' ? newA.trim() : newB.trim();
    if (!val) return;
    const num = Number(val);
    const el: Element = isNaN(num) ? val : num;
    if (which === 'A') {
      if (!setA.includes(el)) setSetA([...setA, el]);
      setNewA('');
    } else {
      if (!setB.includes(el)) setSetB([...setB, el]);
      setNewB('');
    }
  };

  const removeElement = (which: 'A' | 'B', el: Element) => {
    if (which === 'A') {
      setSetA(setA.filter(x => x !== el));
      setPairs(pairs.filter(([a, b]) => a !== el && b !== el));
    } else {
      setSetB(setB.filter(x => x !== el));
      setPairs(pairs.filter(([, b]) => b !== el));
    }
  };

  const togglePair = (a: Element, b: Element) => {
    if (hasPair(pairs, a, b)) {
      setPairs(pairs.filter(([x, y]) => !(x === a && y === b)));
    } else {
      setPairs([...pairs, [a, b]]);
    }
  };

  const addPairManually = () => {
    if (!pairFrom || !pairTo) return;
    const a: Element = isNaN(Number(pairFrom)) ? pairFrom : Number(pairFrom);
    const b: Element = isNaN(Number(pairTo)) ? pairTo : Number(pairTo);
    if (!hasPair(pairs, a, b)) setPairs([...pairs, [a, b]]);
    setPairFrom('');
    setPairTo('');
  };

  const loadPreset = (key: keyof typeof PRESETS) => {
    const p = PRESETS[key];
    setSetA(p.A);
    if ('B' in p && p.B) setSetB(p.B as Element[]);
    else setSetB(p.A);
    setPairs(p.pairs);
  };

  const reset = () => {
    setSetA([1, 2, 3]);
    setSetB([1, 2, 3]);
    setPairs([[1, 1], [2, 2], [3, 3]]);
  };

  // Arrow diagram positions
  const nodeY = (i: number, n: number) => 40 + (n <= 1 ? 0 : (i * 180) / (n - 1));

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: COLORS.canvas,
        color: COLORS.indigo,
        fontFamily: "'Inter', 'Noto Sans Gujarati', system-ui, sans-serif",
      }}
    >
      {/* Header */}
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
        <Link
          href="/lab"
          style={{
            textDecoration: 'none',
            color: COLORS.muted,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          ← લેબ
        </Link>
        <h1
          className="gujarati"
          style={{ margin: 0, fontSize: 18, fontWeight: 700, flex: 1 }}
        >
          સંબંધ અને વિધેય લેબ
        </h1>
        <button
          onClick={reset}
          style={{
            background: 'transparent',
            border: `1px solid ${COLORS.border}`,
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          રીસેટ
        </button>
      </header>

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '16px 16px 80px' }}>
        {/* Mode switch */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {(['relation', 'function'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 10,
                border: 'none',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                background: mode === m ? COLORS.blue : COLORS.surface,
                color: mode === m ? 'white' : COLORS.indigo,
                boxShadow: mode === m ? '0 2px 8px rgba(59,130,246,0.3)' : 'none',
              }}
            >
              {m === 'relation' ? 'સંબંધ (Relation)' : 'વિધેય (Function)'}
            </button>
          ))}
        </div>

        {/* Presets */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 8 }}>
            ઉદાહરણો:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(PRESETS).map(([key, p]) => (
              <button
                key={key}
                onClick={() => loadPreset(key as keyof typeof PRESETS)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.surface,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                {p.nameGu}
              </button>
            ))}
          </div>
        </div>

        {/* Sets editor */}
        <section
          style={{
            background: COLORS.surface,
            borderRadius: 16,
            border: `1px solid ${COLORS.border}`,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <h2 style={{ margin: '0 0 12px', fontSize: 16 }}>ગણ A અને B</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {(['A', 'B'] as const).map(which => {
              const set = which === 'A' ? setA : setB;
              const val = which === 'A' ? newA : newB;
              const setVal = which === 'A' ? setNewA : setNewB;
              return (
                <div key={which}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>
                    ગણ {which} = {'{' + set.join(', ') + '}'}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                    {set.map(el => (
                      <span
                        key={String(el)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          background: '#EEF2FF',
                          color: COLORS.indigo,
                          padding: '4px 8px',
                          borderRadius: 6,
                          fontSize: 14,
                        }}
                      >
                        {el}
                        <button
                          onClick={() => removeElement(which, el)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: COLORS.rose,
                            fontWeight: 700,
                            padding: 0,
                            lineHeight: 1,
                          }}
                          aria-label={`Remove ${el}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      value={val}
                      onChange={e => setVal(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addElement(which)}
                      placeholder="ઘટક ઉમેરો"
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: 8,
                        border: `1px solid ${COLORS.border}`,
                        fontSize: 14,
                      }}
                    />
                    <button
                      onClick={() => addElement(which)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 8,
                        border: 'none',
                        background: COLORS.blue,
                        color: 'white',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Pair matrix / arrow diagram */}
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
            ક્રમસૂચિત જોડી (Ordered Pairs)
          </h2>

          {/* Clickable matrix */}
          <div style={{ overflowX: 'auto', marginBottom: 16 }}>
            <table style={{ borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>
                  <th style={{ padding: 6 }}></th>
                  {setB.map(b => (
                    <th key={String(b)} style={{ padding: 6, color: COLORS.muted }}>
                      {b}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {setA.map(a => (
                  <tr key={String(a)}>
                    <td style={{ padding: 6, fontWeight: 600, color: COLORS.muted }}>
                      {a}
                    </td>
                    {setB.map(b => {
                      const active = hasPair(pairs, a, b);
                      return (
                        <td key={String(b)} style={{ padding: 4 }}>
                          <button
                            onClick={() => togglePair(a, b)}
                            aria-label={`Toggle (${a},${b})`}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 8,
                              border: `2px solid ${active ? COLORS.blue : COLORS.border}`,
                              background: active ? '#DBEAFE' : 'white',
                              cursor: 'pointer',
                              fontWeight: 700,
                              color: active ? COLORS.blue : COLORS.muted,
                            }}
                          >
                            {active ? '●' : '○'}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 8 }}>
            R = {'{' + pairs.map(([a, b]) => `(${a},${b})`).join(', ') + '}'}
          </div>

          {/* Arrow diagram (SVG) */}
          {setA.length > 0 && setB.length > 0 && (
            <svg
              viewBox={`0 0 320 ${Math.max(220, Math.max(setA.length, setB.length) * 50 + 40)}`}
              style={{ width: '100%', maxWidth: 360, background: '#F8FAFC', borderRadius: 12 }}
            >
              {/* Set A nodes */}
              {setA.map((el, i) => (
                <g key={`a-${el}`}>
                  <circle
                    cx={50}
                    cy={nodeY(i, setA.length)}
                    r={18}
                    fill="#DBEAFE"
                    stroke={COLORS.blue}
                    strokeWidth={2}
                  />
                  <text
                    x={50}
                    y={nodeY(i, setA.length) + 5}
                    textAnchor="middle"
                    fontSize={14}
                    fontWeight={600}
                    fill={COLORS.indigo}
                  >
                    {el}
                  </text>
                </g>
              ))}
              {/* Set B nodes */}
              {setB.map((el, i) => (
                <g key={`b-${el}`}>
                  <circle
                    cx={270}
                    cy={nodeY(i, setB.length)}
                    r={18}
                    fill="#FEF3C7"
                    stroke={COLORS.saffron}
                    strokeWidth={2}
                  />
                  <text
                    x={270}
                    y={nodeY(i, setB.length) + 5}
                    textAnchor="middle"
                    fontSize={14}
                    fontWeight={600}
                    fill={COLORS.indigo}
                  >
                    {el}
                  </text>
                </g>
              ))}
              {/* Arrows */}
              {pairs.map(([a, b], idx) => {
                const iA = setA.indexOf(a);
                const iB = setB.indexOf(b);
                if (iA < 0 || iB < 0) return null;
                const y1 = nodeY(iA, setA.length);
                const y2 = nodeY(iB, setB.length);
                return (
                  <line
                    key={idx}
                    x1={68}
                    y1={y1}
                    x2={252}
                    y2={y2}
                    stroke={COLORS.blue}
                    strokeWidth={2}
                    markerEnd="url(#arrow)"
                  />
                );
              })}
              <defs>
                <marker
                  id="arrow"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0,0 L6,3 L0,6 Z" fill={COLORS.blue} />
                </marker>
              </defs>
            </svg>
          )}
        </section>

        {/* Analysis panel */}
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
            {mode === 'relation' ? 'સંબંધ વિશ્લેષણ' : 'વિધેય વિશ્લેષણ'}
          </h2>

          {mode === 'relation' ? (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                <Badge ok={analysis.isReflexive} label="સ્વવાચક (Reflexive)" />
                <Badge ok={analysis.isSymmetric} label="સમિત (Symmetric)" />
                <Badge ok={analysis.isTransitive} label="પરંપરિત (Transitive)" />
                <Badge ok={analysis.isEquivalence} label="સામ્ય (Equivalence)" />
              </div>

              {analysis.missingReflexive.length > 0 && (
                <p style={{ fontSize: 14, color: COLORS.rose }}>
                  સ્વવાચક બનાવવા માટે જોડી ઉમેરો:{' '}
                  {analysis.missingReflexive.map(([a]) => `(${a},${a})`).join(', ')}
                </p>
              )}
              {analysis.missingSymmetric.length > 0 && (
                <p style={{ fontSize: 14, color: COLORS.rose }}>
                  સમિત બનાવવા માટે જોડી ઉમેરો:{' '}
                  {analysis.missingSymmetric.map(([a, b]) => `(${a},${b})`).join(', ')}
                </p>
              )}
              {analysis.missingTransitive.length > 0 && (
                <p style={{ fontSize: 14, color: COLORS.rose }}>
                  પરંપરિતતા માટે જોડી ઉમેરો:{' '}
                  {analysis.missingTransitive
                    .slice(0, 5)
                    .map(({ a, c }) => `(${a},${c})`)
                    .join(', ')}
                  {analysis.missingTransitive.length > 5 && ' …'}
                </p>
              )}

              {analysis.isEquivalence && analysis.equivalenceClasses.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <strong>સામ્ય વર્ગો (Equivalence Classes):</strong>
                  <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
                    {analysis.equivalenceClasses.map((cls, i) => (
                      <li key={i}>
                        [{cls.join(', ')}]
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                <Badge ok={fnAnalysis.isFunction} label="વિધેય (Function)" />
                <Badge ok={fnAnalysis.isOneOne} label="એક-એક (One-One)" />
                <Badge ok={fnAnalysis.isOnto} label="વ્યાપ્ત (Onto)" />
                <Badge ok={fnAnalysis.isBijective} label="ઉભય (Bijective)" />
              </div>
              <p style={{ fontSize: 14 }}>
                <strong>પ્રદેશ (Domain):</strong> {'{' + fnAnalysis.domain.join(', ') + '}'}
              </p>
              <p style={{ fontSize: 14 }}>
                <strong>સહપ્રદેશ (Codomain):</strong>{' '}
                {'{' + fnAnalysis.codomain.join(', ') + '}'}
              </p>
              <p style={{ fontSize: 14 }}>
                <strong>ચિત્ર (Image):</strong> {'{' + fnAnalysis.image.join(', ') + '}'}
              </p>
              {fnAnalysis.reasons.length > 0 && (
                <ul style={{ color: COLORS.rose, fontSize: 14 }}>
                  {fnAnalysis.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>

        {/* Gujarati explanation */}
        {showExplain && (
          <section
            style={{
              background: '#EEF2FF',
              borderRadius: 16,
              padding: 16,
              border: '1px solid #C7D2FE',
            }}
          >
            <h3 className="gujarati" style={{ margin: '0 0 8px', fontSize: 15 }}>
              સમજૂતી (Explanation)
            </h3>
            {mode === 'relation' ? (
              <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                <p>
                  <strong>સ્વવાચક:</strong> ગણના દરેક ઘટક a માટે (a, a) સંબંધમાં હોવું
                  જોઈએ.
                </p>
                <p>
                  <strong>સમિત:</strong> જો (a, b) હોય તો (b, a) પણ હોવું જોઈએ.
                </p>
                <p>
                  <strong>પરંપરિત:</strong> જો (a, b) અને (b, c) હોય તો (a, c) પણ હોવું
                  જોઈએ.
                </p>
                <p>
                  <strong>સામ્ય સંબંધ:</strong> ત્રણેય ગુણધર્મો સાથે હોય ત્યારે.
                </p>
              </div>
            ) : (
              <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                <p>
                  <strong>વિધેય:</strong> દરેક a ∈ A માટે બરાબર એક જ b ∈ B એવું કે (a, b)
                  ∈ R.
                </p>
                <p>
                  <strong>એક-એક:</strong> અલગ a માટે અલગ b (injective).
                </p>
                <p>
                  <strong>વ્યાપ્ત:</strong> દરેક b ∈ B કોઈ a નું ચિત્ર હોય (surjective).
                </p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
