import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Position } from 'reactflow';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';
import { BaseNode } from './BaseNode';

const storeSelector = (state) => ({
  updateNodeField: state.updateNodeField,
});

export const TextNode = ({ id, data }) => {
  const { updateNodeField } = useStore(storeSelector, shallow);
  const [currText, setCurrText] = useState(data?.text || '{{input}}');

  // ─── 1. Variable extraction ───────────────────────────────────
  const variables = useMemo(() => {
    const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const extracted = [];
    let match;
    while ((match = regex.exec(currText)) !== null) {
      if (!extracted.includes(match[1])) {
        extracted.push(match[1]);
      }
    }
    return extracted;
  }, [currText]);

  // Sync state to store via useEffect
  useEffect(() => {
    updateNodeField(id, 'text', currText);
    updateNodeField(id, 'variables', variables);
  }, [currText, variables, id, updateNodeField]);

  // ─── 2. Dynamic sizing ────────────────────────────────────────
  const dimensions = useMemo(() => {
    const lines = currText.split('\n');
    const longestLine = Math.max(...lines.map(l => l.length), 10);

    // Base width for text + extra room if variables exist
    const varColumnWidth = variables.length > 0 ? 90 : 0;
    const width = Math.min(Math.max(240, longestLine * 7.5 + 48 + varColumnWidth), 520);

    // Height accounts for both text lines and variable count
    const textHeight = lines.length * 20 + 110;
    const handleHeight = variables.length * 32 + 90;
    const height = Math.min(Math.max(textHeight, handleHeight, 130), 450);

    return { width, height };
  }, [currText, variables.length]);

  const handleTextChange = useCallback((e) => {
    setCurrText(e.target.value);
  }, []);

  const textIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );

  const handles = [
    { type: 'source', position: Position.Right, id: 'output' },
    ...variables.map((variable, index) => {
      const bodyTop = 60; // approximate start of the body area
      const bodyHeight = dimensions.height - bodyTop - 10;
      const step = bodyHeight / (variables.length + 1);
      const topPx = bodyTop + step * (index + 1);

      return {
        type: 'target',
        position: Position.Left,
        id: variable,
        style: { top: `${topPx}px` }
      };
    })
  ];

  return (
    <BaseNode
      id={id}
      title="Text"
      icon={textIcon}
      color="var(--accent-blue)"
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        transition: 'width 0.15s ease, height 0.15s ease',
      }}
      handles={handles}
    >
      {/* ── Body: two-column layout (variable labels | textarea) ── */}
      <div style={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
        minHeight: 0,
      }}>
        {/* Left column: variable labels (only rendered when variables exist) */}
        {variables.length > 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '6px',
            paddingLeft: '2px',
            flexShrink: 0,
          }}>
            {variables.map((variable) => (
              <div
                key={variable}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    color: 'var(--accent-blue)',
                    background: 'rgba(59, 130, 246, 0.08)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.3px',
                  }}
                >
                  {variable}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Right column: textarea */}
        <div className="base-node-body" style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}>
          <label style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            Text
            <textarea
              value={currText}
              onChange={handleTextChange}
              style={{
                flexGrow: 1,
                width: '100%',
                resize: 'none',
              }}
              placeholder='Use {{variable}} to create input handles'
            />
          </label>
        </div>
      </div>
    </BaseNode>
  );
};
