import React, { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';

const storeSelector = (state) => ({
  updateNodeField: state.updateNodeField,
});

export const OutputNode = ({ id, data }) => {
  const { updateNodeField } = useStore(storeSelector, shallow);
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');

  useEffect(() => {
    updateNodeField(id, 'outputName', currName);
    updateNodeField(id, 'outputType', outputType);
  }, [currName, outputType, id, updateNodeField]);

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setOutputType(e.target.value);
  };

  const outputIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );

  const handles = [
    { type: 'target', position: Position.Left, id: 'value' }
  ];

  return (
    <BaseNode
      id={id}
      title="Output Node"
      icon={outputIcon}
      color="var(--accent-emerald)"
      handles={handles}
    >
      <label>
        Name
        <input 
          type="text" 
          value={currName} 
          onChange={handleNameChange} 
        />
      </label>
      <label>
        Type
        <select value={outputType} onChange={handleTypeChange}>
          <option value="Text">Text</option>
          <option value="Image">Image</option>
        </select>
      </label>
    </BaseNode>
  );
};
