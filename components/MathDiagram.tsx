'use client';

import React from 'react';
import { DiagramData, Language } from '@/types/solution';

interface MathDiagramProps {
  data: DiagramData;
  lang?: Language;
}

export function MathDiagram({ data, lang = 'gu' }: MathDiagramProps) {
  return (
    <div className="math-diagram-wrapper my-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
      {data.title && (
        <div className="font-semibold text-slate-800 text-sm mb-2">
          {data.title[lang]}
        </div>
      )}

      {data.type === 'vector_diagram' && (
        <div className="flex justify-center py-2">
          <svg viewBox="0 0 320 220" className="w-full max-w-[320px] h-auto">
            {/* 3D Coordinate axes */}
            {/* X axis (coming forward-left) */}
            <line x1="160" y1="120" x2="60" y2="180" stroke="#64748b" strokeWidth="2" />
            <polygon points="55,183 67,175 63,185" fill="#64748b" />
            <text x="45" y="195" fontSize="12" fontWeight="bold" fill="#334155">X (î)</text>

            {/* Y axis (going right) */}
            <line x1="160" y1="120" x2="280" y2="120" stroke="#64748b" strokeWidth="2" />
            <polygon points="287,120 277,115 277,125" fill="#64748b" />
            <text x="292" y="124" fontSize="12" fontWeight="bold" fill="#334155">Y (ĵ)</text>

            {/* Z axis (going up) */}
            <line x1="160" y1="120" x2="160" y2="25" stroke="#64748b" strokeWidth="2" />
            <polygon points="160,18 155,28 165,28" fill="#64748b" />
            <text x="156" y="12" fontSize="12" fontWeight="bold" fill="#334155">Z (k̂)</text>

            {/* Vector r = xi + yj + zk */}
            <line x1="160" y1="120" x2="230" y2="55" stroke="#ef4444" strokeWidth="3" />
            <polygon points="234,51 223,56 229,64" fill="#ef4444" />
            <text x="238" y="52" fontSize="12" fontWeight="bold" fill="#ef4444">
              r⃗ = xî + yĵ + zk̂
            </text>

            {/* Projections dashed */}
            <line x1="230" y1="55" x2="230" y2="135" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,3" />
            <line x1="160" y1="120" x2="230" y2="135" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,3" />
            <circle cx="230" cy="55" r="4" fill="#ef4444" />
            <circle cx="160" cy="120" r="3.5" fill="#334155" />
            <text x="145" y="132" fontSize="11" fill="#64748b">O(0,0,0)</text>
          </svg>
        </div>
      )}

      {data.description && (
        <div className="text-xs text-slate-500 mt-1 italic">
          {data.description[lang]}
        </div>
      )}
    </div>
  );
}
