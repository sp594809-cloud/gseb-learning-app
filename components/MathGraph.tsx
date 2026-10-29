'use client';

import React from 'react';
import { GraphData, Language } from '@/types/solution';

interface MathGraphProps {
  data: GraphData;
  lang?: Language;
  width?: number;
  height?: number;
}

export function MathGraph({ data, lang = 'gu', width = 500, height = 350 }: MathGraphProps) {
  const [xMin, xMax] = data.xRange;
  const [yMin, yMax] = data.yRange;

  const padding = 45;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  // Coordinate transforms
  const toSvgX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * plotWidth;
  const toSvgY = (y: number) => height - padding - ((y - yMin) / (yMax - yMin)) * plotHeight;

  // Origin
  const originX = toSvgX(0);
  const originY = toSvgY(0);

  // Generate tick marks for axes
  const xTicks: number[] = [];
  const xStep = Math.max(1, Math.round((xMax - xMin) / 8));
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x += xStep) {
    if (Math.abs(x) > 0.001) xTicks.push(x);
  }

  const yTicks: number[] = [];
  const yStep = Math.max(1, Math.round((yMax - yMin) / 8));
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y += yStep) {
    if (Math.abs(y) > 0.001) yTicks.push(y);
  }

  // Generate points for mathematical curves
  const renderCurve = (fnStr?: string, customPoints?: Array<[number, number]>, color = '#4f46e5', dashed = false) => {
    let pts: Array<[number, number]> = [];
    if (customPoints && customPoints.length > 0) {
      pts = customPoints;
    } else if (fnStr) {
      const steps = 120;
      const dx = (xMax - xMin) / steps;
      for (let i = 0; i <= steps; i++) {
        const x = xMin + i * dx;
        try {
          // Safe evaluation for basic mathematical functions
          let y = 0;
          if (fnStr === 'x * sin(x)') {
            y = x * Math.sin(x);
          } else if (fnStr === 'sin(x) - x * cos(x)') {
            y = Math.sin(x) - x * Math.cos(x);
          } else if (fnStr === '2 * 3.14159 * x') {
            y = 2 * Math.PI * x;
          } else if (fnStr.includes('x^2')) {
            y = x * x;
          } else if (fnStr.includes('sin(x)')) {
            y = Math.sin(x);
          } else if (fnStr.includes('cos(x)')) {
            y = Math.cos(x);
          } else {
            // Linear default fallback
            y = x;
          }

          if (y >= yMin - (yMax - yMin) * 0.2 && y <= yMax + (yMax - yMin) * 0.2) {
            pts.push([x, y]);
          }
        } catch {
          // ignore parsing error
        }
      }
    }

    if (pts.length < 2) return null;

    const pathD = pts
      .map(([x, y], idx) => `${idx === 0 ? 'M' : 'L'} ${toSvgX(x).toFixed(1)} ${toSvgY(y).toFixed(1)}`)
      .join(' ');

    return (
      <path
        key={fnStr || 'curve'}
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeDasharray={dashed ? '5,5' : 'none'}
      />
    );
  };

  return (
    <div className="math-graph-wrapper my-4 p-3 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {data.title && (
        <div className="text-center font-semibold text-slate-800 text-sm mb-2">
          {data.title[lang]}
        </div>
      )}

      <div className="w-full flex justify-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[500px] h-auto select-none"
          style={{ background: '#fafafa', borderRadius: '8px' }}
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
            stroke="#334155"
            strokeWidth="2"
          />
          {/* X Axis Arrow */}
          <polygon
            points={`${width - padding + 15},${originY} ${width - padding + 8},${originY - 4} ${width - padding + 8},${originY + 4}`}
            fill="#334155"
          />
          <text
            x={width - padding + 12}
            y={originY + 16}
            fontSize="12"
            fontWeight="bold"
            fill="#334155"
          >
            {data.xLabel || 'x'}
          </text>

          {/* Y Axis */}
          <line
            x1={Math.max(padding, Math.min(width - padding, originX))}
            y1={height - padding}
            x2={Math.max(padding, Math.min(width - padding, originX))}
            y2={padding - 15}
            stroke="#334155"
            strokeWidth="2"
          />
          {/* Y Axis Arrow */}
          <polygon
            points={`${originX},${padding - 15} ${originX - 4},${padding - 8} ${originX + 4},${padding - 8}`}
            fill="#334155"
          />
          <text
            x={originX - 18}
            y={padding - 10}
            fontSize="12"
            fontWeight="bold"
            fill="#334155"
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

          {/* Origin Label (0,0) */}
          <text
            x={originX - 6}
            y={originY + 14}
            fontSize="10"
            fill="#64748b"
            textAnchor="end"
          >
            0
          </text>

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

          {/* Render Curves */}
          {data.curves?.map((c) => renderCurve(c.fn, c.points, c.color, c.dashed))}

          {/* Points */}
          {data.points?.map((pt, idx) => (
            <g key={`pt-${idx}`}>
              <circle
                cx={toSvgX(pt.x)}
                cy={toSvgY(pt.y)}
                r="4.5"
                fill={pt.color || '#3b82f6'}
                stroke="#ffffff"
                strokeWidth="1.5"
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
                  <span>{c.label}</span>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
