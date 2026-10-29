'use client';

import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  math: string;
  block?: boolean;
  className?: string;
}

export function MathRenderer({ math, block = false, className = '' }: MathRendererProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        output: 'html',
      });
    } catch {
      return `<span class="katex-error">${math}</span>`;
    }
  }, [math, block]);

  if (block) {
    return (
      <div
        className={`math-block-container overflow-x-auto py-2 my-1 ${className}`}
        style={{ WebkitOverflowScrolling: 'touch' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`math-inline-container inline-block ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * MixedText renders mixed text containing plain strings (Gujarati Unicode or English)
 * and embedded LaTeX formulas formatted as \( ... \), \[ ... \], $$ ... $$, or $ ... $.
 */
export function MixedText({ text, className = '' }: { text: string; className?: string }) {
  const segments = useMemo(() => {
    if (!text) return [];

    // Regex to split on \(...\), \[...\], $$...$$, or $...$
    const regex = /(\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$\$[\s\S]*?\$\$|(?<!\\)\$[\s\S]*?(?<!\\)\$)/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (!part) return null;

      // Display math \[ ... \]
      if (part.startsWith('\\[') && part.endsWith('\\]')) {
        return (
          <MathRenderer
            key={index}
            math={part.slice(2, -2).trim()}
            block={true}
          />
        );
      }

      // Display math $$ ... $$
      if (part.startsWith('$$') && part.endsWith('$$') && part.length >= 4) {
        return (
          <MathRenderer
            key={index}
            math={part.slice(2, -2).trim()}
            block={true}
          />
        );
      }

      // Inline math \( ... \)
      if (part.startsWith('\\(') && part.endsWith('\\)')) {
        return (
          <MathRenderer
            key={index}
            math={part.slice(2, -2).trim()}
            block={false}
          />
        );
      }

      // Inline math $ ... $
      if (part.startsWith('$') && part.endsWith('$') && part.length >= 2) {
        return (
          <MathRenderer
            key={index}
            math={part.slice(1, -1).trim()}
            block={false}
          />
        );
      }

      // Normal text (Gujarati / English)
      return <span key={index}>{part}</span>;
    });
  }, [text]);

  return <span className={className}>{segments}</span>;
}
