'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { GraphData, Language } from '@/types/solution';
import { ZoomIn, ZoomOut, RotateCcw, Sliders, Activity, Info } from 'lucide-react';

interface InteractiveGraphProps {
  data: GraphData;
  lang?: Language;
  width?: number;
  height?: number;
}

// Safe mathematical expression evaluator for graphing
export function evaluateMathFunction(
  expr: string,
  x: number,
  params: Record<string, number> = {}
): number {
  if (!expr || !expr.trim()) return NaN;

  // Substitute parameter slider variables first (e.g. "a", "k")
  let clean = expr;
  for (const [key, val] of Object.entries(params)) {
    const reg = new RegExp(`\\b${key}\\b`, 'g');
    clean = clean.replace(reg, `(${val})`);
  }

  // Handle standard math constants and functions
  clean = clean.replace(/\bpi\b/gi, `${Math.PI}`);
  clean = clean.replace(/\be\b/g, `${Math.E}`);
  clean = clean.replace(/\bsin\b/g, 'Math.sin');
  clean = clean.replace(/\bcos\b/g, 'Math.cos');
  clean = clean.replace(/\btan\b/g, 'Math.tan');
  clean = clean.replace(/\basin\b|\barcsin\b/g, 'Math.asin');
  clean = clean.replace(/\bacos\b|\barccos\b/g, 'Math.acos');
  clean = clean.replace(/\batan\b|\barctan\b/g, 'Math.atan');
  clean = clean.replace(/\bsqrt\b/g, 'Math.sqrt');
  clean = clean.replace(/\babs\b/g, 'Math.abs');
  clean = clean.replace(/\bln\b|\blog\b/g, 'Math.log');
  clean = clean.replace(/\bexp\b/g, 'Math.exp');

  // Convert power notation: x^2 -> (x)**2
  clean = clean.replace(/([a-zA-Z0-9_\.]+|\([^)]+\))\^([a-zA-Z0-9_\.]+|\([^)]+\))/g, 'Math.pow($1, $2)');

  // Safely substitute x
  const sanitizedX = `(${x})`;
  clean = clean.replace(/\bx\b/g, sanitizedX);

  try {
    // Only allow safe math tokens
    if (/[^0-9\s\+\-\*\/\(\)\.\,eEMathpowsincoargtlbq]/.test(clean)) {
      return NaN;
    }
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${clean});`)();
    if (typeof result !== 'number' || !isFinite(result)) return NaN;
    return result;
  } catch {
    return NaN;
  }
}

// Numerical derivative: f'(x) ≈ (f(x+h) - f(x-h)) / (2h)
export function computeDerivative(
  fn: string,
  x: number,
  params: Record<string, number> = {},
  h = 0.0001
): number {
  const y1 = evaluateMathFunction(fn, x + h, params);
  const y0 = evaluateMathFunction(fn, x - h, params);
  if (isNaN(y1) || isNaN(y0)) return NaN;
  return (y1 - y0) / (2 * h);
}

export function InteractiveGraph({
  data,
  lang = 'gu',
  width = 600,
  height = 400,
}: InteractiveGraphProps) {
  // Current view ranges (allows zoom and pan)
  const [xMin, setXMin] = useState<number>(data.xRange[0]);
  const [xMax, setXMax] = useState<number>(data.xRange[1]);
  const [yMin, setYMin] = useState<number>(data.yRange[0]);
  const [yMax, setYMax] = useState<number>(data.yRange[1]);

  // Sliders state
  const [sliderValues, setSliderValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    if (data.sliders) {
      for (const s of data.sliders) {
        init[s.name] = s.defaultValue;
      }
    }
    return init;
  });

  // Tangent visualizer state
  const [showTangent, setShowTangent] = useState<boolean>(!!data.interactiveTangent);
  const [tangentX, setTangentX] = useState<number>(0);

  // Mouse / Touch drag state for panning
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  const padding = 50;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  // Coordinate transforms
  const toSvgX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * plotWidth;
  const toSvgY = (y: number) => height - padding - ((y - yMin) / (yMax - yMin)) * plotHeight;
  const fromSvgX = (svgX: number) => xMin + ((svgX - padding) / plotWidth) * (xMax - xMin);

  // Clamped Origin
  const originX = toSvgX(0);
  const originY = toSvgY(0);

  // Zoom controls
  const handleZoom = (factor: number) => {
    const xCenter = (xMin + xMax) / 2;
    const yCenter = (yMin + yMax) / 2;
    const newXHalf = ((xMax - xMin) * factor) / 2;
    const newYHalf = ((yMax - yMin) * factor) / 2;
    setXMin(xCenter - newXHalf);
    setXMax(xCenter + newXHalf);
    setYMin(yCenter - newYHalf);
    setYMax(yCenter + newYHalf);
  };

  const handleReset = () => {
    setXMin(data.xRange[0]);
    setXMax(data.xRange[1]);
    setYMin(data.yRange[0]);
    setYMax(data.yRange[1]);
  };

  // Pan interactions (mouse and touch)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    const xShift = (dx / plotWidth) * (xMax - xMin);
    const yShift = (dy / plotHeight) * (yMax - yMin);

    setXMin((prev) => prev - xShift);
    setXMax((prev) => prev - xShift);
    setYMin((prev) => prev + yShift);
    setYMax((prev) => prev + yShift);

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  // Touch controls for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !dragStart || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;

    const xShift = (dx / plotWidth) * (xMax - xMin);
    const yShift = (dy / plotHeight) * (yMax - yMin);

    setXMin((prev) => prev - xShift);
    setXMax((prev) => prev - xShift);
    setYMin((prev) => prev + yShift);
    setYMax((prev) => prev + yShift);

    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  // Generate tick marks for axes dynamically based on view scale
  const { xTicks, yTicks } = useMemo(() => {
    const xSpan = xMax - xMin;
    const ySpan = yMax - yMin;

    const calcStep = (span: number) => {
      const rawStep = span / 8;
      const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
      const norm = rawStep / magnitude;
      if (norm < 1.5) return 1 * magnitude;
      if (norm < 3.5) return 2 * magnitude;
      if (norm < 7.5) return 5 * magnitude;
      return 10 * magnitude;
    };

    const xStep = calcStep(xSpan);
    const yStep = calcStep(ySpan);

    const xt: number[] = [];
    const firstX = Math.ceil(xMin / xStep) * xStep;
    for (let x = firstX; x <= xMax; x += xStep) {
      if (Math.abs(x) > 0.0001) xt.push(Number(x.toFixed(4)));
    }

    const yt: number[] = [];
    const firstY = Math.ceil(yMin / yStep) * yStep;
    for (let y = firstY; y <= yMax; y += yStep) {
      if (Math.abs(y) > 0.0001) yt.push(Number(y.toFixed(4)));
    }

    return { xTicks: xt, yTicks: yt };
  }, [xMin, xMax, yMin, yMax]);

  // Curve renderer with domain clamping & discontinuity handling
  const renderCurveSegments = (
    fnStr?: string,
    customPoints?: Array<[number, number]>,
    color = '#4f46e5',
    dashed = false,
    domain?: [number, number]
  ) => {
    if (customPoints && customPoints.length > 0) {
      const d = customPoints
        .map(([x, y], idx) => `${idx === 0 ? 'M' : 'L'} ${toSvgX(x).toFixed(1)} ${toSvgY(y).toFixed(1)}`)
        .join(' ');
      return <path key="custom-pts" d={d} fill="none" stroke={color} strokeWidth="2.5" strokeDasharray={dashed ? '5,5' : 'none'} />;
    }

    if (!fnStr) return null;

    // Determine domain bounds
    const startX = domain ? Math.max(xMin, domain[0]) : xMin;
    const endX = domain ? Math.min(xMax, domain[1]) : xMax;

    if (startX >= endX) return null;

    const samples = 250;
    const dx = (endX - startX) / samples;
    const segments: Array<Array<[number, number]>> = [];
    let currentSegment: Array<[number, number]> = [];

    const yMargin = (yMax - yMin) * 0.5;

    for (let i = 0; i <= samples; i++) {
      const x = startX + i * dx;
      const y = evaluateMathFunction(fnStr, x, sliderValues);

      // Check if value is valid and within reasonable plotting window
      if (isNaN(y) || !isFinite(y) || y < yMin - yMargin || y > yMax + yMargin) {
        if (currentSegment.length > 1) {
          segments.push(currentSegment);
        }
        currentSegment = [];
      } else {
        // Discontinuity jump check (prevents connecting vertical asymptotes like tan x or 1/x)
        if (currentSegment.length > 0) {
          const lastY = currentSegment[currentSegment.length - 1][1];
          const dy = Math.abs(y - lastY);
          if (dy > (yMax - yMin) * 0.6) {
            segments.push(currentSegment);
            currentSegment = [];
          }
        }
        currentSegment.push([x, y]);
      }
    }

    if (currentSegment.length > 1) {
      segments.push(currentSegment);
    }

    return (
      <g key={fnStr}>
        {segments.map((seg, sIdx) => {
          const pathD = seg
            .map(([x, y], idx) => `${idx === 0 ? 'M' : 'L'} ${toSvgX(x).toFixed(1)} ${toSvgY(y).toFixed(1)}`)
            .join(' ');
          return (
            <path
              key={`seg-${sIdx}`}
              d={pathD}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeDasharray={dashed ? '5,5' : 'none'}
            />
          );
        })}
      </g>
    );
  };

  // Tangent line calculation
  const tangentData = useMemo(() => {
    if (!showTangent || !data.curves || data.curves.length === 0 || !data.curves[0].fn) {
      return null;
    }
    const fn = data.curves[0].fn;
    const y0 = evaluateMathFunction(fn, tangentX, sliderValues);
    const slope = computeDerivative(fn, tangentX, sliderValues);

    if (isNaN(y0) || isNaN(slope)) return null;

    // Tangent line: y - y0 = m * (x - x0) => y = m*(x - x0) + y0
    const xSpan = (xMax - xMin) * 0.4;
    const x1 = tangentX - xSpan;
    const y1 = slope * (x1 - tangentX) + y0;
    const x2 = tangentX + xSpan;
    const y2 = slope * (x2 - tangentX) + y0;

    return {
      x0: tangentX,
      y0,
      slope,
      x1,
      y1,
      x2,
      y2,
    };
  }, [showTangent, data.curves, tangentX, sliderValues, xMin, xMax]);

  return (
    <div className="interactive-graph-container my-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm select-none">
      {/* Title & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100 text-xs text-slate-700">
        <div>
          {data.title && (
            <div className="font-bold text-sm text-slate-900">
              {data.title[lang]}
            </div>
          )}
          {data.caption && (
            <div className="text-[11px] text-slate-500">
              {data.caption[lang]}
            </div>
          )}
        </div>

        {/* Interactive Controls */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => handleZoom(0.8)}
            className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-700 shadow-xs transition-all"
            title={lang === 'gu' ? 'ઝૂમ ઇન' : 'Zoom In'}
            aria-label="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom(1.25)}
            className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-700 shadow-xs transition-all"
            title={lang === 'gu' ? 'ઝૂમ આઉટ' : 'Zoom Out'}
            aria-label="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-700 shadow-xs transition-all"
            title={lang === 'gu' ? 'રીસેટ' : 'Reset View'}
            aria-label="Reset graph"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {data.curves?.[0]?.fn && (
            <button
              onClick={() => setShowTangent((prev) => !prev)}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                showTangent ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-slate-200 text-slate-700'
              }`}
              title={lang === 'gu' ? 'સ્પર્શક અને વિકલિત' : 'Tangent & Derivative'}
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'gu' ? 'સ્પર્શક' : 'Tangent'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div className="relative w-full overflow-hidden flex justify-center bg-slate-50/50 rounded-xl border border-slate-200">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className={`w-full max-w-[650px] h-auto cursor-${isDragging ? 'grabbing' : 'grab'}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Subtle Grid Lines */}
          {xTicks.map((x) => (
            <line
              key={`x-grid-${x}`}
              x1={toSvgX(x)}
              y1={padding}
              x2={toSvgX(x)}
              y2={height - padding}
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}
          {yTicks.map((y) => (
            <line
              key={`y-grid-${y}`}
              x1={padding}
              y1={toSvgY(y)}
              x2={width - padding}
              y2={toSvgY(y)}
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}

          {/* Shaded Regions (e.g. LPP Feasible Polygon) */}
          {data.regions?.map((reg, idx) => {
            const polygonPts = reg.points.map(([rx, ry]) => `${toSvgX(rx)},${toSvgY(ry)}`).join(' ');
            return (
              <polygon
                key={`reg-${idx}`}
                points={polygonPts}
                fill={reg.color || 'rgba(99, 102, 241, 0.2)'}
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeDasharray="3,3"
              />
            );
          })}

          {/* X Axis */}
          <line
            x1={padding}
            y1={Math.max(padding, Math.min(height - padding, originY))}
            x2={width - padding + 15}
            y2={Math.max(padding, Math.min(height - padding, originY))}
            stroke="#1e293b"
            strokeWidth="2"
          />
          <polygon
            points={`${width - padding + 15},${originY} ${width - padding + 8},${originY - 4} ${width - padding + 8},${originY + 4}`}
            fill="#1e293b"
          />
          <text
            x={width - padding + 12}
            y={Math.max(padding + 14, Math.min(height - padding - 4, originY + 14))}
            fontSize="12"
            fontWeight="bold"
            fill="#1e293b"
          >
            {data.xLabel || 'x'}
          </text>

          {/* Y Axis */}
          <line
            x1={Math.max(padding, Math.min(width - padding, originX))}
            y1={height - padding}
            x2={Math.max(padding, Math.min(width - padding, originX))}
            y2={padding - 15}
            stroke="#1e293b"
            strokeWidth="2"
          />
          <polygon
            points={`${originX},${padding - 15} ${originX - 4},${padding - 8} ${originX + 4},${padding - 8}`}
            fill="#1e293b"
          />
          <text
            x={Math.max(padding - 18, Math.min(width - padding - 20, originX - 18))}
            y={padding - 10}
            fontSize="12"
            fontWeight="bold"
            fill="#1e293b"
          >
            {data.yLabel || 'y'}
          </text>

          {/* Axis Ticks & Labels */}
          {xTicks.map((x) => (
            <g key={`xtick-${x}`}>
              <line
                x1={toSvgX(x)}
                y1={originY - 3}
                x2={toSvgX(x)}
                y2={originY + 3}
                stroke="#475569"
                strokeWidth="1.5"
              />
              <text
                x={toSvgX(x)}
                y={originY + 14}
                fontSize="10"
                fill="#64748b"
                textAnchor="middle"
              >
                {x}
              </text>
            </g>
          ))}

          {yTicks.map((y) => (
            <g key={`ytick-${y}`}>
              <line
                x1={originX - 3}
                y1={toSvgY(y)}
                x2={originX + 3}
                y2={toSvgY(y)}
                stroke="#475569"
                strokeWidth="1.5"
              />
              <text
                x={originX - 8}
                y={toSvgY(y) + 3}
                fontSize="10"
                fill="#64748b"
                textAnchor="end"
              >
                {y}
              </text>
            </g>
          ))}

          {/* Custom Lines */}
          {data.lines?.map((line, idx) => (
            <g key={`line-${idx}`}>
              <line
                x1={toSvgX(line.x1)}
                y1={toSvgY(line.y1)}
                x2={toSvgX(line.x2)}
                y2={toSvgY(line.y2)}
                stroke={line.color || '#ef4444'}
                strokeWidth="2.5"
                strokeDasharray={line.dashed ? '4,4' : 'none'}
              />
              {line.label && (
                <text
                  x={(toSvgX(line.x1) + toSvgX(line.x2)) / 2 + 5}
                  y={(toSvgY(line.y1) + toSvgY(line.y2)) / 2 - 5}
                  fontSize="11"
                  fill={line.color || '#ef4444'}
                  fontWeight="bold"
                >
                  {line.label}
                </text>
              )}
            </g>
          ))}

          {/* Curves */}
          {data.curves?.map((c) =>
            renderCurveSegments(c.fn, c.points, c.color, c.dashed, c.domain)
          )}

          {/* Interactive Tangent Line */}
          {tangentData && (
            <g key="interactive-tangent">
              <line
                x1={toSvgX(tangentData.x1)}
                y1={toSvgY(tangentData.y1)}
                x2={toSvgX(tangentData.x2)}
                y2={toSvgY(tangentData.y2)}
                stroke="#ec4899"
                strokeWidth="2"
                strokeDasharray="4,3"
              />
              <circle
                cx={toSvgX(tangentData.x0)}
                cy={toSvgY(tangentData.y0)}
                r="5"
                fill="#ec4899"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Continuity & Limit Illustrations */}
          {data.interactiveLimits && (
            <g key="limits-indicator">
              <line
                x1={toSvgX(data.interactiveLimits.point)}
                y1={padding}
                x2={toSvgX(data.interactiveLimits.point)}
                y2={height - padding}
                stroke="#8b5cf6"
                strokeWidth="1.5"
                strokeDasharray="3,3"
              />
              <circle
                cx={toSvgX(data.interactiveLimits.point)}
                cy={toSvgY(data.interactiveLimits.value ?? data.interactiveLimits.leftLimit)}
                r="4.5"
                fill="#8b5cf6"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Fixed Points */}
          {data.points?.map((pt, idx) => (
            <g key={`pt-${idx}`}>
              <circle
                cx={toSvgX(pt.x)}
                cy={toSvgY(pt.y)}
                r="4.5"
                fill={pt.isOpenCircle ? '#ffffff' : pt.color || '#3b82f6'}
                stroke={pt.color || '#3b82f6'}
                strokeWidth="2"
              />
              {pt.label && (
                <text
                  x={toSvgX(pt.x) + 6}
                  y={toSvgY(pt.y) - 6}
                  fontSize="10"
                  fontWeight="bold"
                  fill="#1e293b"
                >
                  {pt.label}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Tangent Scrubbing Controls */}
      {showTangent && tangentData && (
        <div className="mt-3 p-3 bg-pink-50/70 border border-pink-200 rounded-xl text-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-bold text-pink-900">
              {lang === 'gu' ? 'સ્પર્શક બિંદુ (x):' : 'Tangent Point (x):'}
            </span>
            <input
              type="range"
              min={xMin}
              max={xMax}
              step={(xMax - xMin) / 100}
              value={tangentX}
              onChange={(e) => setTangentX(parseFloat(e.target.value))}
              className="w-36 accent-pink-600"
            />
            <span className="font-mono font-bold text-pink-800">
              x = {tangentX.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-pink-950">
            <span>
              y = {tangentData.y0.toFixed(2)}
            </span>
            <span>•</span>
            <span className="font-bold">
              {lang === 'gu' ? 'ઢાળ f\'(x)' : 'Slope f\'(x)'} = {tangentData.slope.toFixed(3)}
            </span>
          </div>
        </div>
      )}

      {/* Parameter Sliders */}
      {data.sliders && data.sliders.length > 0 && (
        <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <span>{lang === 'gu' ? 'પરિમાણ સ્લાઇડર્સ (ચલ મૂલ્યો):' : 'Parameter Sliders:'}</span>
          </div>
          {data.sliders.map((s) => (
            <div key={s.name} className="flex items-center gap-3 text-xs">
              <span className="w-24 text-slate-600 font-medium">{s.label[lang]}:</span>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={sliderValues[s.name] ?? s.defaultValue}
                onChange={(e) =>
                  setSliderValues((prev) => ({
                    ...prev,
                    [s.name]: parseFloat(e.target.value),
                  }))
                }
                className="flex-1 accent-indigo-600"
              />
              <span className="w-12 font-mono font-bold text-indigo-700 text-right">
                {(sliderValues[s.name] ?? s.defaultValue).toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      {data.curves && data.curves.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 mt-2 text-xs text-slate-600">
          {data.curves.map(
            (c, i) =>
              c.label && (
                <div key={i} className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-3.5 h-1 rounded"
                    style={{ backgroundColor: c.color || '#4f46e5' }}
                  />
                  <span className="font-mono text-[11px]">{c.label}</span>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
