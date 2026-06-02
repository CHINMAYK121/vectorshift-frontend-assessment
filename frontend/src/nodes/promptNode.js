import React, { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';

const storeSelector = (state) => ({
  updateNodeField: state.updateNodeField,
});

export const PromptNode = ({ id, data }) => {
  const { updateNodeField } = useStore(storeSelector, shallow);
  const [template, setTemplate] = useState(data?.template || 'Creative');
  const [promptText, setPromptText] = useState(data?.promptText || '');

  const handleTemplateChange = (e) => {
    setTemplate(e.target.value);
    updateNodeField(id, 'template', e.target.value);
  };

  const handlePromptChange = (e) => {
    setPromptText(e.target.value);
    updateNodeField(id, 'promptText', e.target.value);
  };

  const promptIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" />
      <path d="m14 7 3 3" />
      <path d="M5 6v4" />
      <path d="M19 14v4" />
      <path d="M10 2v2" />
      <path d="M7 8H3" />
    </svg>
  );

  const handles = [
    { type: 'target', position: Position.Left, id: 'input' },
    { type: 'source', position: Position.Right, id: 'prompt' }
  ];

  return (
    <BaseNode
      id={id}
      title="Prompt Node"
      icon={promptIcon}
      color="var(--accent-pink)"
      handles={handles}
    >
      <label>
        Template Style
        <select value={template} onChange={handleTemplateChange}>
          <option value="Creative">Creative Writing</option>
          <option value="Technical">Technical Draft</option>
          <option value="Summarize">Summarization</option>
        </select>
      </label>
      <label>
        Prompt Body
        <textarea 
          value={promptText} 
          onChange={handlePromptChange} 
          placeholder="Type instructions here..."
          style={{ height: '50px', resize: 'none' }}
        />
      </label>
    </BaseNode>
  );
};
