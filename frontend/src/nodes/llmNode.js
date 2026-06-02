import React from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  const llmIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="3" x2="15" y2="21" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
    </svg>
  );

  const handles = [
    { type: 'target', position: Position.Left, id: 'system', style: { top: '33%' } },
    { type: 'target', position: Position.Left, id: 'prompt', style: { top: '66%' } },
    { type: 'source', position: Position.Right, id: 'response' }
  ];

  return (
    <BaseNode
      id={id}
      title="LLM Node"
      icon={llmIcon}
      color="var(--accent-purple)"
      handles={handles}
    >
      <div style={{ color: 'var(--text-secondary)', padding: '4px 0', fontSize: '0.8rem' }}>
        Performs high-performance large language model reasoning and text synthesis.
      </div>
    </BaseNode>
  );
};
