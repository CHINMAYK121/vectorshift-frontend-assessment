import React, { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';

const storeSelector = (state) => ({
  updateNodeField: state.updateNodeField,
});

export const InputNode = ({ id, data }) => {
  const { updateNodeField } = useStore(storeSelector, shallow);
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data?.inputType || 'Text');
  const [textValue, setTextValue] = useState(data?.textValue || '');

  useEffect(() => {
    updateNodeField(id, 'inputName', currName);
    updateNodeField(id, 'inputType', inputType);
    updateNodeField(id, 'textValue', textValue);
  }, [currName, inputType, textValue, id, updateNodeField]);

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setInputType(e.target.value);
  };

  const handleTextValueChange = (e) => {
    setTextValue(e.target.value);
  };

  const inputIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  );

  const handles = [
    { type: 'source', position: Position.Right, id: 'value' }
  ];

  return (
    <BaseNode
      id={id}
      title="Input Node"
      icon={inputIcon}
      color="var(--accent-indigo)"
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
        <select value={inputType} onChange={handleTypeChange}>
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </label>
      {inputType === 'Text' ? (
        <label>
          Text Content
          <textarea 
            value={textValue} 
            onChange={handleTextValueChange} 
            style={{ width: '100%', resize: 'vertical', minHeight: '60px' }}
            placeholder="Enter text..."
          />
        </label>
      ) : (
        <label>
          Upload File
          <input 
            type="file" 
            style={{ width: '100%', padding: '6px 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}
          />
        </label>
      )}
    </BaseNode>
  );
};
