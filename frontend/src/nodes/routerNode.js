import React, { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';

const storeSelector = (state) => ({
  updateNodeField: state.updateNodeField,
});

export const RouterNode = ({ id, data }) => {
  const { updateNodeField } = useStore(storeSelector, shallow);
  const [condition, setCondition] = useState(data?.condition || 'Equals');
  const [value, setValue] = useState(data?.value || '');

  const handleConditionChange = (e) => {
    setCondition(e.target.value);
    updateNodeField(id, 'condition', e.target.value);
  };

  const handleValueChange = (e) => {
    setValue(e.target.value);
    updateNodeField(id, 'value', e.target.value);
  };

  const routerIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="6" r="3" />
      <path d="M18 9v6" />
      <path d="M9 6h6" />
      <path d="M6 9v9h9" />
    </svg>
  );

  const handles = [
    { type: 'target', position: Position.Left, id: 'input' },
    { type: 'source', position: Position.Right, id: 'truePath', style: { top: '33%' } },
    { type: 'source', position: Position.Right, id: 'falsePath', style: { top: '66%' } }
  ];

  return (
    <BaseNode
      id={id}
      title="Condition Router"
      icon={routerIcon}
      color="var(--accent-rose)"
      handles={handles}
    >
      <label>
        Logic Rule
        <select value={condition} onChange={handleConditionChange}>
          <option value="Equals">Equals</option>
          <option value="Contains">Contains</option>
          <option value="Matches">Regex Match</option>
        </select>
      </label>
      <label>
        Matching Value
        <input 
          type="text" 
          value={value} 
          onChange={handleValueChange} 
          placeholder="match string..."
        />
      </label>
    </BaseNode>
  );
};
