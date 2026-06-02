import React, { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';

const storeSelector = (state) => ({
  updateNodeField: state.updateNodeField,
});

export const DatabaseNode = ({ id, data }) => {
  const { updateNodeField } = useStore(storeSelector, shallow);
  const [table, setTable] = useState(data?.table || 'users');
  const [operation, setOperation] = useState(data?.operation || 'SELECT');

  const handleTableChange = (e) => {
    setTable(e.target.value);
    updateNodeField(id, 'table', e.target.value);
  };

  const handleOperationChange = (e) => {
    setOperation(e.target.value);
    updateNodeField(id, 'operation', e.target.value);
  };

  const dbIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
    </svg>
  );

  const handles = [
    { type: 'target', position: Position.Left, id: 'query' },
    { type: 'source', position: Position.Right, id: 'results' }
  ];

  return (
    <BaseNode
      id={id}
      title="Database Node"
      icon={dbIcon}
      color="var(--accent-blue)"
      handles={handles}
    >
      <label>
        Table Name
        <input 
          type="text" 
          value={table} 
          onChange={handleTableChange} 
          placeholder="users..."
        />
      </label>
      <label>
        Operation
        <select value={operation} onChange={handleOperationChange}>
          <option value="SELECT">SELECT</option>
          <option value="INSERT">INSERT</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
        </select>
      </label>
    </BaseNode>
  );
};
