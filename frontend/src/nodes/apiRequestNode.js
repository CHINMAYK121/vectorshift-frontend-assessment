import React, { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';

const storeSelector = (state) => ({
  updateNodeField: state.updateNodeField,
});

export const APIRequestNode = ({ id, data }) => {
  const { updateNodeField } = useStore(storeSelector, shallow);
  const [method, setMethod] = useState(data?.method || 'GET');
  const [url, setUrl] = useState(data?.url || 'https://api.example.com');

  const handleMethodChange = (e) => {
    setMethod(e.target.value);
    updateNodeField(id, 'method', e.target.value);
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    updateNodeField(id, 'url', e.target.value);
  };

  const apiIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );

  const handles = [
    { type: 'target', position: Position.Left, id: 'trigger' },
    { type: 'source', position: Position.Right, id: 'response' }
  ];

  return (
    <BaseNode
      id={id}
      title="API Request"
      icon={apiIcon}
      color="var(--accent-amber)"
      handles={handles}
    >
      <label>
        Method
        <select value={method} onChange={handleMethodChange}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </label>
      <label>
        Endpoint URL
        <input 
          type="text" 
          value={url} 
          onChange={handleUrlChange} 
          placeholder="https://..."
        />
      </label>
    </BaseNode>
  );
};
